var express = require('express');
var router = express.Router();
var contactModel = require('../../../../models/contact.js');
/**
 * Contact module routing: Validation
 * 
 * An Express router that handles requests to the contact module, specifically
 * the data validation for contact form submission.
 */
router
    .post('(.xml|.json)?', function(req, res, next) {
        var submissionInformation = req.body,
            validationTests = contactModel.validateInput(submissionInformation);

        res.json({
            data: validationTests
        });
    });

module.exports = router;