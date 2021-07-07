const mongoose = require('mongoose');
//short hand used frequently
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose');

//creating a user data model
const userSchema = new Schema({
    //we will only need fields other than name,password
    email: {
        type: String,
        required: true,
        unique: true
    }
})

//passport automatically inserts username and password
userSchema.plugin(passportLocalMongoose);

//exporting User
module.exports = mongoose.model('User', userSchema);

