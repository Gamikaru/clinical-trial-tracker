import cors from "cors"; // Import CORS
import dotenv from "dotenv";
import express from "express";
import authRoutes from "./routes/auth";
import participantRoutes from "./routes/participants";
import trialRoutes from "./routes/trials";

dotenv.config();

const app = express();

app.use(cors()); // Enable CORS
app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/trials", trialRoutes);
app.use("/api/v1/participants", participantRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
