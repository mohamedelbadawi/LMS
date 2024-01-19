import { CourseModel, ICourse } from "../models/course.model";

class CourseRepository {
  async create(courseData: ICourse): Promise<ICourse> {
    const newCourse = new CourseModel(courseData);
    return await newCourse.save();
  }

  async update(query: object, update: object): Promise<any> {
    return await CourseModel.updateOne(query, update);
  }

  async find(query: object, projection?: object): Promise<ICourse | null> {
    return await CourseModel.findOne(query, projection);
  }
  async findAll(
    query?: object,
    projection?: object,
    limit: number = 10,
    page: number = 1
  ) {
    if (query) {
      return CourseModel.find(query, projection)
        .skip((page - 1) * limit)
        .limit(limit);
    }
    return CourseModel.find({}, projection)
      .skip((page - 1) * limit)
      .limit(limit);
  }

  async findAndUpdate(query: object, update: object): Promise<any> {
    return await CourseModel.findOneAndUpdate(query, update, { new: true });
  }
}

export const courseRepository = new CourseRepository();
