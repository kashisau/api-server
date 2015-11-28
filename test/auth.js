'use strict';
/**
 * Authentication module integration tests
 * 
 * This is the top-level test suite organisation file for the API server's
 * response to Authentication processes.
 * 
 * Test suites are located in the `auth/` directory, organised into each suite.
 * 
 * @author Kashi Samaraweera <kashi@kashis.com.au>
 * @version 0.0.0
 */
var supertest = require('supertest'),
    api = supertest('http://localhost:3000');

describe(
    "Environment variables set for testing",
    function() {
        it(
            "TESTING_API_KEY environment variable set",
            function(done) {
                process.env.TESTING_API_KEY.should.be.a.string;
                done();
            }
        );
        it(
            "TESTING_API_KEY_SECRET environment variable set",
            function(done) {
                process.env.TESTING_API_KEY_SECRET.should.be.a.string;
                done();
            }
        );
    }
);
describe(
    "Tokens methods",
    function() {
        require('./auth/tokens.js');
    }
);