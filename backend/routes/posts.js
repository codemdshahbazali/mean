const express = require("express");
const router = express.Router();

const Post = require("../models/post");

router.post("", (req, res, next) => {
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

// router.use("/api/posts", (req, res, next) => {
router.get("", (req, res, next) => {
  Post.find().then((documents) => {
    // it returns the json automatically hence we don't need to call the return
    res.status(200).json({
      message: "Posts sent successfully",
      posts: documents,
    });
  });
});

router.get("/:id", (req, res, next) => {
  Post.findById({ _id: req.params.id }).then((post) => {
    // it returns the json automatically hence we don't need to call the return
    res.status(200).json({
      post,
    });
  });
});

router.delete("/:id", (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then((response) => {
    res.status(200).json({
      message: "Post Deleted",
    });
  });
});

router.put("/:id", (req, res, next) => {
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

module.exports = router;
