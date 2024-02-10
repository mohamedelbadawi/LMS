import { ILesson, LessonModel } from "../models/course.model";

class LessonRepository {
  async create(lessonData: ILesson): Promise<ILesson> {
    const newSection = new LessonModel(lessonData);
    return await newSection.save();
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

export const lessonRepository = new LessonRepository();
