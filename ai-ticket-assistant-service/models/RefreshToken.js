import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema({
  jti: { type: String, default: null },
  userId: { type: String, default: "" },
  expiresAt: { type: Date },
  revoked: Boolean,
  replacedBy: { type: String, default: null }
});

export default mongoose.model("RefreshToken", refreshTokenSchema);