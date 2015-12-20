var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var ObjectId = mongoose.Schema.Types.ObjectId;


// define the schema for our user model
var chainerSchema = mongoose.Schema({
    chain : {
        type: ObjectId, 
        ref: 'Chainsv2', 
        required: true, 
        index : true
    },
    user : {
        type: ObjectId, 
        ref: 'Users', 
        required: true, 
        index : true
    },
    picture : {
        type: ObjectId, 
        ref: 'Picture', 
        required: true, 
        index : true
    },
    picture_base_s3_url: String,
    thumbnail_base_s3_url: String,
    username : String,
    profilePicture : String,
    location : {
        city : { type: String, index : true },
        country : { type: String, index : true },
        latitude : Number,
        longitude : Number
    },
    punchline : {
        type: 'String'
    },
    created_at     : Date,
    updated_at     : Date,
    likes : [
        {
            type: ObjectId, 
            ref: 'Likes', 
            required: true, 
            index : true
        }
    ],
    thumbnails : [
            {
                type: ObjectId, 
                ref: 'Thumbnails', 
                required: true, 
                index : true
            } 
    ],
    position : {
        x : Number,
        y : Number
    }
});

chainerSchema.set('versionKey', false);

// create the model for users and expose it to our app
module.exports = mongoose.model('Chainers', chainerSchema);
//mongoose.set('debug', true);