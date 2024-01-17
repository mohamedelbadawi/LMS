import { auth } from "../middleware/auth";
import userLoginValidator from "../validators/userLogin";
import userRegisterValidator from "../validators/userRegistration";
import AuthController from "./../controllers/auth.controller";
import express from "express";

const authRouter = express.Router();
authRouter.post("/register", userRegisterValidator, AuthController.register);
authRouter.post("/activate-user", AuthController.activeUser);
authRouter.post("/login", userLoginValidator, AuthController.login);
authRouter.get("/auth-user",auth ,AuthController.authUser);
authRouter.post("/refresh", AuthController.refresh);
authRouter.post("/logout", AuthController.logout);
export default authRouter;
