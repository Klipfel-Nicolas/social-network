const UserModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const { signUpErrors, signInErrros } = require("../utils/errors.utils");

// Le token est valid 3 jours (temps en milliseconde)
const maxAge = 3 * 24 * 60 * 60 * 1000;

// Cree un token pour conection
const createToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET, {
    expiresIn: maxAge,
  });
};

/**
 * SignUp
 * @param {*} req
 * @param {*} res
 */
module.exports.signUp = async (req, res) => {
  const { pseudo, email, password } = req.body;

  try {
    const user = await UserModel.create({ pseudo, email, password });
    res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = signUpErrors(err); //On appel utils -> signUpErrors en lui passant l'erreur (err) en paramètre
    res.status(200).send({ errors }); // On envoie le messsade d'erreur renvoyer par signUpErrors pour le front
  }
};

/**
 * SignIn
 * @param {*} req
 * @param {*} res
 */
module.exports.signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.login(email, password); //On recupère en bd les données et stock dans la const user
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge }); //Envoie un cookie qui s'appel jwt avec le token en httpOnly pour que personne ne puisse le voir
    res.status(200).json({ user: user._id });
  } catch (err) {
      const errors = signInErrros(err); 
      res.status(200).json({errors});
  }
};

/**
 * Logout
 * @param {*} req
 * @param {*} res
 */
module.exports.logout = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
};
