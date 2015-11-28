'use strict';
/**
 * API Server integration testing
 * Authentication module - Tokens methods
 * 
 * This suite checks the /v1/auth/tokens.json endpoint of the Authentication
 * microservice.
 * 
 * @author Kashi Samaraweera <kashi@kashis.com.au>
 * @version 0.0.0
 */
var should = require('should');

// Basic token issuance
describe("Token creation with various AccessLevels", function (done) {
    require('./tokens/creation.js');
});