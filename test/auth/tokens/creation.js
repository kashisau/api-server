'use strict';
/**
 * API Server testing
 * Authentication module: Integration testing
 * Tokens: Token creation
 *
 * This test suite verifies the that the API server issues authentication
 * tokens correctly for the given credentials.
 *
 * @author Kashi Samaraweera <kashi@kashis.com.au>
 * @version 0.1.0
 */
var api = require('supertest')('http://localhost:3000/'),
    jwt = require('jsonwebtoken'),
    should = require('should');

it("Create a JWT token with AccessLevel 0 (anonymous)", function (done) {
   api
       .post('v1/auth/tokens.json')
       .set('Accept', 'application/json')
       .set('Content-type', 'application/json')
       .expect(200)
       .end(function(err, res) {
           var result = res.body,
               token,
               payload;

           result.data.should.be.an.object;
           result.data.token.should.be.a.string;
           
           token = result.data.token;
           should.doesNotThrow(function() {
               payload = jwt.decode(token);
           });
           
           payload.accessLevel.should.equal(0);

           done();
       });
});

it("Create a JWT token with AccessLevel 1 (API key)", function (done) {
   api
       .post('v1/auth/tokens.json')
       .set('Accept', 'application/json')
       .set('Content-type', 'application/json')
       .set('api-key', process.env.TESTING_API_KEY)
       .expect(200)
       .end(function(err, res) {
           var result = res.body,
               token,
               payload;

           result.data.should.be.an.object;
           result.data.token.should.be.a.string;
           
           token = result.data.token;
           should.doesNotThrow(function() {
               payload = jwt.decode(token);
           });
           
           payload.accessLevel.should.equal(1);

           done();
       });
});

it("Create a JWT token with AccessLevel 2 (API key & corresponding secret key)", function (done) {
   api
       .post('v1/auth/tokens.json')
       .set('Accept', 'application/json')
       .set('Content-type', 'application/json')
       .set('api-key', process.env.TESTING_API_KEY)
       .set('api-key-secret', process.env.TESTING_API_KEY_SECRET)
       .expect(200)
       .end(function(err, res) {
           var result = res.body,
               token,
               payload;

           result.data.should.be.an.object;
           result.data.token.should.be.a.string;
           
           token = result.data.token;
           should.doesNotThrow(function() {
               payload = jwt.decode(token);
           });
           
           payload.accessLevel.should.equal(2);

           done();
       });
});