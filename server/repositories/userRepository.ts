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
  async getOneByEmail(email: string, field?: string[], exceptOne?: string) {
    if (field?.length) {
      return await this.userModel
        .find({ email: email, _id: { $ne: exceptOne } })
        .select(field)
        .exec();
    } else {
      const data = await this.userModel
        .find({ email: email, _id: { $ne: exceptOne } })
        .exec();
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
  async updateUser(
    userData: {
      name?: string;
      email?: string;
      password?: string;
      avatar?: {
        publicId: string;
        url: string;
      };
    },
    id: string
  ) {
    return await this.userModel.findOneAndUpdate({ _id: id }, userData).exec();
  }

  async find(
    query: object,
    projection?: object,
    population?: any
  ): Promise<IUser | null> {
    if (population) {
      return await this.userModel
        .findOne(query, projection)
        .populate(population);
    }
    return await this.userModel.findOne(query, projection);
  }
}
export const userRepository = new UserRepository();
