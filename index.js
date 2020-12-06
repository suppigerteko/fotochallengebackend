const express = require("express");
const cors = require("cors");
const knex = require("knex");
require("dotenv").config();

const db = knex({
  client: "pg",
  connection: {
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
  },
});

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// CORS implemented so that we don't get errors when trying to access the server from a different server location
app.use(cors());

// GET: Fetch all users from the database
app.get("/", (req, res) => {
  db.select("*")
    .from("users")
    .then((data) => {
      console.log(data);
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
    });
});

// GET: Fetch user by userId from the database
app.get("/:userId", (req, res) => {
  const userId = req.params.userId;
  db.select("*")
    .from("users")
    .where("id", "=", userId)
    .then((data) => {
      console.log(data);
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
    });
});

// POST: Create user and add them to the database
app.post("/add-user", (req, res) => {
  console.log("hallo");
  const { name } = req.body;
  db("users")
    .insert({
      name: name,
    })
    .then(() => {
      console.log("user Added");
      return res.json({ msg: "user Added" });
    })
    .catch((err) => {
      console.log(err);
    });
});

// DELETE: Delete user by userId from the database
app.delete("/delete-user", (req, res) => {
  const userId = req.body;
  const userIdToDelete = Number(userId.userId);
  console.log(userIdToDelete);
  db("users")
    .where("id", "=", userIdToDelete)
    .del()
    .then(() => {
      console.log("User Deleted");
      return res.json({ msg: "User Deleted" });
    })
    .catch((err) => {
      console.log(err);
    });
});

// PUT: Update user by userId from the database
app.put("/update-users", (req, res) => {
  db("users")
    .where("id", "=", 1)
    .update({ name: "Roman" })
    .then(() => {
      console.log("User Updated");
      return res.json({ msg: "User Updated" });
    })
    .catch((err) => {
      console.log(err);
    });
});

const port = process.env.PORT || 5000;

app.listen(port, () =>
  console.log(`Server running on port ${port}, http://localhost:${port}`)
);
