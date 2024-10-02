const express = require('express');
const router = express.Router();
const {details} = require('../controllers/details');
const {protect} =  require("../middleware/authMiddleware");

router.get('/details',protect,details);

module.exports = router;