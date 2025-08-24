import { NonRetriableError } from "inngest";
import TicketModel from "../../models/Ticket.js";
import UserModel from "../../models/User.js";
import { inngest } from "../client.js";
import { getAIResponse } from "../../utils/ai.js";
import { sendMail } from "../../utils/mailer.js";

export const onTicketCreation = inngest.createFunction(
  { id: "on ticket creation" },
  { event: "ticket/created" },
  async ({ event, step }) => {
    const { ticketId } = event.data;

    try {
      const ticketToAnalyze = await step.run(
        { name: "fetch-ticket" },
        async () => {
          const ticket = await TicketModel.findById(ticketId);

          if (!ticket) {
            throw new NonRetriableError("Ticket not found");
          }

          return ticket;
        }
      );

      console.log("Fetched ticket to analyze:", JSON.stringify(ticketToAnalyze));

      const updatedTicket = await step.run(
        { name: "Change ticket status to IN PROGRESS" },
        async () => {
          const ticketAfterUpdate = await TicketModel.findByIdAndUpdate(
            ticketToAnalyze._id,
            {
              status: "TO DO",
            },
            { new: true }
          );
          return ticketAfterUpdate;
        }
      );

      console.log("Updated ticket after status update:", JSON.stringify(updatedTicket));

      const aiResponse = await getAIResponse(updatedTicket);

      const ticketAfterAIRespDetailsUpdate = await step.run(
        { name: "Update ticket details with AI response" },
        async () => {
          const afterUpdate = await TicketModel.findByIdAndUpdate(
            updatedTicket._id,
            {
              priority: ["low", "medium", "high"].includes(aiResponse?.priority)
                ? aiResponse?.priority?.upperCase()
                : "MEDIUM",
              helpfulNotes: aiResponse?.helpfulNotes,
              status: "IN PROGRESS",
              relatedSkills: aiResponse?.relatedSkills,
            },
            { new: true },
          );

          return afterUpdate;
        }
      );

      console.log(`\n✅Updated ticket with AI response.\n${JSON.stringify(ticketAfterAIRespDetailsUpdate)}\n`);

      const matchedUsers = await step.run(
        { name: "Get users with matching skills" },
        async () => {
          const usersWithMatchingSkills = await UserModel.find({
            skills: {
              $elemMatch: {
                $regex: aiResponse?.relatedSkills ? aiResponse?.relatedSkills?.join("|") : '',
                $options: "i"
              }
            }
          }).select("-password -createdAt");

          return usersWithMatchingSkills;
        }
      );

      console.log("All matched users:", JSON.stringify(matchedUsers));

      const userToAssign = await step.run(
        { name: "" },
        async () => {
          let finalUser;

          if (matchedUsers.length > 0) {
            finalUser = matchedUsers[0];
          } else {
            const adminUser = await UserModel.findOne({ role: "admin" }).select("-password -createdAt");
            finalUser = adminUser;
          }

          await TicketModel.findByIdAndUpdate(ticketAfterAIRespDetailsUpdate._id, {
            assignedTo: finalUser,
          });

          return finalUser;
        }
      );

      console.log(`\n✅Final user selected to assign ticket:\n${JSON.stringify(userToAssign)}\n`);

      const emailInfo = await step.run(
        { name: "Send email notification to assigned user" },
        async () => {
          const finalTicket = await TicketModel.findById(updatedTicket._id);
          const sentEmailInfo = await sendMail(
            "nikhilpatravale2373@gmail.com",
            'New Ticket Assigned',
            `A new ticket is assigned to you. \n\nTicket Details:\n\nTitle: \n${finalTicket.title}\n\nDescription: \n${finalTicket.description}\n\nPriority: \n${finalTicket.priority}`
          );

          return sentEmailInfo;
        }
      );

      console.log(`\n📧Email sent to assigned user:\n${JSON.stringify(emailInfo)}\n`);

      return { success: true };
    } catch (error) {
      console.error("❌ Error running step on ticket creation", error.message);
      return { success: false };
    }
  },
);