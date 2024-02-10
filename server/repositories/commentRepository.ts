import { populate } from "dotenv";
import {
  IComment,
  CommentModel,
  IReply,
  ReplyModel,
} from "../models/course.model";

class CommentRepository {
  async create(commentData: IComment): Promise<IComment> {
    const newComment = new CommentModel(commentData);
    return await newComment.save();
  }

  async update(query: object, update: object): Promise<any> {
    return await CommentModel.updateOne(query, update);
  }

  async find(
    query: object,
    projection?: object,
    population?: any
  ): Promise<IComment | null> {
    return await CommentModel.findOne(query, projection).populate(population);
  }

  async findAndUpdate(query: object, update: object): Promise<any> {
    return await CommentModel.findOneAndUpdate(query, update, { new: true });
  }
  async createReply(replyData: IReply): Promise<IReply> {
    const newReply = new ReplyModel(replyData);
    return await newReply.save();
  }
}

export const commentRepository = new CommentRepository();
