var express = require('express');
var router = express.Router();

/**
 * POST to tokens
 */
router
    .post(/tokens(\.xml|\.json)?/i, function(req, res, next) {
        var apiTarget = req.apiTarget;
        res.send("Your new authentication token in " + apiTarget.responseFormat + " form.");
    })
    .get('/tokens(.xml|.json)?/:token?', function(req, res, next) {
        if (req.params.token !== undefined)
            res.send("Information specifically relating to your token: " + req.params.token);
        else
            res.send("List of tokens.");
    })
    .delete('/tokens(.xml|.json)?/:token', function(req, res, next) {
        res.send("Invalidating YOUR TOKEN");
    });


module.exports = router;