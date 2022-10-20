var passwordValidator = require("password-validator");

// Create a schema
var schema = new passwordValidator();

// Add properties to it
schema
  .is()
  .min(6) // Minimum length 8
  .is()
  .max(100) // Maximum length 100
  .has()
  .digits(2) // Must have at least 2 digits
  .has()
  .not()
  .spaces() // Should not have spaces
  .is()
  .not()
  .oneOf(["Passw0rd", "Password123"]); // Blacklist these values

module.exports = (req, res, next) => {
  console.log("Processing data from the client's form");
  try {
    //Check the validity of the password
    const passwordValidity = schema.validate(req.body.password, {
      details: true,
    });
    if (passwordValidity.length > 0) {
      let errorMessage = "";
      passwordValidity.forEach((error) => {
        errorMessage += error.message + ". ";
      });
      res.status(400).json({ error: errorMessage });
    } else {
      next();
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};
