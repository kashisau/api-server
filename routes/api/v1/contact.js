var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

/**
 * POST to /contact/send
 * 
 * Handles the contact form submission and sends an email if all the fields are
 * found to have valid data.
 */
router.post('send', function(req, res, next) {
  var app = req.app,
      emailAddress = require('email-address'),
      user = {
        name: req.body.name,
        email: req.body.email,
        message: req.body.message
      };

  res.json(user);
  //res.render('index', { title: 'Express' });
});

/**
 * GET to /contact/send
 * 
 * Explains the purpose of the /contact API handler.
 */
router.get('/*', function(req, res, next) {
  res.render('api/v1.0/contact');
})

module.exports = router;
