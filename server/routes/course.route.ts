import express from "express";
import { auth } from "../middleware/auth";
import CourseController from "../controllers/course.controller";
import multer from "multer";
import {
  courseCreationValidator,
  addSectionValidator,
  addLessonValidator,
  updateCourseValidator,
  updateSectionValidator,
  addCommentValidator,
  addReplyValidator,
} from "../validators/course";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const courseRouter = express.Router();

courseRouter.post(
  "/create-course",
  upload.fields([
    {
      name: "thumbnail",
      maxCount: 1,
    },
    {
      name: "demo",
      maxCount: 1,
    },
  ]),
  auth,
  courseCreationValidator,
  CourseController.createCourse
);
courseRouter.post(
  "/:courseId/add-section",
  auth,
  addSectionValidator,
  CourseController.addSection
);

courseRouter.post(
  "/:courseId/:sectionId/add-lesson",
  upload.fields([
    {
      name: "thumbnail",
      maxCount: 1,
    },
    {
      name: "video",
      maxCount: 1,
    },
  ]),
  auth,
  addLessonValidator,
  CourseController.addLesson
);
courseRouter.put(
  "/:courseId/update-course/",
  upload.fields([
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  updateCourseValidator,
  auth,
  CourseController.updateCourse
);

courseRouter.put(
  "/:sectionId/update-section",
  updateSectionValidator,
  auth,
  CourseController.updateSection
);
courseRouter.put(
  "/:sectionId/update-lesson/:lessonId",
  upload.fields([
    {
      name: "thumbnail",
      maxCount: 1,
    },
    {
      name: "video",
      maxCount: 1,
    },
  ]),
  auth,
  CourseController.updateLesson
);

courseRouter.get("/all", CourseController.getCourses);
courseRouter.get("/access/:courseId", auth, CourseController.accessCourse);
courseRouter.get("/view/:courseId", auth, CourseController.viewCourse);
courseRouter.post(
  "/:courseId/:sectionId/:lessonId/write-comment",
  auth,
  addCommentValidator,
  CourseController.writeComment
);
courseRouter.post(
  "/: courseId/:commentId/write-reply",
  auth,
  addReplyValidator,
  CourseController.writeReply
);
courseRouter.get(
  "/:courseId/:commentId/view-comment",
  auth,
  CourseController.viewComment
);
courseRouter.post("/:courseId/add-rate", auth, CourseController.addRate);
export default courseRouter;
