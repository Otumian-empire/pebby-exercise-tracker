require("dotenv").config();

// import third party package
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// import controllers
const {
  loadHtml,
  createUser,
  readAllUser,
  createExercise,
  readLogByUserId,
} = require("./controller");

// create express app
const app = express();

// get the mongodb uri and port from the env file
const mongo_uri = process.env.MONGO_URI;
const port = process.env.PORT ?? 3000;

// middleware
app.use(cors());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// load the static files
app.get("/", loadHtml);

// create user
app.post("/api/users", createUser);

// read all users
app.get("/api/users", readAllUser);

// create exercise
app.post("/api/users/:_id/exercises", createExercise);

// read logs for a user
app.get("/api/users/:_id/logs", readLogByUserId);

app.use((req, res) => {
  res.send("Resource not found");
});

// connect to database and on success listen on specified port
mongoose
  .connect(mongo_uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    const listener = app.listen(port, () => {
      console.log("Your app is listening on port " + listener.address().port);
    });
  })
  .catch((err) => console.log(err));
