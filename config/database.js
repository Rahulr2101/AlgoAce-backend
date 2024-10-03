const mongoose = require('mongoose');
require('dotenv').config();

exports.connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
    
    });
    console.log('Database connected');
  } catch (err) {
    console.error(`Error connecting to the database: ${err.message}`);
    process.exit(1); // Exit process with failure
  }
};
