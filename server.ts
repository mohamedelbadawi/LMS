import bodyParser from "body-parser";
import { app } from "./app";
import connection from "./server/utils/db";
import { redis } from "./server/utils/redis";
import express from "express";
require("dotenv").config();

// create the server
const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
  // redis;
  connection();
});
