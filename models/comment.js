var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var ObjectId = mongoose.Schema.Types.ObjectId;



var mentions = new mongoose.Schema({
    type : String,
    id : ObjectId,
    value : String
})

// define the schema for our user model
var commentSchema = mongoose.Schema({
    chain : {
        type: ObjectId, 
        ref: 'Chainsv2', 
        required: true, 
        index : true
    },
    username : String,
    user : {
        type: ObjectId, 
        ref: 'Users', 
        required: true, 
        index : true
    },
    date : Date,
    content : String,
    profilePicture : String,
    mentions : [mentions]
});

commentSchema.set('versionKey', false);

// create the model for users and expose it to our app
module.exports = mongoose.model('Comments', commentSchema);
//mongoose.set('debug', true);