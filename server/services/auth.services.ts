import { ICreationBody } from "../interfaces/userCreationInterface";
import jwt, { Secret } from "jsonwebtoken";
import { userRepository } from "../repositories/userRepository";
import { IUser } from "../models/user.model";
import { Response } from "express";

require("dotenv").config();
class AuthServices {
  async register(userData: ICreationBody) {
    const user = await userRepository.create(userData);
    return user;
  }

  createActivationToken(user: ICreationBody) {
    const activationCode = Math.floor(1000 * Math.random() * 9000).toString();
    const token = jwt.sign(
      {
        user,
        activationCode,
      },
      process.env.ACTIVATION_SECRET as Secret,
      {
        expiresIn: "15m",
      }
    );
    return { token, activationCode };
  }

  async getOneByEmail(email: string) {
    return await userRepository.getOneByEmail(email);
  }
  async getOneById(id: string) {
    return await userRepository.getOneById(id, ["name", "email"]);
  }
  async getUserDataLogin(email: string) {
    const user = await userRepository.getOneByEmail(email, [
      "email",
      "password",
    ]);
    return user;
  }

  async generateTokens(user: IUser) {
    const accessToken = await jwt.sign(
      { id: user.id },
      process.env.ACCESS_TOKEN as string,
      { expiresIn: "30000s" }
    );

    const refreshToken = await jwt.sign(
      { id: user.id },
      process.env.REFRESH_TOKEN as string,
      { expiresIn: "1w" }
    );

    return { accessToken, refreshToken };
  }
  async generateAccessToken(id: string) {
    const accessToken = await jwt.sign(
      { id: id },
      process.env.ACCESS_TOKEN as string,
      { expiresIn: "15m" }
    );
    return accessToken;
  }
  async deleteTokens(res: Response) {
    res.cookie("accessToken", "", { maxAge: 0 });
    res.cookie("refreshToken", "", { maxAge: 0 });
  }
}

export const authServices = new AuthServices();
