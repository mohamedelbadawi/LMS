import mongoose, { Document, Model, Schema } from "mongoose";
import { ICourse } from "./course.model";
import { IUser } from "./user.model";

export interface IOrder extends Document {
  course: ICourse["_id"];
  user: IUser["_id"];
  paymentInfo: object;
  status: string;
}

const orderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    paymentInfo: {
      id: String,
      paymentType: String,
      price: Number,
    },
    status: { type: String, required: true, default: "pending" },
  },
  { timestamps: true }
);
const OrderModel: Model<IOrder> = mongoose.model("Order", orderSchema);
export { OrderModel };
