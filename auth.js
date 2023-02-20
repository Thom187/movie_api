const jwtSecret =
  process.env.API_KEY; /* This has to be the same key
used in JWTStrategy(passport.js) */

import { sign } from "jsonwebtoken";
import { authenticate } from "passport";

import "./passport"; // My local passport file

let generateJWTToken = (user) => {
  return sign(user, jwtSecret, {
    subject: user.username, // This is the username you are encoding in the JWT
    expiresIn: "7d", // Expires in 7 days
    algorithm: "HS256" /* This is the algorithm used to "sign" or encode
       the values of the JWT */,
  });
};

// POST login.
export default (router) => {
  router.post("/login", (req, res) => {
    authenticate("local", { session: false }, (error, user, info) => {
      if (error || !user) {
        return res.status(400).json({
          message: "Something is not right",
          user: user,
        });
      }
      req.login(user, { session: false }, (error) => {
        if (error) {
          res.send(error);
        }
        let token = generateJWTToken(user.toJSON());
        return res.json({ user, token });
      });
    })(req, res);
  });
};
