const brcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const User = require("../models/user");

exports.signup = (req, res, next) => {
  console.log("Try to signup : " + req.body.email);
  brcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() => {
          res.status(201).json({ message: "User created." });
        })
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
exports.login = (req, res, next) => {
  console.log(req.body.email + " try to connect.");
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "User not found." });
      }
      brcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Bad password." });
          }
          res.status(200).json({
            userId: user._id,
            token: jsonwebtoken.sign(
              { userId: user._id },
              "RANDOM_TOKEN_SECRET",
              { expiresIn: "24h" }
            )
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

