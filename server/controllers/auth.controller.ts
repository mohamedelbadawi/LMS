import { NextFunction, Request, Response } from "express";
import { authServices } from "../services/auth.services";
import { ICreationBody } from "../interfaces/userCreationInterface";
import ErrorHandler from "../utils/ErrorHandler";
import { asyncHandler } from "../middleware/asyncErrorHandler";
import sendEmail from "../utils/sendEmail";
import { IActivationRequest } from "../interfaces/IActivationRequest";
import { IUser } from "../models/user.model";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
class AuthController {
  public static register = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { name, email, password, avatar } = req.body;

        const isEmailExist = await authServices.getOneByEmail(email);
        if (isEmailExist.length) {
          return next(new ErrorHandler("this email already exists", 400));
        }

        const user: ICreationBody = {
          email,
          name,
          password,
        };

        const { token, activationCode } =
          authServices.createActivationToken(user);

        const data = {
          user: { name: user.name },
          activationCode: activationCode,
        };

        try {
          await sendEmail({
            email: user.email,
            subject: "Active your Account",
            template: "activation-email.ejs",
            data: data,
          });
          res.status(200).json({
            success: true,
            message: "Please check your email to activate your account",
            token: token,
          });
        } catch (error: any) {
          return next(new ErrorHandler(error.message, 400));
        }
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
      }
    }
  );

  public static activeUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { activationCode, activationToken } =
          req.body as IActivationRequest;

        const newUser: { user: IUser; activationCode: String } = jwt.verify(
          activationToken,
          process.env.ACTIVATION_SECRET as string
        ) as { user: IUser; activationCode: string };

        if (newUser.activationCode !== activationCode) {
          return next(new ErrorHandler("Invalid Activation Code", 400));
        }

        const { name, email, password } = newUser.user;

        const existUser = await authServices.getOneByEmail(email);
        if (existUser.length) {
          return next(new ErrorHandler("Email Already Exist", 400));
        }
        const user = await authServices.register({
          name: name,
          email: email,
          password: password,
        } as ICreationBody);

        res.status(201).json({ success: true });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
      }
    }
  );
  public static login = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { email, password } = req.body;
      const user: IUser[] = await authServices.getUserDataLogin(email);
      if (!user.length) {
        return next(new ErrorHandler("Invalid Credentials", 400));
      }

      if (await bcrypt.compare(password, user[0].password)) {
        const { accessToken, refreshToken } = await authServices.generateTokens(
          user[0]
        );

        res.cookie("accessToken", accessToken, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
        });
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({ success: true });
      }

      return next(new ErrorHandler("Invalid Credentials", 400));
    }
  );

  public static authUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const user = req.user;
        return res.status(200).json({ user: user, success: true });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
      }
    }
  );

  public static refresh = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const refreshToken = req.cookies["refreshToken"];
        const payload: any = jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN as string
        );
        if (!payload) {
          return res.status(400).json({ message: "UnAuth user" });
        }
        const accessToken = await authServices.generateAccessToken(payload.id);
        res.cookie("accessToken", accessToken, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
        });
        return res.status(200).json({ success: true });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
      }
    }
  );
  public static logout = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        authServices.deleteTokens(res);
        return res.status(200).json({
          success: "true",
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
      }
    }
  );
}
export default AuthController;
