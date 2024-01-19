const express = require("express");
const multer = require("multer");

const Post = require("../models/post");
const auth = require("../middleware/auth");

const router = express.Router();

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let err = new Error("Invalid mime type");

    if (isValid) {
      err = null;
    }
    cb(err, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];

    cb(null, name + "-" + Date.now() + "." + ext);
  },
});

router.post(
  "",
  auth,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
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
        res.status(400).json({
          message: "Error Occurred",
          error: error.message,
        });
      });
  }
);

// router.use("/api/posts", (req, res, next) => {
router.get("", (req, res, next) => {
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

router.delete("/:id", auth, (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.authData.userId })
    .then((response) => {
      if (response.deletedCount > 0) {
        res.status(200).json({
          message: "Post Deleted",
        });
      } else {
        throw Error("You can't delete posts created by others");
      }
    })
    .catch((error) => {
      res.status(400).json({
        message: error.message,
      });
    });
});

router.put(
  "/:id",
  auth,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
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
            message: "Post Updated",
          });
        } else {
          throw Error("You can't edit posts created by others");
        }
      })
      .catch((error) => {
        res.status(400).json({
          message: error.message,
        });
      });
  }
);

module.exports = router;
