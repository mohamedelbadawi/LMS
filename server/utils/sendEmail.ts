import * as nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";
require("dotenv").config();
export interface EmailOptions {
  email: string;
  subject: string;
  template: string;
  data: { [key: string]: any };
}
const sendEmail = async (options: EmailOptions) => {
  const transporter: nodemailer.Transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASS,
    },
    logger: true,
  } as any);
  const { email, subject, template, data } = options;
  const templatePath = path.join(__dirname, "../mails", template);
  const html: string = await ejs.renderFile(templatePath, data);
  const emailOptions = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject,
    html,
  };
  await transporter.sendMail(emailOptions);
};
export default sendEmail;
