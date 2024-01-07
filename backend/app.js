const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const Post = require("./models/post");
const postsRoutes = require("./routes/posts");

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
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, PUT, OPTIONS"
  );
  next();
});

app.post("/api/posts", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    desc: req.body.desc,
    content: req.body.content,
  });

  //saves the post to the database
  post.save().then((createdPost) => {
    res.status(201).json({
      message: "Post added successfully",
      postId: createdPost._id,
    });
  });
});

// app.use("/api/posts", (req, res, next) => {
app.get("/api/posts", (req, res, next) => {
  Post.find().then((documents) => {
    // it returns the json automatically hence we don't need to call the return
    res.status(200).json({
      message: "Posts sent successfully",
      posts: documents,
    });
  });
});

app.get("/api/posts/:id", (req, res, next) => {
  Post.findById({ _id: req.params.id }).then((post) => {
    // it returns the json automatically hence we don't need to call the return
    res.status(200).json({
      post,
    });
  });
});

app.delete("/api/posts/:id", (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then((response) => {
    res.status(200).json({
      message: "Post Deleted",
    });
  });
});

app.put("/api/posts/:id", (req, res, next) => {
  const post = {
    title: req.body.title,
    desc: req.body.desc,
    content: req.body.content,
  };
  Post.updateOne({ _id: req.params.id }, post)
    .then((response) => {
      res.status(200).json({
        message: "Post Updated",
      });
    })
    .catch((error) => {
      res.status(400).json({
        message: error.message,
      });
    });
});

app.use("/api/posts", postsRoutes);

module.exports = app;
//mongo-credentials
// NHV41VgrWhyCkULc
//mongouser
