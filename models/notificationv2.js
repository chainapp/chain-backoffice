var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var ObjectId = mongoose.Schema.Types.ObjectId;


// define the schema for our user model
var notificationSchema = mongoose.Schema({
    message : String,
    type : String,
    lang : String,
    status : String
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Notificationsv2', notificationSchema);
//mongoose.set('debug', true);