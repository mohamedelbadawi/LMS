import { check } from "express-validator";
import validator from "../middleware/validator";

const userUpdateInfo = [
  check("name").isString().withMessage("Please provide a valid name"),
  check("email").isEmail().withMessage("Please provide a valid email"),
  validator.validate,
];
const userUpdatePassword = [
  check("currentPassword")
    .isString()
    .withMessage("Please provide a valid current password"),
  check("newPassword")
    .isString()
    .withMessage("Please provide a valid new password")
    .isStrongPassword()
    .withMessage("please make the password more strong"),
  validator.validate,
];
export default { userUpdateInfo, userUpdatePassword };
