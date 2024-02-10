import { IOrder, OrderModel } from "../models/order.model";

class OrderRepository {
  async create(orderData: IOrder): Promise<IOrder> {
    const newComment = new OrderModel(orderData);
    return await newComment.save();
  }

  async update(query: object, update: object): Promise<any> {
    return await OrderModel.updateOne(query, update);
  }

  async find(
    query: object,
    projection?: object,
    population?: any
  ): Promise<IOrder | null> {
    return await OrderModel.findOne(query, projection).populate(population);
  }

  async findAndUpdate(query: object, update: object): Promise<any> {
    return await OrderModel.findOneAndUpdate(query, update, { new: true });
  }
}

export const orderRepository = new OrderRepository();
