  // tokenService.js or your helper file
  const jwt = require('jsonwebtoken');
  require('dotenv').config();

  exports.generateToken = (res, userId) => {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    res.cookie('token', token, {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      httpOnly: true, // Cookie is only accessible by the web server
    });
  };
