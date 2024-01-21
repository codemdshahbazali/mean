const express = require("express");
const auth = require("../middleware/auth");
const extractFile = require("../middleware/file");

const {
  createPost,
  getPosts,
  getPost,
  deletePost,
  editPost,
} = require("../controllers/posts");

const router = express.Router();

router.post("", auth, extractFile, createPost);
router.put("/:id", auth, extractFile, editPost);

router.get("", getPosts);

router.get("/:id", getPost);

router.delete("/:id", auth, deletePost);

module.exports = router;
