import { NextFunction, Request, Response } from "express";
import { UserRepository, userRepository } from "../repositories/userRepository";
import ErrorHandler from "../utils/ErrorHandler";
import { createActivationToken } from "../services/auth.services";

interface IRegistrationBody {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

class UserController {}
