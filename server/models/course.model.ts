import mongoose, { Document, Model, Schema } from "mongoose";
import { IUser } from "./user.model"; // Import the User model

interface IReply extends Document {
  user: IUser["_id"];
  reply: string;
}

interface IComment extends Document {
  user: IUser["_id"];
  comment: string;
  commentReplies: IReply[];
}

interface IRate extends Document {
  user: IUser["_id"];
  rateValue: number;
}

interface ILesson extends Document {
  name: string;
  thumbnail: { publicId: string; url: string };
  questions?: IComment[];
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
  totalRates: number;
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
  commentReplies: [replySchema],
});

const lessonSchema = new Schema<ILesson>({
  name: String,
  thumbnail: { publicId: String, url: String },
  questions: [commentSchema],
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
  totalRates: {
    type: Number,
    default: 0,
  },
  purchased: { type: Number, default: 0 },
});

const CourseModel: Model<ICourse> = mongoose.model("Course", courseSchema);
const SectionModel: Model<ISection> = mongoose.model("Section", sectionSchema);
const LessonModel: Model<ILesson> = mongoose.model("Lesson", lessonSchema);

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
};
