var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var ObjectId = mongoose.Schema.Types.ObjectId;
var Chains = require('./chainv2.js');


// define the schema for our user model
var invitev2Schema = mongoose.Schema({
    inviter : {
        type: ObjectId, 
        ref: 'Users', 
        required: true, 
        index : true
    },
    chain : {
        type: ObjectId, 
        ref: 'Chainsv2', 
        required: true, 
        index : true
    },
    invited : {
                type: ObjectId, 
                ref: 'Users', 
                required: true, 
                index : true
            },
    created_at     : Date,
    updated_at     : Date
});
invitev2Schema.set('versionKey', false);

// create the model for users and expose it to our app
module.exports = mongoose.model('Invitesv2', invitev2Schema);
//mongoose.set('debug', true);