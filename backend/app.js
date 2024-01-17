const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const postsRoutes = require("./routes/posts");
const authRoutes = require("./routes/auth");

const app = express();

mongoose
  // .connect(
  //   "mongodb+srv://mongouser:NHV41VgrWhyCkULc@cluster0.6smvz1i.mongodb.net/node-angular?retryWrites=true&w=majority"
  // )
  .connect("mongodb://127.0.0.1:27017/test-db")
  .then(() => {
    console.log("Connected to db");
  })
  .catch(() => {
    console.log("connection failed");
  });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/images", express.static(path.join("backend/images")));

// app.use((req, res, next) => {
//   console.log("First Middleware");
//   next();
// });

// app.use((req, res, next) => {
//   res.send("Hello from express");
// });

//HANDLING THE CORS ISSUE
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, PUT, OPTIONS"
  );
  next();
});

app.use("/api/posts", postsRoutes);
app.use("/api/auth", authRoutes);

module.exports = app;
//mongo-credentials
// NHV41VgrWhyCkULc
//mongouser
