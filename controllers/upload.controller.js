const UserModel = require("../models/user.model");
const fs = require("fs");
const { promisify } = require("util");
const { pipeline } = require("stream");
const { uploadErrors } = require("../utils/errors.utils");
const pipline = promisify(require("stream").pipeline);

module.exports.uploadProfil = async (req, res) => {
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

  //Si on passe le try, on traite le fichier
  const fileName = req.body.name + ".jpg"; //req.body.name + ".jpg";On renome la photo en lui donnant le pseudo user ce qui ecrase la precedente car elle a le meme nom + .jpg

  //Crée le fichier dans le dossier
  await pipeline(
    req.file.stream,
    fs.createWriteStream(
      `${__dirname}/../client/public/uploads/profil/${fileName}`
    ),
    (err, result) => {
      if (err) console.log("error", err);
    }
  );

  try {
    await UserModel.findByIdAndUpdate(
      req.body.userId,
      { $set: { picture: "./uploads/profil/" + fileName } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    )
      .then((docs) => res.send(docs))
      .catch((err) => res.status(500).send({ message: err }));
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};
