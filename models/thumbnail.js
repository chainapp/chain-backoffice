var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var ObjectId = mongoose.Schema.Types.ObjectId;


// define the schema for our user model
var thumbnailSchema = mongoose.Schema({
    title : { type: String, index : true },
    location_s3 : { type: String, index : true },
    created_at     : Date,
    location_s3_url : String,
    content_type : String
});
thumbnailSchema.set('versionKey', false);
// create the model for users and expose it to our app
module.exports = mongoose.model('Thumbnail', thumbnailSchema);
mongoose.set('debug',true);