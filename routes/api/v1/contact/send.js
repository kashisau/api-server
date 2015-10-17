var express = require('express');
var router = express.Router();
var contactModel = require('../../../../models/contact.js');
/**
 * Contact module routing: Send
 * 
 * An Express router that handles sending emails to the main recipient (admin).
 * This method uses the contact model to assess the validity of the data being
 * submitted.
 */
router
    .post('(.xml|.json)?', function(req, res, next) {
        var submissionInformation = req.body,
            validationTests = contactModel.validateInput(submissionInformation),
            testsPassed = contactModel.addTestResults(validationTests);

        if ( ! testsPassed) {
            res.status(400);
            res.json({
                errors: {
                    id: 'validation',
                    status: 400,
                    code: 'validation_failed',
                    title: 'Validation failed',
                    links: {
                        about: '/v1/contact/send'
                    },
                    meta: validationTests
                }
            });
            res.end();
            return;
        }

        res.json({
            data: {
                sent: true,
                serverTime: Date.now(),
                recipientName: submissionInformation.name,
                replyTo: submissionInformation.email
            }
        });
        res.end();
        return;
    });

module.exports = router;