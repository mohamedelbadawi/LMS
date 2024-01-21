import { ILesson, IRate, LessonModel, RateModel } from "../models/course.model";

class RateRepository {
  async create(rateData: IRate): Promise<IRate> {
    const newRate = new RateModel(rateData);
    return await newRate.save();
  }

  async update(query: object, update: object): Promise<any> {
    return await LessonModel.updateOne(query, update);
  }

  async find(query: object, projection?: object): Promise<ILesson | null> {
    return await LessonModel.findOne(query, projection);
  }

  async findAndUpdate(query: object, update: object): Promise<any> {
    return await LessonModel.findOneAndUpdate(query, update, { new: true });
  }
}

export const rateRepository = new RateRepository();
