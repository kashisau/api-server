var express = require('express');
var router = express.Router();
var mysql = require('mysql');

/**
 * POST to tokens
 */
router
    .post('/tokens(.xml|.json)?', function(req, res, next) {
        var apiTarget = req.apiTarget,
            dbConfig = require('../../../auth/modules/auth/config.json').database;
        //res.json(dbConfig);
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

/**
 * Establishes a connection to the database, returning the connection object
 * ready for query running.
 * @param {string} authFile The file with authentication credentials for the
 *                          MySQL database being used.
 * @returns {*} Returns a MySQL connection object that may be used to run
 *              queries against.
 */
function connect_mysql(authFile) {
    var authFileContents,
        connection;

    //mysql.createConnection();

    return {};
}


module.exports = router;