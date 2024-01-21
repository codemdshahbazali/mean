const Post = require("../models/post");

exports.createPost = (req, res, next) => {
  console.log(req.authData);
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    desc: req.body.desc,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.authData.userId,
  });

  //saves the post to the database
  post
    .save()
    .then((createdPost) => {
      res.status(201).json({
        // post: {
        //   id: createdPost._id,
        //   title: createdPost.title,
        //   desc: createdPost.desc,
        //   content: createdPost.content,
        //   imagePath: createdPost.imagePath,
        // },
        post: {
          ...createdPost,
          id: createdPost._id,
        },
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Creating a post failed!",
      });
    });
};

exports.getPosts = (req, res, next) => {
  const pageSize = +req.query.size;
  const currentPage = +req.query.page;
  let resultDocuments;

  const postQuery = Post.find();

  if (
    pageSize != null &&
    currentPage != null &&
    pageSize >= 0 &&
    currentPage >= 0
  ) {
    postQuery.skip(pageSize * currentPage).limit(pageSize);
  }

  postQuery
    .then((documents) => {
      // it returns the json automatically hence we don't need to call the return
      resultDocuments = documents;
      return Post.countDocuments();
    })
    .then((count) => {
      res.status(200).json({
        posts: resultDocuments,
        maxCount: count,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching posts failed!",
      });
    });
};

exports.getPost = (req, res, next) => {
  Post.findById({ _id: req.params.id })
    .then((post) => {
      // it returns the json automatically hence we don't need to call the return
      res.status(200).json({
        post,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching post failed!",
      });
    });
};

exports.deletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.authData.userId })
    .then((response) => {
      if (response.deletedCount > 0) {
        res.status(200).json({
          message: "Post Deleted!",
        });
      } else {
        res.status(400).json({
          message: "You can't delete posts created by others!",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Deleting the post failed!",
      });
    });
};

exports.editPost = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }

  const post = {
    title: req.body.title,
    desc: req.body.desc,
    content: req.body.content,
    imagePath: imagePath,
  };

  Post.updateOne(
    { _id: req.params.id, creator: req.authData.userId },
    { $set: post }
  )
    .then((response) => {
      console.log(response);
      if (response.modifiedCount > 0 || response.matchedCount > 0) {
        res.status(200).json({
          message: "Post Updated!",
        });
      } else {
        res.status(400).json({
          message: "You can't edit posts created by others!",
        });
      }
    })
    .catch((error) => {
      res.status(400).json({
        message: "Editing of post failed!",
      });
    });
};
