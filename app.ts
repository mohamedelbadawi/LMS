import bodyParser from "body-parser";
import { config } from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./server/routes/auth.route";
import userRouter from "./server/routes/user.route";
import courseRouter from "./server/routes/course.route";
import ErrorHandlerMiddleware from "./server/middleware/error";

export const app = express();

config();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(
  cors({
    origin: process.env.ORIGIN,
  })
);
// routes
app.use("/api/v1/", authRouter);
app.use("/api/v1/user/", userRouter);
app.use("/api/v1/course/", courseRouter);

// testing
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ message: "All is good !" });
});

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.status = 404;
  next(err);
});

app.use(ErrorHandlerMiddleware);
