const express = require('express');
const router = express.Router();
const sauceController = require('../controllers/sauce');
const auth = require('../middlewares/authorize');
const multer = require('../middlewares/multer-config');

router.post('/', auth, multer, sauceController.createThing);
router.delete('/:id', auth, sauceController.deleteThing);  
router.put('/:id', auth, multer, sauceController.modifyThing);
router.get('/:id', auth, sauceController.getOneThing);  
router.get('/', auth, sauceController.getThings);

module.exports = router;