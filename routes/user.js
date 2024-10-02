const {registerUser,loginUser}  =  require('../controllers/userController');
const express = require('express');
const router = express.Router();
const {getUserSubmission} = require('../controllers/UserSubmission');
const {protect} = require('../middleware/authMiddleware');



router.post('/register',registerUser);
router.post('/login',loginUser);
router.get('/userSub',protect,getUserSubmission);




module.exports = router;