const jsonwebtoken = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jsonwebtoken.verify(
      token,
      "rf94mxlnk8qqpd1mjhelegzh7ripu"
    );
    const userId = decodedToken.userId;
    if (!userId) {
      throw "User ID non valable.";
    } else {
      req.auth = { userId };
      next();
    }
  } catch (error) {
    res
      .status(401)
      .json({ error: error | "Request non authorized. Security error." });
  }
};
