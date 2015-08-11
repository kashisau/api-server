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


router.use(
    function(req, res, next) {
        var jwtString = req.headers;
        next();
    }
);

module.exports = router;