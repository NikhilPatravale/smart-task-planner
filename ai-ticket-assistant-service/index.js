import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotEnv from 'dotenv';

import { serve } from 'inngest/express';
import { inngest } from './inngest/client.js';
import { onUserSignUp } from "./inngest/functions/on-signup.js";
import { onTicketCreation } from "./inngest/functions/on-ticket-creation.js";

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';

dotEnv.config();

const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/ticket", ticketRoutes);

app.use("/api/inngest", serve({
  client: inngest,
  functions: [onUserSignUp, onTicketCreation],
}))

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connection successful..");
    app.listen(PORT, () => console.log(`🚀 Server listening at http://localhost:${PORT}`))
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed...", err.message);
    throw (err);
  });
