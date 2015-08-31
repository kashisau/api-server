var assert = require('assert');
var superagent = require('superagent');

describe('API Index',
    function() {
        it('Homepage returns 200', function() {
            superagent
                .get('http://localhost:3000')
                .end(function(res) {
                    assert(res.status === 200);
                });
        });
    }
);