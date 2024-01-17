const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

//its a blueprint
const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.plugin(uniqueValidator);

//this is the instance of the blueprint which we export
module.exports = mongoose.model("User", userSchema);