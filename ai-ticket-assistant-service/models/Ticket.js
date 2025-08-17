import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, default: "TODO", enum: ["TODO", "IN PROGRESS", "COMPLETE"] },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  helpfulNotes: String,
  priority: String,
  deadline: String,
  relatedSkills: [String],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Ticket", ticketSchema);