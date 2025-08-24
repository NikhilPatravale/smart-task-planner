import TicketModel from "../models/Ticket.js";
import { inngest } from "../inngest/client.js";

export const CreateTicket = async (req, res) => {
  try {
    const { title, description } = req.body;
    const user = req.user;

    if (!title || !description) {
      return res.status(400).json({
        error: "Title and description are required to create new ticket",
      })
    }

    const newTicket = await TicketModel.create({
      title,
      description,
      createdBy: user.id,
    });

    await inngest.send({
      name: "ticket/created",
      data: {
        ticketId: newTicket._id,
      }
    });

    return res.status(201).json({
      message: "Ticket created successfully",
      ticket: newTicket,
    });
  } catch (error) {
    console.error("❌ Error while creating new ticket", error.message);
    return res.status(500).json({
      error: "Internal Server Error",
      message: error.message
    });
  }
};

export const GetTickets = async (req, res) => {
  try {
    const user = req.user;
    let tickets = [];

    if (user.role === "user") {
      tickets = await TicketModel.find({ createdBy: user._id })
        .select("title description status createdAt assignedTo priority")
        .sort({ createdAt: -1 });
    } else {
      tickets = await TicketModel.find({})
        .populate("assignedTo", ["email", "_id"])
        .sort({ createdAt: -1 });
    }

    return res.status(200).json({ tickets });
  } catch (error) {
    console.error("❌ Error while fetching tickets");
    res.status(500).json({
      error: "Internal Server Error",
      message: error.message
    });
  }
};

export const GetTicket = async (req, res) => {
  try {
    const ticketId = req.params.id;
    const user = req.user;

    let ticket = null;

    if (user.role === "user") {
      ticket = await TicketModel.findOne({ createdBy: user._id, _id: ticketId });
    } else {
      ticket = await TicketModel.findById(ticketId)
        .populate("assignedTo", ["email", "_id"]);
    }

    if (!ticket) {
      return res.status(404).json({
        error: "Ticket not found"
      })
    }

    return res.status(200).json({ ticket });
  } catch (error) {
    console.error("❌ Error while fetching ticket");
    res.status(500).json({
      error: "Internal Server Error",
      message: error.message
    });
  }
};