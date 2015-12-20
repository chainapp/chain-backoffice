'use strict';

module.exports = {
	mailer: {
		auth: {
			user: 'chainappcontact@gmail.com',
			pass: 'Cha1napp'
		},
		defaultFromAddress: 'Chain <chainappcontact@gmail.com>'
	},
	twitter: {
	   consumer_key:         'k9iTvm4ESTlZG87yZwaHhIcZm',
	   consumer_secret:      '3mCBx32It6HFhwQQfHQ3cykMDQgHHpxVAOCC7W912jAAaVzhLE',
	   access_token:         '3395509019-f9xa9Vh3sc4pUYgHXFimaG5WGOR6Fo8OuzGu5Cu',
	   access_token_secret:  'DclvenMnRtKNHJY2w1kGISjPj1VVagsgbMdZlSxoufaY9'
	},
	instagram: {
		client_id: 'c19252edc1e9436cba927839cbb7e4ae',
        client_secret: 'd10e115de1d045fb9575d918e106e3fb'
	},
	facebook: {
		appId: '1439505569702173',
		secret: 'd9f3b8aa33bb19c40645c8e10bbdc8c8'
	},
	mongo: {
		url_prod: 'mongodb://52.30.191.210:27017/chain',
		url_dev: 'mongodb://localhost:27017/chain'
	}
}
