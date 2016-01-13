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

it("Create a token pair with AccessLevel 0 (anonymous)", function (done) {
   api
       .post('v1/auth/tokens.json')
       .set('Accept', 'application/json')
       .set('Content-type', 'application/json')
       .expect(200)
       .end(function(err, res) {
           var result = res.body,
               renewToken,
               authToken,
               renewPayload,
               authPayload;

           result.data.should.be.an.object;
           
           result.data.renew.should.be.a.string;
           result.data.auth.should.be.a.string;

           renewToken = result.data.renew;
           should.doesNotThrow(function() {
               renewPayload = jwt.decode(renewToken);
           });

           renewPayload.accessLevel.should.equal(0);
           renewPayload.type.should.equal("renew");

           authToken = result.data.auth;
           should.doesNotThrow(function() {
               authPayload = jwt.decode(authToken);
           });

           authPayload.accessLevel.should.equal(0);
           authPayload.type.should.equal("auth");
           
           authPayload.renewJti.should.equal(renewPayload.jti);

           done();
       });
});

it("Create a token pair with AccessLevel 1 (API key)", function (done) {
    api
       .post('v1/auth/tokens.json')
       .set('Accept', 'application/json')
       .set('Content-type', 'application/json')
       .set('api-key', process.env.TESTING_API_KEY)
       .expect(200)
       .end(function(err, res) {
           var result = res.body,
               renewToken,
               authToken,
               renewPayload,
               authPayload;

           result.data.should.be.an.object;
           
           result.data.renew.should.be.a.string;
           result.data.auth.should.be.a.string;

           renewToken = result.data.renew;
           should.doesNotThrow(function() {
               renewPayload = jwt.decode(renewToken);
           });

           renewPayload.accessLevel.should.equal(1);
           renewPayload.type.should.equal("renew");

           authToken = result.data.auth;
           should.doesNotThrow(function() {
               authPayload = jwt.decode(authToken);
           });

           authPayload.accessLevel.should.equal(1);
           authPayload.type.should.equal("auth");
           
           authPayload.renewJti.should.equal(renewPayload.jti);

           done();
       });
});

it("Create a token pair with AccessLevel 2 (API key & corresponding secret key)", function (done) {
    api
        .post('v1/auth/tokens.json')
        .set('Accept', 'application/json')
        .set('Content-type', 'application/json')
        .set('api-key', process.env.TESTING_API_KEY)
        .set('api-key-secret', process.env.TESTING_API_KEY_SECRET)
        .expect(200)
        .end(function(err, res) {
            var result = res.body,
                renewToken,
                authToken,
                renewPayload,
                authPayload;

           result.data.should.be.an.object;

           result.data.renew.should.be.a.string;
           result.data.auth.should.be.a.string;

           renewToken = result.data.renew;
           should.doesNotThrow(function() {
               renewPayload = jwt.decode(renewToken);
           });

           renewPayload.accessLevel.should.equal(2);
           renewPayload.type.should.equal("renew");

           authToken = result.data.auth;
           should.doesNotThrow(function() {
               authPayload = jwt.decode(authToken);
           });

           authPayload.accessLevel.should.equal(2);
           authPayload.type.should.equal("auth");
           
           authPayload.renewJti.should.equal(renewPayload.jti);

           done();
        });
});