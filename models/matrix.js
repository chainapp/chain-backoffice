var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var ObjectId = mongoose.Schema.Types.ObjectId;


// define the schema for our user model
var matrixSchema = mongoose.Schema({
    chain :  {},
    dimensions : {
        x : Number,
        y : Number
    },
    matrix : { }
});

matrixSchema.set('versionKey', false);

// create the model for users and expose it to our app
module.exports = mongoose.model('Matrices', matrixSchema);
//mongoose.set('debug', true);