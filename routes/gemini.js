const express = require('express');
const router = express.Router();
const {generate} = require('../controllers/gemini')
const {protect} =  require("../middleware/authMiddleware");

router.post('/generate',protect,generate);
module.exports = router;