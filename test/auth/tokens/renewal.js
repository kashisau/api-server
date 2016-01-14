'use strict';
/**
 * API Server testing
 * Authentication module: Integration testing
 * Tokens: Token renewal
 *
 * This test suite verifies the that the API server correctly issues temporal
 * auth tokens for a given renewal token.
 *
 * @author Kashi Samaraweera <kashi@kashis.com.au>
 * @version 0.1.0
 */
var api = require('supertest')('http://localhost:3000/'),
    jwt = require('jsonwebtoken'),
    should = require('should');

it("Renewal tokens produce corresponding auth tokens", function (done) {
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

            setTimeout(getNewToken, 100);

            function getNewToken() {
                api
                    .put('v1/auth/tokens.json')
                    .set('Accept', 'application/json')
                    .set('Authorization', 'Bearer ' + renewToken)
                    .expect(200)
                    .end(assessNewToken);
            }

            function assessNewToken(err, res) {
                should(err).not.exist;
                var newAuthToken = res.body.data.auth,
                    newAuthPayload;
                
                should(newAuthToken).be.a.string;
                
                should(function() {
                    newAuthPayload = jwt.decode(newAuthToken);
                }).not.throw();

                newAuthPayload.type.should.equal("auth");
                newAuthPayload.renewJti.should.equal(renewPayload.jti);
                newAuthPayload.exp.should.be.greaterThan(
                    authPayload.exp
                );
                
                done()
            }
       });
});