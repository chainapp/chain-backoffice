var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var ObjectId = mongoose.Schema.Types.ObjectId;



// define the schema for our user model
var forbiddenSchema = mongoose.Schema({
    tag : { type: String, index : true },
    created_at     : Date
});

forbiddenSchema.set('versionKey', false);

// create the model for users and expose it to our app
module.exports = mongoose.model('Forbiddens', forbiddenSchema);
//mongoose.set('debug', true);