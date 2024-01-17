import { userServices } from "../services/user.services";

const cloudinary = require("cloudinary");

export const generateUniqueFilename = () => {
  return "img_" + Date.now();
};

export const uploadToCloudinary = async (
  buffer: string,
  options: {
    public_id: string;
    folder?: string;
    width?: number;
  }
) => {
  return await cloudinary.v2.uploader.upload(buffer, options );
};

export const updateUserAvatar = async (
  userId: string,
  avatarData: { publicId: string; url: string }
) => {
  await userServices.updateAvatar({ avatar: avatarData }, userId);
};
