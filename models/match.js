var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var matchSchema = mongoose.Schema(
	{
		user: {
			user_ref : {
				type: ObjectId, 
				ref: 'User', 
				required: true, 
				index : true
			},
			category : {
				type: 'string'
			}
		},
		adversary: {
			user_ref: {
				type: ObjectId, 
				ref: 'User', 
				required: true, 
				index : true
			},
			category : {
				type: 'string'
			}
		},
		date: { 
			type: 'date', 
			index: true, 
			required: true},
		duration: { 
			type: 'number', 
			index: false, 
			required: true
		},
		result: { 
			type: 'string', 
			index: true, 
			required: true
		},
		type: { 
			type: 'string', 
			index: true, 
			required: true
		},
		stake: {}
	}
);

var Match = mongoose.model('Match', matchSchema);

//mongoose.set('debug', true);
matchSchema.set('versionKey', false);

module.exports = {
	Match: Match
};
