'use strict';
/**
 * API Server testing
 * Authentication module: Integration testing
 * Tokens: Invalid credentials
 *
 * This test suite verifies the that the API server issues authentication
 * tokens correctly for the given credentials.
 *
 * @author Kashi Samaraweera <kashi@kashis.com.au>
 * @version 0.1.0
 */
var api = require('supertest')('http://localhost:3000/'),
    jwt = require('jsonwebtoken'),
    should = require('should'),
    // From api-modules-v1-auth/test/auth-model.js (documented there)
    rnd = function(s, len) {
        len = +s || +len || 25;
        s = isNaN(+s)? s || "" : "";
        return (s.length < len)?
            rnd(
                s + String.fromCharCode(
                    "a".charCodeAt(0) + ~~(Math.random() * 26)),
                len
            )
            : s
    };

// it("Raise an auth_token_missing error if there was no token supplied during lookup",
//     function (done) {
//         api
//             .get('v1/auth/tokens.json')
//             .set('Accept', 'application/json')
//             .set('Content-type', 'application/json')
//             .expect(400)
//             .end(function(err, res) {
//                 var result = res.body;
//                 should(result.errors[0].name).equal("auth_token_missing")
//                 done();
//             });
//     }
// );

it("Raise an api_key_malformed error when an API key is syntactically incorrect",
    function (done) {
        api
            .post('v1/auth/tokens.json')
            .set('Accept', 'application/json')
            .set('Content-type', 'application/json')
            .set('api-key', rnd(10))
            .expect(400)
            .end(function(err, res) {
                var result = res.body;
        
                should(result.errors[0].name).equal("api_key_malformed");
                done();
            });
    }
);

it("Raise an api_invald_key error when an API key is incorrect",
    function (done) {
        api
            .post('v1/auth/tokens.json')
            .set('Accept', 'application/json')
            .set('Content-type', 'application/json')
            .set('api-key', rnd(25))
            .expect(403)
            .end(function(err, res) {
                var result = res.body;
        
                should(result.errors[0].name).equal("api_key_invalid");
                done();
            });
    }
);