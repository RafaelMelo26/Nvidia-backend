var express = require("express");
var router = express.Router();
var User = require("../../model/user");
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

router.post("/cadastro", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password == null) {
    return res.status(403).json({ error: "Campo(s) não preenchido(s)" });
  }

  if (await User.findOne({ email }).exec()) {
    return res.status(403).json({ error: "Usuário jà cadastrado" });
  }

  const newUser = new User({
    email,
    password: bcrypt.hashSync(password, 8),
  });

  const user = await newUser.save();

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);

  res.status(200).json({ msg: "Cadastrado com sucesso", token });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(403).json({ error: "Campo(s) não preenchido(s)" });
  }

  const user = await User.findOne({ email }).exec();

  if (!user) {
    return res.status(403).json({ error: "Usuário inválido" });
  }

  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(403).json({ error: "Senha inválida" });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);

  res.status(200).json({ token });
});

module.exports = router;
