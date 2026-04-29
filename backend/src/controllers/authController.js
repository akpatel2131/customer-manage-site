const jwt = require("jsonwebtoken");
const { readDb, writeDb } = require("../data/dbStore");

const SECRET = process.env.JWT_SECRET;

exports.register = async (req, res) => {
  const { email, password, userName } = req.body;

  try {
    const db = await readDb();
    const userExists = db.users.find((user) => user.email === email);

    if (userExists) {
      return res.status(400).json({ msg: "User exists" });
    }

    const newUser = { id: Date.now(), email, password, userName };
    db.users.push(newUser);
    await writeDb(db);

    res.json({ msg: "Registered successfully" });
  } catch {
    res.status(500).json({ msg: "Unable to register user" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const db = await readDb();
    const user = db.users.find((item) => item.email === email && item.password === password);

    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.json({ token });
  } catch {
    res.status(500).json({ msg: "Unable to log in" });
  }
};
