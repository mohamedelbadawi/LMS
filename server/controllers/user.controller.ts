import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncErrorHandler";
import { userServices } from "../services/user.services";
import ErrorHandler from "../utils/ErrorHandler";
import { authServices } from "../services/auth.services";
const cloudinary = require("cloudinary");

import {
  uploadToCloudinary,
  updateUserAvatar,
  prepareFileToUpload,
} from "../utils/dataUpload";
class UserController {
  public static updateInfo = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { email, name } = req.body;
        const userId = req.user._id;
        const exist = await userServices.checkIfEmailExists(email, userId);
        if (exist) {
          return next(new ErrorHandler("Email already exists", 400));
        }
        await userServices.updateUserData(
          {
            email: email,
            name: name,
          },
          userId
        );
        return res
          .status(200)
          .json({ success: true, message: "User data updated successfully" });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
      }
    }
  );

  public static updatePassword = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { currentPassword, newPassword } = req.body;
        const user = await authServices.getUserDataLogin(req.user.email);

        // get the current password
        const isRight = await userServices.comparePassword(
          currentPassword,
          user[0].password
        );
        if (!isRight) {
          return next(new ErrorHandler("current password is incorrect", 400));
        }
        await userServices.updateUserPassword(
          { password: newPassword },
          req.user._id
        );
        authServices.deleteTokens(res);
        return res
          .status(200)
          .json({ success: true, message: "passwords updated successfully" });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
      }
    }
  );
  public static updateAvatar = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { file, public_id } = await prepareFileToUpload(
          req.file?.originalname || "",
          req.file?.buffer
        );

        const user = await userServices.getUserDataByEmail(req.user.email);
        if (user[0].avatar.publicId) {
          await cloudinary.uploader.destroy(user[0].avatar.publicId);
        }

        const uploaded = await uploadToCloudinary(file.content, {
          public_id: public_id,
          folder: "avatars",
          width: 150,
        });

        const avatarData: {
          publicId: string;
          url: string;
        } = {
          publicId: uploaded.public_id,
          url: uploaded.url,
        };

        await updateUserAvatar(user[0]._id, avatarData);

        return res
          .status(200)
          .json({ success: true, message: "Avatar updated successfully" });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
      }
    }
  );
}
export default UserController;
