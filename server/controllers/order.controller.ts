import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncErrorHandler";
import { orderServices } from "../services/order.services";
import ErrorHandler from "../utils/ErrorHandler";
import { courseServices } from "../services/course.services";
export const payment: any = {
  card: 2011542,
  wallet: 2817821,
};
class OrderController {
  public static createOrder = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { courseId, paymentMethod } = req.params;
        const { walletNumber } = req.body;
        if (!(paymentMethod in payment)) {
          return next(new ErrorHandler("Invalid payment method", 400));
        }

        const course = await courseServices.viewCourse(courseId);
        if (!course) {
          return next(new ErrorHandler("Course not found", 404));
        }
        const inUserCourses = await courseServices.checkCourseInUserCourses(
          courseId,
          req.user.id
        );
        if (inUserCourses) {
          return next(new ErrorHandler("you already have this course", 400));
        }

        const result = await orderServices.createOrder(
          course,
          req.user.id,
          paymentMethod,
          walletNumber
        );

        return res.json({ url: result });
      } catch (error: any) {
        console.error(error.message);
        return next(new ErrorHandler(error.message, 400));
      }
    }
  );

  public static paymentCallback = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      if (req.body.obj["success"] === true) {
        await orderServices.updateOrderData("success", req.body.obj.order.id);
      }
      if (req.body.obj["success"] === false) {
        await orderServices.updateOrderData("cancelled", req.body.obj.order.id);
      }
    }
  );
  public static paymentCallbackResponse = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      if (req.query.success === "true") {
        return res.json({
          success: true,
          message: "Course purchased successfully",
        });
      }
      return res.json({
        success: false,
        message: "there is something wrong,try again letter",
      });
    }
  );
}
export default OrderController;
