var expect = require('expect');
var superagent = require('superagent');

describe(
    'Authentication Tokens',
    function() {
        it('Granted upon POST'), function(){
            superagent
                .post('http://localhost:3000/v1/auth/tokens.json')
                .end(function(res) {
                    assert(res.status === 200);
                    done();
                }
            )
        }
    }
);