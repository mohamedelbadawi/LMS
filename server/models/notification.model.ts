import mongoose, { Model, Schema } from "mongoose";
import { IUser } from "./user.model";

export interface INotification extends Document {
  title: string;
  status: string;
  message: string;
  user: IUser["_id"];
}
const notificationSchema = new Schema<INotification>(
  {
    title: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "unread",
    },
    message: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const NotificationModel: Model<INotification> = mongoose.model(
  "Notification",
  notificationSchema
);

export { NotificationModel };
