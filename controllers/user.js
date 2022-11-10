const brcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const User = require("../models/user");
const saltRounds = 10;
const sanitize = require("mongo-sanitize");

const cleanIt = (itemToClean) => {
  return sanitize(itemToClean);
};

const createToken = (user) => {
  return jsonwebtoken.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "8h",
  });
};

exports.signup = async (req, res, next) => {
  console.log("Try to signup : " + cleanIt(req.body.email));
  try {
    const generatedSalt = await brcrypt.genSalt(saltRounds);
    const hash = await brcrypt.hash(cleanIt(req.body.password), generatedSalt);
    const user = new User({
      email: cleanIt(req.body.email),
      password: hash,
    });
    await user.save();
    res.status(201).json({ message: "User created." });
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

exports.login = async (req, res, next) => {
  console.log(cleanIt(req.body.email) + " try to connect.");
  try {
    const user = await User.findOne({ email: cleanIt(req.body.email) });
    if (!user) {
      return res.status(401).json({ error: "User not found." });
    }
    const compare = await brcrypt.compare(
      cleanIt(req.body.password),
      user.password
    );
    if (!compare) {
      return res.status(401).json({ error: "Wrong password." });
    }
    console.log('User "' + cleanIt(req.body.email) + '" connected.');
    res.status(200).json({
      userId: user._id,
      token: createToken(user),
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};
