// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var ObjectId = mongoose.Schema.Types.ObjectId;


// define the schema for our user model
var followsSchema = mongoose.Schema({
    list : [{
                type: ObjectId, 
                ref: 'Users'
    }],
    count : Number
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Follows', followsSchema);