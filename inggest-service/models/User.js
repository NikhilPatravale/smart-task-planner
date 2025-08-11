import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default: "user", enum: ["user", "moderator", "admin"] },
  createdAt: { type: Date, default: Date.now },
  skills: [String],
});

export default new mongoose.model("User", userSchema);