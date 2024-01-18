const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

//its a blueprint
const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true //here unique doesn't work by default. It works in combination with mongoose-unique-validator package. Without it, it is used for indexing and performance
  },
  password: {
    type: String,
    required: true,
  },
});

//adding validator as plugin
userSchema.plugin(uniqueValidator);

//this is the instance of the blueprint which we export
module.exports = mongoose.model("User", userSchema);