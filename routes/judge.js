const express = require('express');
const router = express.Router();
const { execute } = require('../controllers/judge');
const { getSubmissionById } = require('../controllers/submission');
const {protect} =  require("../middleware/authMiddleware");


router.post('/execute',protect,execute);
router.post('/submission',protect,getSubmissionById);

module.exports = router;