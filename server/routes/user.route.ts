import express from "express";

import { auth } from "../middleware/auth";
import UserController from "../controllers/user.controller";
import userUpdate from "../validators/userUpdate";
import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const userRouter = express.Router();

userRouter.put(
  "/user-info",
  userUpdate.userUpdateInfo,
  auth,
  UserController.updateInfo
);
userRouter.put(
  "/user-password",
  userUpdate.userUpdatePassword,
  auth,
  UserController.updatePassword
);

userRouter.post(
  "/update-avatar",
  upload.single("avatar"),
  auth,
  UserController.updateAvatar
);
export default userRouter;
