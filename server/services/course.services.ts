import { courseRepository } from "../repositories/courseRepository";
import {
  ILesson,
  ICourse,
  ISection,
  IComment,
  LessonModel,
  CommentModel,
  IReply,
  IRate,
} from "../models/course.model";
import { sectionRepository } from "../repositories/sectionRepository";
import { lessonRepository } from "../repositories/LessonRepository";
import { Request } from "express";
import { deleteFile, deleteTheFileName, uploadFile } from "../utils/dataUpload";
import { populate } from "dotenv";
import { userServices } from "./user.services";
import { commentRepository } from "../repositories/commentRepository";
import { model } from "mongoose";
import { UserModel } from "../models/user.model";
import { rateRepository } from "../repositories/rateRepository";

class CourseService {
  //@collapse
  async createCourse(courseData: ICourse) {
    return await courseRepository.create(courseData);
  }

  async findCourseByIdAndAddSection(courseId: string, sectionData: ISection) {
    const section = await sectionRepository.create(sectionData);
    const data = await courseRepository.update(
      { _id: courseId },
      { $push: { sections: section._id } }
    );

    return data;
  }

  async findCourseAndSectionNames(courseId: string, sectionId: string) {
    const courseName = await courseRepository.find(
      { _id: courseId },
      { name: 1, _id: 0 }
    );
    const sectionName = await sectionRepository.find(
      { _id: sectionId },
      { name: 1, _id: 0 }
    );
    return { courseName, sectionName };
  }

  async findCourse(courseId: string) {
    return await courseRepository.find({ _id: courseId });
  }

  async addLessonToSection(sectionId: string, lessonData: ILesson) {
    const lesson = await lessonRepository.create(lessonData);
    const updatedSection = await sectionRepository.update(
      { _id: sectionId },
      {
        $push: { lessons: lesson._id },
      }
    );
    return updatedSection;
  }

  async updateCourse(courseId: string, data: any) {
    return await courseRepository.findAndUpdate(
      {
        _id: courseId,
      },
      data
    );
  }

  async findSectionAndUpdate(sectionId: string, data: any) {
    return await sectionRepository.findAndUpdate(
      {
        _id: sectionId,
      },
      { $set: data }
    );
  }

  async findLessons(courseId: string, sectionId: string, lessonId: string) {
    const course = await courseRepository.find(
      {
        _id: courseId,
        "sections._id": sectionId,
      },
      { "sections.$": 1 }
    );
    return course;
  }
  async updateLessonSection(
    lessonId: string,
    oldSectionId: string,
    newSectionId: string
  ) {
    // first delete lesson id from the old section
    const deleted = await sectionRepository.update(
      { _id: oldSectionId },
      {
        $pull: {
          lessons: lessonId,
        },
      }
    );
    // second update the other section with the lesson id
    const updatedSection = await sectionRepository.update(
      { _id: newSectionId },
      {
        $push: {
          lessons: lessonId,
        },
      }
    );
    return updatedSection;
  }
  async findLessonById(lessonId: string) {
    return await lessonRepository.find({ _id: lessonId });
  }
  async updateLesson(
    lesson: ILesson,
    sectionId: string,
    data: any,
    files?: any
  ) {
    if (data.newSectionId) {
      courseServices.updateLessonSection(
        lesson.id,
        sectionId,
        data.newSectionId
      );
    }
    // if there is files in the request destroy the other one
    if (files) {
      if (files["thumbnail"]) {
        const thumbnail = lesson.thumbnail as {
          publicId: string;
          url: string;
        };
        await deleteFile(thumbnail.publicId);
        // convert public id to work directory
        const location = deleteTheFileName(thumbnail.publicId);
        const thumbnailData = (await uploadFile(
          files,
          "",
          "thumbnail",
          location
        )) as { publicId: string; url: string };
        data["thumbnail"] = thumbnailData;
      }

      if (files["video"]) {
        const video = lesson.thumbnail as {
          publicId: string;
          url: string;
        };
        await deleteFile(video.publicId);
        // convert public id to work directory
        const location = deleteTheFileName(video.publicId);
        const videoData = (await uploadFile(files, "", "video", location)) as {
          publicId: string;
          url: string;
        };
        data["video"] = videoData;
      }
    }
    const updatedLesson = await lessonRepository.update(
      { _id: lesson.id },
      data
    );
    return updatedLesson;
  }
  async getCourses(search?: string, limit?: number, page?: number) {
    if (search) {
      const searchQuery = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { name: { $regex: search, $options: "i" } },
        ],
      };
      return await courseRepository.findAll(searchQuery, {}, limit, page);
    }
    return await courseRepository.findAll();
  }
  async getCourse(courseId: string) {
    return await courseRepository.find(
      { _id: courseId },
      { sections: 1 },
      {
        path: "sections",
        populate: {
          path: "lessons",
          model: LessonModel,
          populate: {
            path: "questions",
            model: CommentModel,
            populate: {
              path: "user",
              model: UserModel,
              select: "avatar name",
            },
          },
        },
      }
    );
  }
  async viewCourse(courseId: string) {
    return await courseRepository.find(
      { _id: courseId },
      {
        sections: 0,
      }
    );
  }
  async checkCourseInUserCourses(courseId: string, userId: string) {
    const userCourses = await userServices.getUserCourses(userId);
    if (!userCourses?.courses) {
      return false;
    }
    const courses = userCourses?.courses.toString().split(",");

    if (!courses.includes(courseId)) {
      return false;
    }
    return true;
  }
  async addCommentToLesson(commentData: IComment, lessonId: string) {
    const comment = await commentRepository.create(commentData);
    const updateLessonComments = await lessonRepository.update(
      { _id: lessonId },
      {
        $push: { questions: comment._id },
      }
    );

    return updateLessonComments;
  }
  async addReplyToComment(commentId: string, replyData: IReply) {
    const reply = await commentRepository.createReply(replyData);
    const updatedCommentReplay = await commentRepository.update(
      { _id: commentId },
      {
        $push: {
          commentReplies: reply._id,
        },
      }
    );
    return updatedCommentReplay;
  }
  async getCommentWithReplies(commentId: string) {
    return await commentRepository.find({ _id: commentId }, {}, [
      {
        path: "commentReplies",
        populate: { path: "user", model: UserModel, select: "name avatar" },
      },
      {
        path: "user",
        select: "name avatar",
      },
    ]);
  }
  async addRate(rateData: IRate, courseId: string, userId: string) {
    // first check if the user have the access to the course
    const haveTheCourse = await this.checkCourseInUserCourses(courseId, userId);
    if (haveTheCourse) {
      const rate = await rateRepository.create(rateData);
      const course = await courseRepository.update(
        { _id: courseId },
        {
          $push: { rates: rate._id },
        }
      );
      return true;
    }
    return false;
  }
}

export const courseServices = new CourseService();
