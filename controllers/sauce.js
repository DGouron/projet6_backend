const MongooseErrors = require("mongoose-errors");
const Sauce = require("../models/sauce");
const dotenv = require("dotenv");
const fs = require("fs");
dotenv.config();

const valideImageFormat = {
  "image/jpg": true,
  "image/jpeg": true,
  "image/png": true,
  "image/webp": true,
};

exports.createSauce = async (req, res, next) => {
  try {
    if (!valideImageFormat[req.file.mimetype]) {
      console.log("Invalid image format.");
      res.status(400).json({ error: "Invalid image format." });
    } else {
      const sauceObject = JSON.parse(req.body.sauce);
      delete sauceObject._id;
      const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get("host")}/${
          process.env.IMAGE_FOLDER
        }/${req.file.filename}`,
      });
      await sauce.save();
      res.status(201).json({ message: "Objet enregistré." });
    }
  } catch (error) {
    res.status(400).json({ error: MongooseErrors(error) });
  }
};

exports.deleteSauce = async (req, res, next) => {
  try {
    const sauce = await Sauce.findOne({ _id: req.params.id });

    fs.unlink(`${sauce.imageUrl.split("/").slice(3).join("/")}`, async () => {
      console.log(` Image deleted : ${sauce.imageUrl}`);
      await Sauce.deleteOne({ _id: req.params.id });
      res.status(200).json({ message: "Objet supprimé." });
    });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

exports.modifySauce = async (req, res, next) => {
  try {
    const sauceObject = req.file
      ? {
          ...JSON.parse(req.body.sauce),
          imageUrl: `${req.protocol}://${req.get("host")}/${
            process.env.IMAGE_FOLDER
          }/${req.file.filename}`,
        }
      : { ...req.body };

    const sauce = await Sauce.findOne({ _id: req.params.id });

    if (req.file && sauce.imageUrl) {
      fs.unlink(`${sauce.imageUrl.split("/").slice(3).join("/")}`, () => {
        console.log(
          ` Image deleted : ${process.env.IMAGE_FOLDER}/${sauce.imageUrl}`
        );
      });
    }

    await Sauce.updateOne(
      { _id: req.params.id },
      { ...sauceObject, _id: req.params.id }
    );
    res.status(200).json({ message: "Objet modifié." });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

exports.getOneSauce = async (req, res, next) => {
  try {
    const sauce = await Sauce.findOne({ _id: req.params.id });
    res.status(200).json(sauce);
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.getSauces = async (req, res, next) => {
  try {
    const sauces = await Sauce.find();
    res.status(200).json(sauces);
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.likeSauce = async (req, res, next) => {
  try {
    switch (req.body.like) {
      case 1:
        await Sauce.updateOne(
          { _id: req.params.id },
          {
            $push: { usersLiked: req.body.userId },
            $inc: { likes: 1 },
          }
        );
        res.status(200).json({ message: "Objet liké." });
        break;
      case -1:
        await Sauce.updateOne(
          { _id: req.params.id },
          {
            $push: { usersDisliked: req.body.userId },
            $inc: { dislikes: 1 },
          }
        );
        res.status(200).json({ message: "Objet disliké." });
        break;
      case 0:
        const sauce = await Sauce.findOne({ _id: req.params.id });
        if (sauce.usersLiked.includes(req.body.userId)) {
          await Sauce.updateOne(
            { _id: req.params.id },
            {
              $pull: { usersLiked: req.body.userId },
              $inc: { likes: -1 },
            }
          );
          res.status(200).json({ message: "Objet unliké." });
        }
        if (sauce.usersDisliked.includes(req.body.userId)) {
          await Sauce.updateOne(
            { _id: req.params.id },
            {
              $pull: { usersDisliked: req.body.userId },
              $inc: { dislikes: -1 },
            }
          );
          res.status(200).json({ message: "Objet undisliké." });
        }
        break;
      default:
        res.status(400).json({ error: "Invalid like value." });
    }
  } catch (error) {
    res.status(400).json(error);
  }
};
