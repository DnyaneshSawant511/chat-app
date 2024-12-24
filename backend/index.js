import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./src/routes/auth.route.js";
import messageRoutes from "./src/routes/message.route.js";

import { connectDB } from "./src/lib/db.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

dotenv.config();
const PORT = process.env.PORT;

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

app.listen(PORT, () => {
    console.log('server is running on port ' + PORT);
    connectDB();
});