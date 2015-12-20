var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var ObjectId = mongoose.Schema.Types.ObjectId;


// define the schema for our user model
var friendsSchema = mongoose.Schema({
    user : {
        type: ObjectId, 
        ref: 'Users', 
        required: true, 
        index : true
    },
    friends : [
        {
            chain_id : {
                type: ObjectId, 
                ref: 'Users', 
                required: true, 
                index : true
            },
            facebook_id : String,
            username : String,
            profilePicture : String,
            last_updated_at : String
        }
    ],
    created_at     : Date,
    updated_at     : Date
});
friendsSchema.set('versionKey', false);

// create the model for users and expose it to our app
module.exports = mongoose.model('Friends', friendsSchema);
//mongoose.set('debug', true);