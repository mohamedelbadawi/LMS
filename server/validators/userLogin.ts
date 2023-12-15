import { check } from "express-validator";
import validator from "../middleware/validator";

const userLoginValidator = [
  check("email").isEmail().withMessage("Please provide a valid email"),
  check("password")
    .isStrongPassword()
    .withMessage("Please provide a valid password"),
  validator.validate,
];
export default userLoginValidator;
