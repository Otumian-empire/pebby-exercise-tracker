const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    dropDups: true,
  },
});

const exerciseSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("user", userSchema);
const Exercise = mongoose.model("exercise", exerciseSchema);

module.exports = { User, Exercise };
