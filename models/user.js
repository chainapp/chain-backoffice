// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var ObjectId = mongoose.Schema.Types.ObjectId;


// define the schema for our user model
var userSchema = mongoose.Schema({
    username : { type: String, required: true, index : true },
    profilePicture : String,
    local            : {
        /*email        : String,
        password     : String,*/
    },
    facebook         : {
    },
    twitter          : {
    },
    google           : {
    },
    notification     : {
        enable       : Boolean,
        token        : String,
        invite       : Boolean,
        complete     : Boolean,
        chained      : Boolean,
        like         : Boolean,
        comment      : Boolean,
        friend       : Boolean,
        platform     : String,
        lang         : String
    },
    chains          : [
        {
            type: ObjectId, 
            ref: 'Chains', 
            required: true, 
            index : true
        }
    ],
    chains_count : Number,
    followers          : {
                type: ObjectId, 
                ref: 'Followers', 
                required: true, 
                index : true
    },
    followers_count : Number,
    follows : {
                type: ObjectId, 
                ref: 'Follows', 
                required: true, 
                index : true
    },
    follows_count : Number,
    created_at     : Date,
    updated_at     : Date,
    last_connected_at : Date,
    is_public      : Boolean,
    access_token   : String,
    refresh_token  : String,
    views_count    : Number,
    isLoggedIn : Boolean
});


// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};
userSchema.set('versionKey', false);
// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
