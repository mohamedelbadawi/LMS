import { userServices } from "../services/user.services";
import DatauriParser from "datauri/parser";
import path from "path";

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
  return await cloudinary.v2.uploader.upload(buffer, options);
};

export const updateUserAvatar = async (
  userId: string,
  avatarData: { publicId: string; url: string }
) => {
  await userServices.updateAvatar({ avatar: avatarData }, userId);
};

export const prepareFileToUpload = async (
  originalName: string,
  buffer: any
) => {
  const parser = new DatauriParser();

  const extName = path.extname(originalName || "").substring(0, 10);
  const file = parser.format(extName, buffer || "") as {
    content: string;
  };
  const uniqueFilename = generateUniqueFilename();
  return { file: file, public_id: uniqueFilename };
};
export const uploadFile = async (
  files: any,
  name: string,
  fileName: string,
  folder: string
) => {
  const fileData = await prepareFileToUpload(
    files[fileName][0]["originalname"] || "",
    files[fileName][0]["buffer"] || ""
  );

  const uploadedFile = await uploadToCloudinary(fileData.file.content, {
    public_id: fileData.public_id,
    folder: `${folder}/${name}`,
  });
  const Data: {
    publicId: string;
    url: string;
  } = {
    publicId: uploadedFile.public_id,
    url: uploadedFile.url,
  };
  return Data;
};

export const deleteFile = async (publicId: string) => {
  return await cloudinary.uploader.destroy(publicId);
};
export const deleteTheFileName = (path: string) => {
  const lastSlash = path.lastIndexOf("/");
  return path.substring(0, lastSlash);
};
