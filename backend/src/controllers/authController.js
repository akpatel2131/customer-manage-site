const jwt = require("jsonwebtoken");
const { users } = require("../data/db");

const SECRET = process.env.JWT_SECRET;

exports.register = (req, res) => {
  const { email, password } = req.body;

  const userExists = users.find(u => u.email === email);
  if (userExists) return res.status(400).json({ msg: "User exists" });

  const newUser = { id: Date.now(), email, password };
  users.push(newUser);

  res.json({ msg: "Registered successfully" });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(400).json({ msg: "Invalid credentials" });

  const token = jwt.sign({ id: user.id }, SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  res.json({ token });
};