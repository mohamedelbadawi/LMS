import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncErrorHandler";

import { uploadFile } from "../utils/dataUpload";
import { courseServices } from "../services/course.services";
import ErrorHandler from "../utils/ErrorHandler";
import { ILesson, ISection } from "../models/course.model";
const cloudinary = require("cloudinary");

class CourseController {
  public static createCourse = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const files: any = { ...req.files };

        const thumbnailData = await uploadFile(
          files,
          req.body.name,
          "thumbnail",
          "courses"
        );
        const demoData = await uploadFile(
          files,
          req.body.name,
          "demo",
          "courses"
        );
        const data: any = { ...req.body };
        data["thumbnail"] = thumbnailData;
        data["demo"] = demoData;
        await courseServices.createCourse(data);
        return res.json({
          success: "true",
          message: "Course created successfully",
        });
      } catch (error: any) {
        console.error(error);
        return next(new ErrorHandler(error.message, 400));
      }
    }
  );
  public static addSection = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        //get course id
        const courseId: string = req.params.courseId;
        const name = req.body.name;
        const sectionData = { name: name } as ISection;
        await courseServices.findCourseByIdAndAddSection(courseId, sectionData);
        return res
          .status(200)
          .json({ success: true, message: "Section add successfully " });
      } catch (error: any) {
        console.error(error);
        return next(new ErrorHandler(error.message, 400));
      }
    }
  );

  public static addLesson = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { courseId, sectionId } = req.params;
        const files: any = { ...req.files };
        const { name, description } = req.body;
        const { courseName, sectionName } =
          await courseServices.findCourseAndSectionNames(courseId, sectionId);
        if (!courseName || !sectionName) {
          return next(
            new ErrorHandler(
              "please provide a valid course and section id",
              400
            )
          );
        }
        const thumbnailData = (await uploadFile(
          files,
          req.body.name,
          "thumbnail",
          `courses/${courseName?.name}/${sectionName?.name}`
        )) as { publicId: string; url: string };

        const videoData = (await uploadFile(
          files,
          req.body.name,
          "video",
          `courses/${courseName?.name}/${sectionName?.name}`
        )) as { publicId: string; url: string };

        const lesson = {
          name: name,
          description: description,
          thumbnail: thumbnailData,
          videoUrl: videoData,
        } as ILesson;
        await courseServices.addLessonToSection(sectionId, lesson);

        return res.status(200).json({
          success: true,
          message: "lesson added successfully",
        });
      } catch (error: any) {
        console.error(error);
        return next(new ErrorHandler(error.message, 400));
      }
    }
  );

  public static updateCourse = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const files: any = { ...req.files };
        const courseId = req.params.courseId;
        const data: any = { ...req.body };

        const course = await courseServices.findCourse(courseId);
        if (!course) {
          return next(new ErrorHandler("there is no course match", 400));
        }
        if (files["thumbnail"]) {
          const thumbnail = course?.thumbnail as {
            publicId: string;
            url: string;
          };
          await cloudinary.uploader.destroy(thumbnail.publicId);
          const thumbnailData = await uploadFile(
            files,
            course?.name,
            "thumbnail",
            "courses"
          );
          data["thumbnail"] = thumbnailData;
        }
        if (files["demo"]) {
          const demo = course?.thumbnail as { publicId: string; url: string };
          await cloudinary.uploader.destroy(demo.publicId);
          const demoData = await uploadFile(
            files,
            course?.name,
            "demo",
            "courses"
          );
          data["demo"] = demoData;
        }

        await courseServices.updateCourse(courseId, data);

        return res
          .status(200)
          .json({ success: "true", message: "course updated successfully" });
      } catch (error: any) {
        console.error(error);
        return next(new ErrorHandler(error.message, 400));
      }
    }
  );
  public static updateSection = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = { ...req.body };
        const { sectionId } = req.params;
        await courseServices.findSectionAndUpdate(sectionId, data);
        return res
          .status(200)
          .json({ message: "Section updated successfully", success: "true" });
      } catch (error: any) {
        console.error(error);
        return next(new ErrorHandler(error.message, 400));
      }
    }
  );

  public static updateLesson = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const files: any = { ...req.files };
        const lessonId = req.params.lessonId;
        const sectionId = req.params.sectionId;

        const data: any = { ...req.body };

        const lesson = await courseServices.findLessonById(lessonId);
        if (!lesson) {
          return next(new ErrorHandler("please provide a valid lesson", 404));
        }

        await courseServices.updateLesson(lesson, sectionId, data, files);

        return res
          .status(200)
          .json({ success: true, message: "lesson updated successfully" });
      } catch (error: any) {
        console.error(error);
        return next(new ErrorHandler(error.message, 400));
      }
    }
  );

  public static getCourses = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const search = req.query.search as string;

        const result = await courseServices.getCourses(search);
        return res.json(result);
      } catch (error: any) {
        console.error(error);
        return next(new ErrorHandler(error.message, 400));
      }
    }
  );
}

export default CourseController;
