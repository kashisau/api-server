var express = require('express');
var router = express.Router();

/**
 * GET to /contact/send
 * 
 * Explains the purpose of the /contact API handler.
 */
router.get('/*', function(req, res, next) {
  res.render('api/v1.0/contact');
})

module.exports = router;
