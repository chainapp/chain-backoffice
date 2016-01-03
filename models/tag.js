var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var ObjectId = mongoose.Schema.Types.ObjectId;



// define the schema for our user model
var tagSchema = mongoose.Schema({
    tag : { type: String, index : true },
    s3_picture_url : String,
    created_at     : Date,
    priority : Number
});

tagSchema.set('versionKey', false);

// create the model for users and expose it to our app
module.exports = mongoose.model('Tags', tagSchema);
//mongoose.set('debug', true);