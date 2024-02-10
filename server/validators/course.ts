import { check } from "express-validator";

import validator from "../middleware/validator";

const courseCreationValidator = [
  check("name").notEmpty().withMessage("Name is required"),
  check("description").notEmpty().withMessage("Description is required"),
  check("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  check("estimatedPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Estimated price must be a positive number"),
  check("tags").notEmpty().withMessage("Tags are required"),
  check("level").notEmpty().withMessage("Level is required"),
  check("prerequisites")
    .isArray()
    .withMessage("Prerequisites must be an array"),
  validator.validate,
];

const addSectionValidator = [
  check("courseId")
    .notEmpty()
    .withMessage("courseId is required")
    .isMongoId()
    .withMessage("please provide a valid course Id"),
  check("name").isString().withMessage("Please provide a valid name"),
  validator.validate,
];
const addLessonValidator = [
  check("courseId")
    .notEmpty()
    .withMessage("courseId is required")
    .isMongoId()
    .withMessage("please provide a valid course Id"),
  check("sectionId")
    .notEmpty()
    .withMessage("courseId is required")
    .isMongoId()
    .withMessage("please provide a valid course Id"),
  check("name").isString().withMessage("please provide a valid name"),
  check("description")
    .isString()
    .withMessage("please provide a valid description"),
  validator.validate,
];
const updateCourseValidator = [
  check("name").optional().isString(),
  check("description").optional().isString(),
  check("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  check("estimatedPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Estimated price must be a positive number"),
  check("tags").optional(),
  check("level").optional(),
  check("prerequisites")
    .optional()
    .isArray()
    .withMessage("Prerequisites must be an array"),
  validator.validate,
];

const updateSectionValidator = [
  check("SectionId")
    .notEmpty()
    .withMessage("sectionId is required")
    .isMongoId()
    .withMessage("please provide a valid section Id"),

  check("name")
    .optional()
    .isString()
    .withMessage("Please provide a valid name"),
];
const addCommentValidator = [
  check("courseId")
    .notEmpty()
    .withMessage("courseId is required")
    .isMongoId()
    .withMessage("please provide a valid course Id"),
  check("sectionId")
    .notEmpty()
    .withMessage("sectionId is required")
    .isMongoId()
    .withMessage("please provide a valid section Id"),

  check("lessonId")
    .notEmpty()
    .withMessage("lessonId is required")
    .isMongoId()
    .withMessage("please provide a valid lesson Id"),
  check("comment").isString().withMessage("please provide a valid comment"),
];
const addReplyValidator = [
  check("courseId")
    .notEmpty()
    .withMessage("courseId is required")
    .isMongoId()
    .withMessage("please provide a valid course Id"),

  check("commentId")
    .notEmpty()
    .withMessage("commentId is required")
    .isMongoId()
    .withMessage("please provide a valid comment Id"),
  check("reply").isString().withMessage("please provide a valid reply"),
];
export {
  courseCreationValidator,
  addSectionValidator,
  addLessonValidator,
  updateCourseValidator,
  updateSectionValidator,
  addCommentValidator,
  addReplyValidator,
};
