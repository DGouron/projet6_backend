const brcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const User = require("../models/user");
const saltRounds = 10;

exports.signup = async (req, res, next) => {
  console.log("Try to signup : " + req.body.email);
  try {
    const generatedSalt = await brcrypt.genSalt(saltRounds);
    const hash = await brcrypt.hash(req.body.password, generatedSalt);
    const user = new User({
      email: req.body.email,
      password: hash,
    });
    await user.save();
    res.status(201).json({ message: "User created." });
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

exports.login = async (req, res, next) => {
  console.log(req.body.email + " try to connect.");
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ error: "User not found." });
    }
    const compare = await brcrypt.compare(req.body.password, user.password);
    if (!compare) {
      return res.status(401).json({ error: "Wrong password." });
    }
    res.status(200).json({
      userId: user._id,
      token: jsonwebtoken.sign(
        { userId: user._id },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "24h",
        }
      ),
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};
