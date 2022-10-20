var validator = require("validator");

module.exports = (req, res, next) => {
  console.log("Processing data from the client's form : check email");
  try {
    //Check the validity of the email

    if (!validator.isEmail(req.body.email)) {
      let errorMessage = "";
      res.status(400).json({ error: errorMessage });
    } else {
      next();
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};
