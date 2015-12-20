var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var ObjectId = mongoose.Schema.Types.ObjectId;
var Chains = require('./chain.js');


// define the schema for our user model
var inviteSchema = mongoose.Schema({
    inviter : {
        type: ObjectId, 
        ref: 'Users', 
        required: true, 
        index : true
    },
    chain : {
        type: ObjectId, 
        ref: 'Chains', 
        required: true, 
        index : true
    },
    invited : [
            {
                type: ObjectId, 
                ref: 'Users', 
                required: true, 
                index : true
            }
    ],
    created_at     : Date,
    updated_at     : Date
});
inviteSchema.set('versionKey', false);

// create the model for users and expose it to our app
module.exports = mongoose.model('Invites', inviteSchema);
//mongoose.set('debug', true);