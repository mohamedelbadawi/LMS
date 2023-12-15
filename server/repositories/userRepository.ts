import { Document, Model } from "mongoose";
import { UserModel, IUser } from "../models/user.model";
import { ICreationBody } from "../interfaces/userCreationInterface";
class UserRepository {
  private userModel: Model<IUser & Document>;
  constructor(userModel: Model<IUser & Document> = UserModel) {
    this.userModel = userModel;
  }
  async create(userData: ICreationBody) {
    return await this.userModel.create(userData);
  }
  async getOneByEmail(email: string, field?: string[]) {
    if (field?.length) {
      return await this.userModel.find({ email: email }).select(field).exec();
    } else {
      const data = await this.userModel.find({ email: email }).exec();
      return data;
    }
  }
  async getOneById(id: string, field?: string[]) {
    if (field?.length) {
      return await this.userModel.find({ _id: id }).select(field).exec();
    } else {
      const data = await this.userModel.find({ _id: id }).exec();

      return data;
    }
  }
}
export const userRepository = new UserRepository();
