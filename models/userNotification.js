var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var ObjectId = mongoose.Schema.Types.ObjectId;


// define the schema for our user model
var userNotificationSchema = mongoose.Schema({
    user : {
        type: ObjectId, 
        ref: 'Users', 
        required: true, 
        index : true
    },
    message : String,
    notification_type: String,
    sender_name: String,
    sender_profile_picture: String,
    sender_id: {
        type: ObjectId, 
        ref: 'Users', 
        required: false, 
        index : true
    },
    chain_title: String,
    chain_id :  {
        type: ObjectId, 
        ref: 'Chainsv2', 
        required: false, 
        index : true
    },
    lang : String,
    object_type: String,
    object_reference: ObjectId,
    created_at : Date,
    clicked : Boolean,
    viewed : Boolean
});

// create the model for users and expose it to our app
module.exports = mongoose.model('UserNotifications', userNotificationSchema);
//mongoose.set('debug', true);