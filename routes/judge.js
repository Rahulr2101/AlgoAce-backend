const express = require('express');
const router = express.Router();
const { execute } = require('../controllers/judge');
const { getSubmissionById } = require('../controllers/submission');
const {protect} =  require("../middleware/authMiddleware");
const {getQuestionByIdRecent} = require("../controllers/submission");


router.post('/execute',protect,execute);
router.post('/submission',protect,getSubmissionById);
router.get('/submission/recent',protect,getQuestionByIdRecent);

module.exports = router;