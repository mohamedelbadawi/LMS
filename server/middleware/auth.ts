import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import ErrorHandler from "../utils/ErrorHandler";
import { authServices } from "../services/auth.services";
import { IUser } from "../models/user.model";
require("dotenv").config();
export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.cookies["accessToken"] as string;
    if (!accessToken) {
      return next(new ErrorHandler("Un Auth", 400));
    }
    const payload: any = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN as string
    );

    if (!payload) {
      return next(new ErrorHandler("UnAuth user", 400));
    }
    const user: IUser[] = await authServices.getOneById(payload.id);
    if (!user) {
      return next(new ErrorHandler("User not found", 400));
    }
    req.user = user[0];
    next();
  } catch (error: any) {
    next(new ErrorHandler(error.message, 400));
  }
};
