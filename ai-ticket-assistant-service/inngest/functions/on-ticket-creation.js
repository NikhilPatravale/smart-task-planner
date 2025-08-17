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
            throw NonRetriableError("Ticket not found");
          }

          return ticket;
        }
      );

      await step.run(
        { name: "Change ticket status to TODO" },
        async () => {
          await TicketModel.findByIdAndUpdate(ticketToAnalyze._id, {
            status: "TODO",
          })
        }
      );

      const aiResponse = await step.run(
        { name: "Get AI response" },
        async () => {
          return await getAIResponse(ticketToAnalyze);
        }
      );

      await step.run(
        { name: "Update ticket details" },
        async () => {
          await TicketModel.findByIdAndUpdate(ticketToAnalyze._id, {
            priority: ["low", "medium", "high"].includes(aiResponse?.priority)
              ? priority
              : "medium",
            helpfulNotes: aiResponse?.helpfulNotes,
            status: "IN_PROGRESS",
            relatedSkills: aiResponse?.relatedSkills,
          });
        }
      )

      const assignedToUser = await step.run(
        { name: "Assign ticket to moderator or admin" },
        async () => {
          const usersWithMatchingSkills = await UserModel.find({
            skills: {
              $elemMatch: {
                $regex: aiResponse?.relatedSkills?.join("|"),
                $options: "i"
              }
            }
          });

          let finalUser;

          if (usersWithMatchingSkills.length) {
            finalUser = usersWithMatchingSkills[0];
          } else {
            const adminUser = await UserModel.findOne({ role: "admin" });
            finalUser = adminUser;
          }

          await TicketModel.findByIdAndUpdate(ticketToAnalyze._id, {
            assignedTo: finalUser,
          })

          return finalUser;
        }
      );

      await step.run(
        { name: "Send email notification" },
        async () => {
          const finalTicket = await TicketModel.findById(ticketToAnalyze._id);
          await sendMail(
            assignedToUser.email,
            `Ticket is assigned: ${finalTicket._id}`,
            `A new ticket is assigned to you.
             \n\n
             Details:
             \n
             Title: ${finalTicket.title},
             Description: ${finalTicket.description}
             Priority: ${finalTicket.priority}
            `
          );
        }
      );

      return { success: true };
    } catch (error) {
      console.error("❌ Error running step on ticket creation", error.message);
      return { success: false };
    }
  },
);