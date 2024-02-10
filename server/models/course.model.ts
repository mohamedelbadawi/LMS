import mongoose, { Document, Model, Schema } from "mongoose";
import { IUser } from "./user.model"; // Import the User model
import { NextFunction } from "express";

interface IReply extends Document {
  user: IUser["_id"];
  reply: string;
}

interface IComment extends Document {
  user: IUser["_id"];
  comment: string;
  commentReplies?: IReply["_id"][];
}

interface IRate extends Document {
  user: IUser["_id"];
  rateValue: number;
}

interface ILesson extends Document {
  name: string;
  thumbnail: { publicId: string; url: string };
  questions?: IComment["_id"][];
  description: string;
  videoUrl: { publicId: string; url: string };
}

interface ISection extends Document {
  name: string;
  lessons?: ILesson["_id"][];
}

interface ICourse extends Document {
  name: string;
  description?: string;
  price: number;
  estimatedPrice?: number;
  thumbnail: { publicId: string; url: string };
  tags: string;
  level: string;
  demo: object;
  prerequisites: { title: string }[];
  sections?: ISection["_id"][];
  rates?: IRate["_id"][];
  purchased?: number;
  avgRate: number;
}

const rateSchema = new Schema<IRate>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  rateValue: Number,
});

const replySchema = new Schema<IReply>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  reply: String,
});

const commentSchema = new Schema<IComment>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  comment: String,
  commentReplies: [{ type: Schema.Types.ObjectId, ref: "Reply" }],
});

const lessonSchema = new Schema<ILesson>({
  name: String,
  thumbnail: { publicId: String, url: String },
  questions: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  description: String,
  videoUrl: { publicId: String, url: String },
});

const sectionSchema = new Schema<ISection>({
  name: String,
  lessons: [{ type: Schema.Types.ObjectId, ref: "Lesson" }],
});

const courseSchema = new Schema<ICourse>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  estimatedPrice: Number,
  thumbnail: {
    publicId: { type: String, required: true },
    url: { type: String, required: true },
  },
  tags: { type: String, required: true },
  level: { type: String, required: true },
  demo: {
    publicId: { type: String, required: true },
    url: { type: String, required: true },
  },
  prerequisites: [{ title: String }],
  sections: [{ type: Schema.Types.ObjectId, ref: "Section" }],
  rates: [{ type: Schema.Types.ObjectId, ref: "Rate" }],
  avgRate: {
    type: Number,
    default: 0,
  },
  purchased: { type: Number, default: 0 },
});

courseSchema.post("findOneAndUpdate", async function (doc) {
  const update: any = this.getUpdate();
  if (update.$push && update.$push.rates) {
    const originalDocument = await this.model
      .findOne(this.getQuery())
      .populate("rates")
      .select("rates");
    const count = originalDocument.rates.length;
    const avg =
      originalDocument.rates.reduce(
        (sum: number, rate: any) => sum + rate.rateValue,
        0
      ) / count;
    const updatedDoc = doc as ICourse;
    updatedDoc.avgRate = avg;
    await updatedDoc.save();
  }
});
const CourseModel: Model<ICourse> = mongoose.model("Course", courseSchema);
const SectionModel: Model<ISection> = mongoose.model("Section", sectionSchema);
const LessonModel: Model<ILesson> = mongoose.model("Lesson", lessonSchema);
const CommentModel: Model<IComment> = mongoose.model("Comment", commentSchema);
const ReplyModel: Model<IReply> = mongoose.model("Reply", replySchema);
const RateModel: Model<IRate> = mongoose.model("Rate", rateSchema);
export {
  CourseModel,
  SectionModel,
  LessonModel,
  ICourse,
  ISection,
  ILesson,
  IRate,
  IComment,
  IReply,
  CommentModel,
  ReplyModel,
  RateModel,
};
