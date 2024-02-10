import axios from "axios";
import { payment } from "../controllers/order.controller";
import { ICourse } from "../models/course.model";
import { IOrder } from "../models/order.model";
import { IUser } from "../models/user.model";
import { orderRepository } from "../repositories/orderRepository";
import { userRepository } from "../repositories/userRepository";
import { courseServices } from "./course.services";
import { paymobServices } from "./paymob.services";
import { userServices } from "./user.services";
// import { config } from 'dotenv';
require("dotenv").config();
class OrderServices {
  async createOrder(
    course: ICourse,
    userId: string,
    paymentMethod: string,
    walletNumber?: string
  ) {
    const user = (await userServices.getUserDataById(userId)) as IUser;

    const token = await paymobServices.authRequest();
    const orderData: object = {
      auth_token: token,
      delivery_needed: "false",
      amount_cents: course.price * 100,
      items: [
        {
          name: course.name,
          quantity: 1,
          description: course.description,
          amount_cents: course.price * 100,
        },
      ],
    };

    const id = await paymobServices.registerOrder(orderData);

    await this.AddOrderToDatabase(
      course._id,
      paymentMethod,
      user._id,
      id,
      course.price
    );

    const paymentKeyData = {
      auth_token: token,
      amount_cents: course.price * 100,
      expiration: 3600,
      order_id: id,
      billing_data: {
        apartment: "Na",
        email: user.email,
        floor: "Na",
        first_name: user.name,
        street: "na",
        building: "na",
        phone_number: "NA",
        shipping_method: "NA",
        postal_code: "NA",
        city: "NA",
        country: "NA",
        last_name: "(NA)",
        state: "NA",
      },
      currency: "EGP",
      integration_id: payment[paymentMethod],
    };
    const paymentKeyRequestToken = await paymobServices.getPaymentKeyRequest(
      paymentKeyData
    );
    if (paymentMethod === "card") {
      return await this.getCardPaymentFrame(paymentKeyRequestToken);
    } else {
      if (walletNumber) {
        return await this.getWalletPaymentFrame(
          paymentKeyRequestToken,
          walletNumber
        );
      } else {
        throw new Error("invalid wallet number provided");
      }
    }
  }

  async AddOrderToDatabase(
    courseId: string,
    paymentMethod: string,
    userId: string,
    orderPaymentId: string,
    price: number
  ) {
    return await orderRepository.create({
      course: courseId,
      user: userId,
      paymentInfo: {
        id: orderPaymentId,
        paymentType: paymentMethod,
        price: price,
      },
    } as IOrder);
  }

  async getCardPaymentFrame(paymentToken: string) {
    const paymobFrame = process.env.PAYMOB_IFRAME || 375178;
    const frameUrl = `https://accept.paymobsolutions.com/api/acceptance/iframes/${paymobFrame}?payment_token=${paymentToken}`;
    return frameUrl;
  }
  async getWalletPaymentFrame(paymentToken: string, walletNumber: string) {
    const Url = `https://accept.paymob.com/api/acceptance/payments/pay`;
    const res: any = await axios.post(Url, {
      source: {
        identifier: walletNumber,
        subtype: "WALLET",
      },
      payment_token: paymentToken,
    });
    return res.data.redirect_url;
  }

  async updateOrderData(status: string, orderPaymentId: string) {
    const order = await orderRepository.findAndUpdate(
      {
        "paymentInfo.id": orderPaymentId,
      },
      {
        $set: {
          status: status,
        },
      }
    );
    if (status === "success") {
      const course = await courseServices.viewCourse(order.course);
      await courseServices.updateCourse(
        order.course,

        {
          purchased:(course?.purchased||+1)
        }
      );
      const user = await userRepository.findAndUpdate(
        {
          _id: order.user,
        },
        {
          $push: { courses: order.course },
        }
      );
    }
  }
}
export const orderServices = new OrderServices();
