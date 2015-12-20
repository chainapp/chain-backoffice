var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var ObjectId = mongoose.Schema.Types.ObjectId;


// define the schema for our user model
var likeSchema = mongoose.Schema({
    username : String,
    user : {
        type: ObjectId, 
        ref: 'Users', 
        required: true, 
        index : true
    },
    date : Date,
    profilePicture : String,
    chain : {
        type: ObjectId, 
        ref: 'Chainsv2', 
        required: false, 
        index : true
    },
    chainer : {
        type: ObjectId, 
        ref: 'Chainers', 
        required: false, 
        index : true
    },
    type : String
});

likeSchema.set('versionKey', false);

// create the model for users and expose it to our app
module.exports = mongoose.model('Likes', likeSchema);
//mongoose.set('debug', true);