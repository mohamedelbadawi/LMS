import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncErrorHandler";
import { userServices } from "../services/user.services";
import ErrorHandler from "../utils/ErrorHandler";
import { authServices } from "../services/auth.services";
import { Buffer } from "buffer";
const cloudinary = require("cloudinary");
import DatauriParser from "datauri/parser";
import path from "path";
import {
  generateUniqueFilename,
  uploadToCloudinary,
  updateUserAvatar,
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
        const parser = new DatauriParser();
        const extName = path
          .extname(req.file?.originalname || "")
          .substring(0, 10);
        const avatar = parser.format(extName, req.file?.buffer || "") as {
          content: string;
        };
        const user = await userServices.getUserDataByEmail(req.user.email);
        if (user[0].avatar.publicId) {
          await cloudinary.uploader.destroy(user[0].avatar.publicId);
        }

        const uniqueFilename = generateUniqueFilename();
        const uploaded = await uploadToCloudinary(avatar.content, {
          public_id: uniqueFilename,
          folder: "avatars",
          width: 150,
        });

        const avatarData: {
          publicId: string;
          url: string;
        } = {
          publicId: uploaded.public_Id,
          url: uploaded.url,
        };

        await updateUserAvatar(user[0]._id, avatarData);

        return res.status(200).json({ success: true,message:"Avatar updated successfully" });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
      }
    }
  );
}
export default UserController;
