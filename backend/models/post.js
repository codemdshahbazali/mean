const mongoose = require("mongoose");

//its a blueprint
const postSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  desc: String,
  content: {
    type: String,
    required: true,
  },
  imagePath: { type: String, required: true },
});
//this is the instance of the blueprint which we export
module.exports = mongoose.model("Post", postSchema);
