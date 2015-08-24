/**
 * Auth request v1 Express Middleware
 * 
 * This middleware parses request information to provide latter middlewares and
 * routers in the Express chain with details of the request authentication
 * supplied.
 * 
 * If no authentication data is supplied then this middleware simply passes on
 * to the next handler without error. If there is an error in the supplied
 * request's authorisation data (or practices) then an error is raised.
 * 
 * @author Kashi Samarawaeera <kashi@kashis.com.au>
 * @version 1.0.0
 */

var express = require('express');
var router = express.Router();
var authModel = require('../../../models/auth.js');

router.use(
    function(req, res, next) {
        var authToken = req.get('authentication-token'),
            authError = new Error();

        // Check for JWT
        if (typeof(authToken) === "undefined") {
            authError.message = "There was no authentication token provided " +
                "with this request.";
            authError.name = "no_authentication_token";
            
            return next(authError);
        }
        
        // Validate JWT
        try {
            authModel.validateToken(authToken);
        } catch (jwtError) {
            //return next(jwtError);
        }
        
        next();
    }
);

module.exports = router;