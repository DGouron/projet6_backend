const express = require("express");
const router = express.Router();
const sauceController = require("../controllers/sauce");
const auth = require("../middlewares/authorize");
const multer = require("../middlewares/multer-config");

router.post("/", auth, multer, sauceController.createSauce);
router.delete("/:id", auth, sauceController.deleteSauce);
router.put("/:id", auth, multer, sauceController.modifySauce);
router.get("/:id", auth, sauceController.getOneSauce);
router.get("/", auth, sauceController.getSauces);
router.post("/:id/like", auth, sauceController.likeSauce);

module.exports = router;
