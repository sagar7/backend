const express=require('express')
const userRoute = require("../routes/user");
const authRoute = require("../routes/auth");
const error = require('../middleware/error');
const morgan=require('morgan')

module.exports = function(app) {
  app.use(express.json());
  app.use(morgan("dev"));
  app.use("/api", userRoute);
  app.use("/api", authRoute);
  app.use(error)
};
