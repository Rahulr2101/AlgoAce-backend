const mongoose = require('mongoose');
require('dotenv').config();

exports.connect = async () => {
try{
    mongoose.connect(process.env.MONGO_URL).then(()=>{
        console.log('Database connected');
    })
}catch(err){
    console.error(`Error connecting to the database. \n${err}`);
}
}