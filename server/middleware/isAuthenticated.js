const { expressjwt: jwt } = require("express-jwt");

const isAuthenticated = jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  requestProperty: "payload",
  getToken: (req) => {
    const header = req.headers.authorization;
    if (!header) return null;
    const [type, token] = header.split(" ");
    if (type !== "Bearer") return null;
    return token;
  },
});

module.exports = isAuthenticated;
