const postModel = require("../models/post.model");
const PostModel = require("../models/post.model");
const UserModel = require("../models/user.model");
const fs = require("fs");
const { promisify } = require("util");
const { pipeline } = require("stream");
const { uploadErrors } = require("../utils/errors.utils");
const ObjectId = require("mongoose").Types.ObjectId;

/**
 * Get Post
 * @param {*} req
 * @param {*} res
 */
module.exports.readPost = (req, res) => {
  PostModel.find((err, docs) => {
    if (!err) res.send(docs);
    else console.log("Error to get data : " + err);
  }).sort({ createdAt: -1 }); //Pour trier du plus recent au plus anciens
};

/**
 * Create Post
 * @param {*} req
 * @param {*} res
 */
module.exports.createPost = async (req, res) => {
  let fileName;

  // Si il y a une image dans le post
  if (req.file !== null) {
    try {
      if (
        req.file.detectedMimeType !== "image/jpg" &&
        req.file.detectedMimeType !== "image/png" &&
        req.file.detectedMimeType !== "image/jpeg"
      )
        throw Error("invalid file"); //Throw arrete imediatement le try et renvois au catch

      if (req.file.size > 500000) throw Error("max size");
    } catch (err) {
      const errors = uploadErrors(err);
      return res.status(201).json({ errors });
    }

    fileName = req.body.posterId + Date.now() + ".jpg";

    await pipeline(
      req.file.stream,
      fs.createWriteStream(
        `${__dirname}/../client/public/uploads/post/${fileName}`
      ),
      (err, result) => {
        if (err) console.log("error", err);
      }
    );
  }

  const newPost = new postModel({
    posterId: req.body.posterId,
    message: req.body.message,
    picture: req.file !== null ? "./uploads/post/" + fileName : "",
    video: req.body.video,
    likers: [],
    comments: [],
  });

  try {
    const post = await newPost.save();
    return res.status(201).json(post);
  } catch (err) {
    return res.status(400).send(err);
  }
};

/**
 * Update Post
 * @param {*} req
 * @param {*} res
 * @returns
 */
module.exports.updatePost = (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).send("ID unknow : " + req.params.id);
  }

  const updatedRecord = {
    message: req.body.message,
  };

  PostModel.findByIdAndUpdate(
    req.params.id,
    { $set: updatedRecord },
    { new: true }
  )
    .then((docs) => res.send(docs))
    .catch((err) => res.status(500).send({ message: err }));
};

/**
 * Delete Post
 * @param {*} req
 * @param {*} res
 * @returns
 */
module.exports.deletePost = (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).send("ID unknow : " + req.params.id);
  }

  PostModel.findByIdAndRemove(req.params.id, (err, docs) => {
    if (!err) res.send(docs);
    else console.log("Deleted error : " + err);
  });
};

/* ---------------------------------------
Likes
---------------------------------------- */

/**
 * Like Post
 * @param {*} req
 * @param {*} res
 */
module.exports.likePost = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).send("ID unknow : " + req.params.id);
  }

  try {
    await PostModel.findByIdAndUpdate(
      req.params.id, //On recupère l id du post en paramètre dans lurl
      {
        $addToSet: { likers: req.body.id }, // On rajoute au tableau des likers du post l'id de la personne qui a liker
      },
      { new: true }
    ).catch((err) => res.status(400).send({ err }));

    await UserModel.findByIdAndUpdate(
      req.body.id, //On récupère le user qui a liker (id)
      {
        $addToSet: { likes: req.params.id }, //On rajoute aux likes du user le like
      },
      { new: true }
    )
      .then((docs) => res.send(docs))
      .catch((err) => res.status(400).send({ message: err }));
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

/**
 * Unlike Post
 * @param {*} req
 * @param {*} res
 */
module.exports.unlikePost = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).send("ID unknow : " + req.params.id);
  }

  try {
    await PostModel.findByIdAndUpdate(
      req.params.id, //On recupère l id du post en paramètre dans lurl
      {
        $pull: { likers: req.body.id }, // On rajoute au tableau des likers du post l'id de la personne qui a liker
      },
      { new: true }
    ).catch((err) => res.status(400).send({ err }));

    await UserModel.findByIdAndUpdate(
      req.body.id, //On récupère le user qui a liker (id)
      {
        $pull: { likes: req.params.id }, //On rajoute aux likes du user le like
      },
      { new: true }
    )
      .then((docs) => res.send(docs))
      .catch((err) => res.status(400).send({ message: err }));
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

/* ---------------------------------------
Comments
---------------------------------------- */
/**
 * comments
 * @param {*} req
 * @param {*} res
 */
module.exports.commentPost = (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).send("ID unknow : " + req.params.id);
  }

  try {
    return PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          comments: {
            commenterId: req.body.commenterId,
            commenterPseudo: req.body.commenterPseudo,
            text: req.body.text,
            timestamp: new Date().getTime(),
          },
        },
      },
      { new: true },
      (err, docs) => {
        if (!err) return res.send(docs);
        else return res.status(400).send(err);
      }
    );
  } catch (err) {
    return res.status(400).send(err);
  }
};

/**
 * Edit Comment
 * @param {*} req
 * @param {*} res
 */
module.exports.editCommentPost = (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).send("ID unknow : " + req.params.id);
  }

  try {
    return PostModel.findById(
      req.params.id, // recupere le post par l'id
      (err, docs) => {
        //Cherche LE commentaire que l'on veut editer
        const theComment = docs.comments.find((comment) =>
          comment._id.equals(req.body.commentId)
        );

        if (!theComment) return res.status(404).send("Comment not found");

        theComment.text = req.body.text;
        return docs.save((err) => {
          if (!err) return res.status(200).send(docs);
          return res.status(500).send(err);
        });
      }
    );
  } catch (err) {
    return res.status(400).send(err);
  }
};

/**
 * Delete Comment
 * @param {*} req
 * @param {*} res
 */
module.exports.deleteCommentPost = (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).send("ID unknow : " + req.params.id);
  }

  try {
    return PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: {
          comments: {
            _id: req.body.commentId,
          },
        },
      },
      { new: true },
      (err, docs) => {
        if (!err) return res.send(docs);
        else return res.status(400).send(err);
      }
    );
  } catch (err) {
    return res.status(400).send(err);
  }
};
