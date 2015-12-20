var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var ObjectId = mongoose.Schema.Types.ObjectId;



var mentions = new mongoose.Schema({
    type : String,
    id : ObjectId,
    value : String
})

// define the schema for our user model
var chainSchema = mongoose.Schema({
    title : { type: String, index : true },
    original_picture_s3 :  {
        type: ObjectId, 
        ref: 'Pictures', 
        required: true, 
        index : true
    },
    original_picture_s3_url: String,
    current_picture_s3 : {
        type: ObjectId, 
        ref: 'Pictures', 
        required: true, 
        index : true
    },
    current_picture_s3_url: String,
    author : {
        type: ObjectId, 
        ref: 'Users', 
        required: true, 
        index : true
    },
    chainers : [
        {
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
            username : String,
            position : [
                {
                    type: 'String'
                }
            ],
            location : {
                city : { type: String, index : true },
                country : { type: String, index : true },
                latitude : Number,
                longitude : Number
            }
        }
        
    ],
    created_at     : Date,
    updated_at     : Date,
    expire_at   : { type: String, index : true },
    status  : String,
    type : String,
    position : [
                {
                    type: 'String'
                }
            ],
    comments : [
        {
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
        }
    ],
    likes : [
        {
            username : String,
            user : {
                type: ObjectId, 
                ref: 'Users', 
                required: true, 
                index : true
            },
            date : Date,
            profilePicture : String
        }
    ],
    views_count    : Number,
    location : {
        city : { type: String, index : true },
        country : { type: String, index : true },
        latitude : Number,
        longitude : Number
    }
});

chainSchema.set('versionKey', false);

// create the model for users and expose it to our app
module.exports = mongoose.model('Chains', chainSchema);
//mongoose.set('debug', true);