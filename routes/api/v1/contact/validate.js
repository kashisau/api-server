var express = require('express');
var router = express.Router();
var authModel = require('../../../../models/auth.js');
/**
 * Contact module routing: Validation
 * 
 * An Express router that handles requests to the contact module, specifically
 * the data validation for contact form submission.
 */
router
    .post('(.xml|.json)?', function(req, res, next) {
        res.send("Okay.");
    });

module.exports = router;