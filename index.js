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

/*// GET: Fetch user by userId from the database
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
});*/

// POST: Create user and add them to the database
app.post("/add-user", (req, res) => {
  console.log(req.body);
  const { name, email } = req.body;
  db("users")
    .insert({
      name: name,
      email: email,
    })
    .then(() => {
      console.log("user Added");
      return res.json({ msg: "user Added" });
    })
    .catch((err) => {
      console.log(err);
    });
});

// DELETE: Delete user by name
app.delete("/delete-user", (req, res) => {
  const { deleteName } = req.body;
  db("users")
    .where("name", "=", deleteName)
    .del()
    .then(() => {
      console.log("User Deleted");
      return res.json({ msg: "User Deleted" });
    })
    .catch((err) => {
      console.log(err);
    });
});

// PUT: Update user by oldName from the database
app.put("/update-users", (req, res) => {
  console.log(req.body);
  const { oldEditName, editName, email } = req.body;
  console.log(oldEditName);
  db("users")
    .where("name", "=", oldEditName)
    .update({ name: editName, email: email })
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

// POST: Register new User

app.post("/register-user", (req, res) => {
  console.log(req.body);
  const { userData } = req.body;

  db("users")
    .insert({
      firstname: userData.firstName,
      lastname: userData.lastName,
      email: userData.email,
      password: userData.password,
    })
    .then(() => {
      console.log("register User");
      return res.json({ msg: "register User" });
    })
    .catch((err) => {
      return res.json({ msg: "register User" });
    });
});

app.post("/login", (req, res) => {
  const emailReq = req.body.email;
  const passwordReq = req.body.password;

  db("users")
    .where({ email: emailReq })
    .then(function (resDB) {
      if (!resDB || !resDB[0]) {
        console.log("Wrong Email");
        return res.status(401).json({ msg: "wrong email " });
      } else if (passwordReq === resDB[0].password) {
        console.log("OK");

        const userId = resDB[0].id;
        console.log(userId);
        return res.status(200).json({ userId });
      } else {
        console.log("Wrong PW");
        return res.status(401).json({ msg: "wrong password" });
      }
    })
    .catch(function (error) {
      console.log(error);
    });
});

function randomToken() {
  return Math.random().toString(36).substr(2);
}

app.get("/currentLogin", (req, res) => {
  const userId = JSON.parse(req.query.userId);

  db.select("*")
    .from("users")
    .where("id", "=", userId)
    .then((data) => {
      console.log(data[0]);
      res.json(data[0]);
    })

    .catch((err) => {
      console.log("Error", err);
    });
});
