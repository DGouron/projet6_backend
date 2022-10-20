const Sauce = require("../models/sauce");
const fs = require("fs");

const valideImageFormat = {
  "image/jpg": true,
  "image/jpeg": true,
  "image/png": true,
  "image/webp": true,
};

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;

  if (!valideImageFormat[req.file.mimetype]) {
    console.log("Invalid image format.");
    res.status(400).json({ error: "Invalid image format." });
  } else {
    const sauce = new Sauce({
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`,
    });
    sauce
      .save()
      .then(() => res.status(201).json({ message: "Objet enregistré !" }))
      .catch((error) => res.status(400).json({ error }));
  }
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.findOne({ _id: req.params.id }).then((sauce) => {
          if (!sauce) {
            return res.status(404).json({
              error: new Error("Object not found."),
            });
          }

          if (sauce.userId !== req.auth.userId) {
            return res.status(401).json({
              error: new Error("Request non authorized."),
            });
          }
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: "Objet supprimé" }))
            .catch((error) => res.status(400).json({ error }));
        });
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.modifySauce = (req, res, next) => {
  if (!valideImageFormat[req.file.mimetype]) {
    console.log("Invalid image format.");
    res.status(400).json({ error: "Invalid image format." });
  } else {
    const sauceObject = req.file
      ? {
          ...JSON.parse(req.body.sauce),
          imageUrl: `${req.protocol}://${req.get("host")}/images/${
            req.file.filename
          }`,
        }
      : { ...req.body };
    Sauce.updateOne(
      { _id: req.params.id },
      { ...sauceObject, _id: req.params.id }
    )
      .then(() => res.status(201).json({ message: "Objet modifié." }))
      .catch((error) => res.status(400).json({ error }));
  }
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

exports.getSauces = (req, res, next) => {
  Sauce.find()
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.likeSauce = (req, res, next) => {};
