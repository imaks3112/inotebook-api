
const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017/";


const connectToDB = async () => {
    try {
        mongoose.set('strictQuery', false)
        mongoose.connect(mongoURI) 
        console.log('Mongo connected Succefully')
    } catch(error) {
        console.log(error)
        process.exit()
    }
}

module.exports = connectToDB;