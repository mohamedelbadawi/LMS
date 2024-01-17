import { app } from "./app";
import connection from "./server/utils/db";
import { v2 as cloudinary } from "cloudinary";
require("dotenv").config();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});

// create the server
const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
  // redis;
  connection();
});
