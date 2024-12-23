import express from "express";
import dotenv from "dotenv";
import authRoutes from "./src/routes/auth.route.js";

import { connectDB } from "./src/lib/db.js";

const app = express();

app.use(express.json());

dotenv.config();
const PORT = process.env.PORT;

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
    console.log('server is running on port ' + PORT);
    connectDB();
});