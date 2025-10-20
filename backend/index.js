import express from "express";
import dotenv from "dotenv";
import connectDb from "./configs/db.js";
import authRouter from "./routes/authRoute.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/userRoute.js";
import testRouter from "./routes/testRoute.js";
import mcqRouter from "./routes/mcqRoute.js";
import noteRouter from "./routes/noteRoute.js";
import questionRouter from "./routes/questionRoute.js";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// ✅ Fix for __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();
const port = process.env.PORT || 5000;
const app = express();

// ✅ Define allowed origins
const allowedOrigins = [
  "https://www.indraprasthaneetacademy.com",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175"
];

// ✅ CORS middleware with dynamic origin validation
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

// ✅ Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ Static file serving
app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));

// ✅ API routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/test-series", testRouter);
app.use("/api/mcq", mcqRouter);
app.use("/api/notes", noteRouter);
app.use("/api/questions", questionRouter);

// ✅ Root route
app.get("/", (req, res) => {
  res.send("Hello From Server");
});

// ✅ Start server
app.listen(port, () => {
  console.log(`🚀 Server started on port ${port}`);
  connectDb();
});
