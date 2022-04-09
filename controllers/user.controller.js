const UserModel = require("../models/user.model"); //base de donnée
const ObjectID = require("mongoose").Types.ObjectId; //Verifie si l id est reconnu en base de donné

/**
 *
 * Get AllUsers
 * @param {*} req
 * @param {*} res
 */
module.exports.getAllUsers = async (req, res) => {
  const users = await UserModel.find().select("-password"); // -password pour ne pas envoyer le password
  res.status(200).json(users);
};

/**
 * Get UserInfos
 * @param {*} req
 * @param {*} res
 * @returns
 */
module.exports.userInfo = (req, res) => {
  //Si l'id n'est pas valide
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ID unknow : " + req.params.id);
  }

  //Find user by Id and return userInfos (docs)
  UserModel.findById(req.params.id, (err, docs) => {
    if (!err) res.send(docs);
    else console.log("ID unknown : " + err);
  }).select("-password");
};

/**
 *
 * Update User
 * @param {*} req
 * @param {*} res
 */
module.exports.updateUser = async (req, res) => {
  //Si l'id n'est pas valide
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ID unknow : " + req.params.id);
  }

  try {
    await UserModel.findOneAndUpdate(
      { _id: req.params.id }, // find by id
      {
        $set: {
          //set (update) something
          bio: req.body.bio,
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true } //A mettre obligatoirement quand on fait un put

      //Probleme avec callBack => use then just after or downgrade to mongoose@5.10.6
      /* (err, docs) => {
              if (!err) return res.send(docs)
              if (err) return res.status(500).send({ message: err });
          } */
    )
      .then((docs) => res.send(docs))
      .catch((err) => res.status(500).send({ message: err }));
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

/**
 *
 * Delete User
 * @param {*} req
 * @param {*} res
 * @returns
 */
module.exports.deleteUser = async (req, res) => {
  //Si l'id n'est pas valide
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ID unknow : " + req.params.id);
  }

  try {
    await UserModel.remove({ _id: req.params.id }).exec();
    res.status(200).json({ message: "Successfully deleted." });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

/**
 * Follow
 * @param {*} req
 * @param {*} res
 * @returns
 */
module.exports.follow = async (req, res) => {
  //Si l'id n'est pas valide
  if (
    !ObjectID.isValid(req.params.id) ||
    !ObjectID.isValid(req.body.idToFollow)
  ) {
    return res.status(400).send("ID unknow : " + req.params.id);
  }

  try {
    // add to the follower list
    await UserModel.findByIdAndUpdate(
      req.params.id, //Id de la perssonne qui va follow (params url)
      { $addToSet: { followings: req.body.idToFollow } }, //idToFollow = id sur lequel on aura cliquer, donc id a follow
      { new: true, upsert: true }
    )
      .then((docs) => res.status(201).json(docs))
      .catch((err) => res.status(400).json(err));

    //add to following list
    await UserModel.findByIdAndUpdate(
      req.body.idToFollow,
      { $addToSet: { followers: req.params.id } },
      { new: true, upsert: true }
    ).catch((err) => res.status(400).json(err));
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

/**
 * UnFollow
 * @param {*} req
 * @param {*} res
 * @returns
 */
module.exports.unfollow = async (req, res) => {
  //Si l'id n'est pas valide
  if (
    !ObjectID.isValid(req.params.id) ||
    !ObjectID.isValid(req.body.idToUnfollow)
  ) {
    return res.status(400).send("ID unknow : " + req.params.id);
  }

  try {
    // add to the follower list
    await UserModel.findByIdAndUpdate(
      req.params.id, //Id de la perssonne qui va follow (params url)
      { $pull: { followings: req.body.idToUnfollow } }, //idToUnfollow = id sur lequel on aura cliquer, donc id a follow
      { new: true, upsert: true }
    )
      .then((docs) => res.status(201).json(docs))
      .catch((err) => res.status(400).json(err));

    //add to following list
    await UserModel.findByIdAndUpdate(
      req.body.idToUnfollow,
      { $pull: { followers: req.params.id } },
      { new: true, upsert: true }
    ).catch((err) => res.status(400).json(err));
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};
