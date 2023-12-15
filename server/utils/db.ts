import mongoose from "mongoose";

require("dotenv").config();

const dbUrl: string = process.env.DB_URI || "";

const connection = () => {
  try {
    mongoose.connect(dbUrl).then((data: any) => {
      console.log("Database connection established");
    });
  } catch (err: any) {
    console.log(err.message);
    // setTimeout(connection, 10000);
  }
};

export default connection;
