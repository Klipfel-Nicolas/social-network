const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");

/**
 * A chaque request (lors de la navigation user) on test si le user possede le token de login
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
module.exports.checkUser = (req, res, next) => {
  const token = req.cookies.jwt; // On accede au cookies jwt (npm i -s cookie-parser)

  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      if (err) {
        /* res.locals.user = null; */
        //res.cookie("jwt", "", { maxAge: 1 }); (Probleme) On lui retire le cookie non valid
        next();
      } else {
        let user = await UserModel.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
module.exports.requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      if (err) {
        console.log(err);
      } else {
        console.log(decodedToken.id);
        next();
      }
    });
  } else {
    console.log("No token");
  }
};
