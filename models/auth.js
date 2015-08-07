var crypto = require('crypto');
var mysql = require('mysql');
var jwt = require('jsonwebtoken');
var tokenEncodeKey = "<some key that will later be dynamic>";

var DEFAULT_EXPIRY = 7200;

var authModel = {};
/**
 * Creates a new JavaScript Web token (JWT) and stores its initialisation data
 * in the token table within the database. This method takes optional API key
 * and corresponding secret information in order to generate a JWT with higher
 * accessLevels. Absent of these
 * @param {string} apiKey   (Optional) API key to which the authentication
 *                          token should be associated. Supplying this without
 *                          the apiSecretKey will result in a token with
 *                          accessLevel 1.
 * @param {string} apiKeySecret (Optional) API key corresponding secret. If
 *                              supplied with the apiKey an authentication
 *                              token of accessLevel 2 will be issued.
 * @param {Date} expiry (Optional) server time at which the authentication
 *                      token will be invalidated.
 * @param {function} callback   A callback function that accepts the standard
 *                              params err, result.
 */
authModel.createToken = function(apiKey, apiKeySecret, expiry, callback) {
    var accessLevel = 0,
        expiry = expiry || DEFAULT_EXPIRY;

    if (apiKey !== undefined)
        authModel.validateApiKey(
            apiKey, apiKeySecret,
            function(err, result) {
                if (err) return callback(err);
                accessLevel = result.accessLevel;
            }
        );
    
    var jwtString = jwt.sign(
        {
            accessLevel: accessLevel,
            apiKey: apiKey
        },
        tokenEncodeKey
    );
    
    callback(undefined, jwtString);
};

/**
 * Checks that the supplied key 
 * @param {string} apiKey   (Optional) API key to which the authentication
 *                          token should be associated. Supplying this without
 *                          the apiSecretKey will result in a token with
 *                          accessLevel 1.
 * @param {string} apiKeySecret (Optional) API key corresponding secret. If
 *                              supplied with the apiKey an authentication
 *                              token of accessLevel 2 will be issued.
 * @param {function} callback   A callback function that accepts the standard
 *                              params err, result.
 */
authModel.validateApiKey = function(apiKey, apiKeySecret, callback) {
    var conn = mysql.createConnection(
        require('../auth/modules/auth/config.json').database
    );
    conn.connect();
    conn.query(
        [
            'SELECT api_key.key, secret',
            'FROM api_key',
            'WHERE api_key.key = ?',
            'AND status = "ACTIVE"'
        ].join(" "),
        [apiKey, apiKeySecret],
        function(err, rows, fields) {
            if (err) return callback(err);
            if (rows.length === 0) {
                var noResultsError = new Error("There were zero rows" +
                    " matching the given API key and secret.");
                
                return callback(noResultsError);
            }
            // Determine the access level.
            var keyData = rows.shift(),
                accessLevel = 1;
            
            if (apiKeySecret !== undefined
                && keyData.secret === apiKeySecret)
                accessLevel = 2;

            return callback(undefined, { accessLevel: accessLevel });
        }
    );
};
module.exports = authModel;