var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var ObjectId = mongoose.Schema.Types.ObjectId;


// define the schema for our user model
var pictureSchema = mongoose.Schema({
    title : { type: String, index : true },
    location_s3 : { type: String, index : true },
    created_at     : Date,
    location_s3_url : { type: String, required : false },
    thumbnails : [
        {
            id : Number,
            s3_url : { type: String, required : false },
            size : Number
        }   
    ],
    content_type : { type: String, required : false },
    thumbnail : {
        type: ObjectId, 
        ref: 'Thumbnails', 
        required: false, 
        index : true
    }
});
pictureSchema.set('versionKey', false);

// create the model for users and expose it to our app
module.exports = mongoose.model('Picture', pictureSchema);