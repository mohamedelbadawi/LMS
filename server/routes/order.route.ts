import express, { Request, Response } from "express";
import { paymobServices } from "../services/paymob.services";
import OrderController from "../controllers/order.controller";
import { auth } from "../middleware/auth";
const orderRouter = express.Router();

orderRouter.post(
  "/:courseId/buy/:paymentMethod",
  auth,
  OrderController.createOrder
);
orderRouter.post("/payment-callback", OrderController.paymentCallback);
orderRouter.get(
  "/payment-callback-response",
  OrderController.paymentCallbackResponse
);
export default orderRouter;
