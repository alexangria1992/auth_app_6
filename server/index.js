const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const colors = require("colors");

const salt = 10;

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "signup",
});

db.connect(function (err) {
  if (err) {
    console.error("erro connecting: " + err.stack);
    return;
  }
  console.log(colors.magenta("Connected to database"));
});

// ===== EndPoint ====== //
app.post("/register", async (req, res) => {
  const { name, email, password, confPassword } = req.body;
  if (password !== confPassword)
    return res
      .status(400)
      .json({ msg: "Password and Confirm Password do not match" });

  let hashedPassword = await bcrypt.hash(password, 8);
  console.log(hashedPassword);

  db.query(
    `INSERT INTO login SET ?`,
    { name: name, email: email, password: hashedPassword },
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        console.log(results);
        res.json({ Status: "Successful Registration" });
      }
    }
  );

  console.log(req.body);
});

app.listen(8081, () => {
  console.log(colors.cyan("Server is Running on localhost:8081"));
});
