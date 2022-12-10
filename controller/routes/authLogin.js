var express = require("express");
var router = express.Router();
var User = require("../../model/user");
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

router.post("/cadastro", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password == null) {
    return res.status(403).json("Missing some fields");
  }

  const userAlreadyExists = await User.findOne({ email }).exec();

  if (userAlreadyExists) {
    return res.status(403).json({ error: "User already registered" });
  }

  const newUser = new User({
    email,
    password: bcrypt.hashSync(password, 8),
  });

  newUser.save();

  res.status(200).json({ msg: "Registered with success" });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(403).json({ error: "Missing some fields" });
  }

  const user = await User.findOne({ email }).exec();

  if (!user) {
    return res.status(403).json({ error: "User do not exists" });
  }

  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(403).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);

  res.status(200).json({ token });
});

module.exports = router;
