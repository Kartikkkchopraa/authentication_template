import express from "express";
import morgan from 'morgan'
import authRouter from "./routes/authRoutes.js";
import cors from "cors"
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(cookieParser());

app.use("/api/auth", authRouter);

export default app;




