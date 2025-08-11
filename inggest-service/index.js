import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotEnv from 'dotenv';

dotEnv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connection successful..");
    app.listen(PORT, () => console.log(`🚀 Server listening at http://localhost:${PORT}`))
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed...", err.message);
    throw (err);
  });
