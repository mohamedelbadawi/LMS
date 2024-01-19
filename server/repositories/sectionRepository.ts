import { ISection, SectionModel } from "../models/course.model";

class SectionRepository {
  async create(sectionData: ISection): Promise<ISection> {
    const newSection = new SectionModel(sectionData);
    return await newSection.save();
  }

  async update(query: object, update: object): Promise<any> {
    return await SectionModel.updateOne(query, update);
  }

  async find(query: object, projection?: object): Promise<ISection | null> {
    return await SectionModel.findOne(query, projection);
  }

  async findAndUpdate(query: object, update: object): Promise<any> {
    return await SectionModel.findOneAndUpdate(query, update, { new: true });
  }
}

export const sectionRepository = new SectionRepository();
