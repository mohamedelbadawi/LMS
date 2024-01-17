import bcrypt from "bcryptjs";
import { userRepository } from "../repositories/userRepository";

class UserServices {
  async getUserDataByEmail(email: string) {
    return await userRepository.getOneByEmail(email);
  }
  async checkIfEmailExists(email: string, id: string) {
    const users = await userRepository.getOneByEmail(email, [], id);
    if (users.length > 0) {
      return true;
    } else {
      return false;
    }
  }
  async updateUserData(userData: { email: string; name: string }, id: string) {
    return await userRepository.updateUser(userData, id);
  }
  async updateAvatar(
    userData: {
      avatar: { publicId: string; url: string };
    },
    id: string
  ) {
    return await userRepository.updateUser(userData, id);
  }

  async updateUserPassword(userData: { password: string }, id: string) {
    userData.password = await bcrypt.hash(userData.password, 10);
    return await userRepository.updateUser(userData, id);
  }

  async comparePassword(reqPassword: string, currentPassword: string) {
    return await bcrypt.compare(reqPassword, currentPassword);
  }
}

export const userServices = new UserServices();
