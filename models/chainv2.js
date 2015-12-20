var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var ObjectId = mongoose.Schema.Types.ObjectId;


// define the schema for our user model
var chainv2Schema = mongoose.Schema({
    title : { type: String, index : true },
    picture_base_s3_url: String,
    current_picture_s3 : {
        type: ObjectId, 
        ref: 'Pictures', 
        required: true, 
        index : true
    },
    share_picture_s3 : String,
    thumbnail_base_s3_url: String,
    author : {
        type: ObjectId, 
        ref: 'Chainers', 
        required: false, 
        index : true
    },
    chainers : [
            {
                type: ObjectId, 
                ref: 'Chainers', 
                required: true, 
                index : true
            }
    ],
    created_at     : Date,
    updated_at     : Date,
    status  : String,
    type : String,
    comments : [
        {
            type: ObjectId, 
            ref: 'Comments', 
            required: true, 
            index : true
        }
    ],
    likes : [
        {
            type: ObjectId, 
            ref: 'Likes', 
            required: true, 
            index : true
        }
    ],
    views_count    : Number,
    dimensions : {
        x : Number,
        y : Number
    },
    pictureSize : Number,
    matrix : {
                type: ObjectId, 
                ref: 'Matrice', 
                required: true, 
                index : true
            },
    tag : String,
    restricted : Boolean,
    chainers_count : Number,
    deeplink : String
});

chainv2Schema.set('versionKey', false);

// create the model for users and expose it to our app
module.exports = mongoose.model('Chainsv2', chainv2Schema);
//mongoose.set('debug', true);