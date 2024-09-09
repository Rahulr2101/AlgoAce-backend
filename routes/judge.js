const express = require('express');
const router = express.Router();
const { execute } = require('../controllers/judge');
const {protect} =  require("../middleware/authMiddleware");


router.post('/execute',protect,execute);

module.exports = router;