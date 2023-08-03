// controller.js;

const mongoose = require("mongoose");

const { User, Exercise } = require("./model");

const loadHtml = (_req, res) => {
  return res.sendFile(__dirname + "/views/index.html");
};

// create user: pass the user name
const createUser = async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) return res.json({ error: "User name is required" });

    const user = new User({ username });
    await user.save();

    return res.json({
      username: user.username,
      _id: user._id.toString(),
    });
  } catch (error) {
    return res.json({ error });
  }
};

const readAllUser = async (_req, res) => {
  try {
    const users = await Promise.resolve(User.find().select("-__v").exec());
    return res.json(users);
  } catch (error) {
    return res.json({ error });
  }
};

// create an exercise, pass the user's _id, then the exercise details
// : description, duration, ?date
const createExercise = async (req, res) => {
  try {
    // get the user id
    const { _id } = req.params;

    if (!_id) {
      return res.json({ error: "User id required" });
    }

    // get the exercise body
    let { description, duration, date } = req.body;

    // date is optional
    if (!date) {
      date = new Date().toDateString();
    } else {
      date = new Date(date).toDateString();
    }

    // cast the string user id to an object id
    const userId = new mongoose.Types.ObjectId(_id);

    const user = await Promise.resolve(User.findOne({ _id: userId }));

    if (!user) {
      return res.json({ error: "User not found" });
    }

    const exercise = new Exercise({
      user: user,
      description,
      duration,
      date,
    });

    await exercise.save();

    return res.json({
      _id: user._id,
      username: user.username,
      description: exercise.description,
      duration: exercise.duration,
      date: exercise.date,
    });
  } catch (error) {
    return res.json({ error });
  }
};

// return an array of exercise: {description, duration, and date} that
// belongs to the user with this id
const readLogByUserId = async (req, res) => {
  try {
    const { _id } = req.params;

    if (!_id) {
      return res.json({ error: "User id required" });
    }

    // cast the string user id to an object id
    const userId = new mongoose.Types.ObjectId(_id);

    const user = await Promise.resolve(User.findOne({ _id: userId }));

    if (!user) {
      return res.json({ error: "User not found" });
    }

    // query to search for the exercise
    // from, to, limit
    const { from, to, limit } = req.query;

    const query = { user };

    // check if the from, to and limit are set to filter the result to return
    if (from && to) {
      query.date = { $gte: new Date(from), $lte: new Date(to) };
    } else if (from) {
      query.date = { $gte: new Date(from) };
    } else if (to) {
      query.date = { $lte: new Date(to) };
    }

    let exercisesQuery = Exercise.find(query).select(
      "description duration date"
    );

    // Apply limit to the query if limit is provided
    if (limit) {
      exercisesQuery = exercisesQuery.limit(parseInt(limit));
    }

    const exercises = await Promise.resolve(exercisesQuery.exec());

    return res.json({
      _id: user._id,
      username: user.username,
      count: exercises.length,
      log: exercises,
    });
  } catch (error) {
    return res.json({ error });
  }
};

module.exports = {
  loadHtml,
  createUser,
  readAllUser,
  createExercise,
  readLogByUserId,
};
