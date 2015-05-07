'use strict';

module.exports = {
	mailer: {
		auth: {
			user: 'doyoufacefight@gmail.com',
			pass: 'fac3fight'
		},
		defaultFromAddress: 'Facefight ✔ <doyoufacefight@gmail.com>'
	},
	twitter: {
	   consumer_key:         'KUV58xsSCCzfiV7UZLJXXehCa',
	   consumer_secret:      'sQIbBuI835JkLzWTe4LS60Xho5rd7EiPfK4gN5thAZlxn5DtT8',
	   access_token:         '2982644231-5DfibM9TzYX9cKby0xRxOVFYX6t00bKtFz6RScB',
	   access_token_secret:  'AAHZzex4QnOBSM9StDt7HN3D13uUJYPYTfKz5OOhkWEI5'
	},
	instagram: {
		client_id: '1540e90cb61e49e68126fba704960dc9',
        client_secret: '4be769b2460c4cc2bdc791ff03222e4f'
	},
	facebook: {
		appId: '940317362659855',
		secret: '407d1ca9220de0cabb69298424bb0868'
	},
	mongo: {
		url_prod: 'mongodb://52.17.127.121:27017/facefight',
		url_dev: 'mongodb://localhost:27017/facefight'
	}
}