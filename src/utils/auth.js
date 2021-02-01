const jwt = require("jsonwebtoken");

const decodeToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (typeof decoded.user !== "undefined" && decoded.user._id.length > 0) {
      let user = decoded.user;
      user.type = decoded.type;
      return user;
    } else {
      return null;
    }
  } catch(err) {
    return null
  }
};

module.exports = { decodeToken };
