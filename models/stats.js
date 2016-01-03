var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var ObjectId = mongoose.Schema.Types.ObjectId;


// define the schema for our user model
var statsSchema = mongoose.Schema({
    date : { type: Date, index : true },
    user_id : { type: String, index : true },
    username : { type: String, index : true },
    method : String,
    action : { type: String, index : true }
});

statsSchema.set('versionKey', false);

// create the model for users and expose it to our app
module.exports = mongoose.model('Stats', statsSchema);
//mongoose.set('debug', true);