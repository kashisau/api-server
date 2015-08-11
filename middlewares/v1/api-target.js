/**
 * API Target Express middleware
 * 
 * This module will parse the incoming request to determine the intended
 * destination of the client.
 * 
 * The API will generally tend towards document retrieval, displaying context-
 * tual information about the particular method or module being requested. If
 * the correct header or response format is specified then the API will respond
 * with pure (JSON-encoded) data.
 * 
 * This is an Express middleware that attributes an apiTarget object to the
 * request object so that subsequent middlewares may use this information.
 * 
 * @author Kashi Samaraweera <kashi@kashis.com.au>
 * @version 1.0.0
 */
    
var express = require('express');
var router = express.Router();

/**
 * Processing the API request.
 * 
 * This method adds the apiTarget object to the request parameter, sending it
 * to onwards to the next router.
 */
router.use(function(req, res, next) {
    var apiTarget = getApiTarget(req);
    apiTarget.fetchDoc = ! apiTarget.hasOwnProperty('responseFormat');
    
    req.apiTarget = apiTarget;
    next();
});

/**
 * Takes the request from Express and constructs an object that holds data
 * about the hierarchy leading to the requested feature. The resulting object
 * can be used to derive all available details of the request from the API
 * version number to the module, method and optional parameters such as a
 * supplied identifier and querystring arguments.
 * @param {*} req   The Express request object.
 * @return {*}  Returns a JSON object that describes the request based on the
 *              URL of the request.
 */
function getApiTarget(req) {
    var url = req.originalUrl,
        urlPieces = url.split('/'),
        urlPieceNo = urlPieces.length,
        urlPiece,
        componentNames = ['apiVersion', 'module', 'method', 'identifier'],
        componentName,
        component,
        apiTargetObj = {};

    while (urlPieceNo--) {
        urlPiece = urlPieces[urlPieceNo];

        // Appended querystring
        if (urlPiece.indexOf('?') > 0)
            urlPieces[urlPieceNo] = urlPiece.split('?')[0];

        // Empty string or just a querystring
        if (urlPiece.length === 0)
            urlPieces.splice(urlPieceNo, 1);
    }

    // Gather as much information as possible
    while (component = urlPieces.shift()) {
        componentName = componentNames.shift();
        apiTargetObj[componentName] = component;
    }

    // Remove query-string parameters from the identifier (if set)
    if (apiTargetObj.hasOwnProperty('identifier'))
        apiTargetObj['identifier'] = apiTargetObj['identifier'].split('?')[0];

    apiTargetObj = methodResponse(apiTargetObj);
    apiTargetObj = bestResponse(apiTargetObj, req);

    apiTargetObj.attributes = queryStringParameters(req.query);

    return apiTargetObj;
}

/**
 * Looks at the request in order to determine the type of response (if the user
 * has requested one explicitly defining the HTTP `accepts`). This will
 * not overwrite existing requestFormat data.
 * @param {*} apiTargetObj  The API target object that has been parsed into its
 *                          basic parts.
 * @params {*} req  The request object as supplied by Express.js.
 * @returns {*} Returns an apiTargetObject which contains header information 
 */
function bestResponse(apiTargetObj, req) {
    if (apiTargetObj.hasOwnProperty('responseFormat'))
        return apiTargetObj;

    switch (req.accepts(['json', 'html', 'xml'])) {
        case 'json':
            apiTargetObj.responseFormat = 'json';
            break;
        case 'xml':
            apiTargetObj.responseFormat = 'xml';
            break;
        case 'html':
            break;
    }

    return apiTargetObj;
}

/**
 * Takes the querystring appended to a URL and processes it for attribute key-
 * value pairs. This will return an JSON object with the number of properties
 * equal to the number of query string parameters supplied (and bearing the
 * exact key names in a case-sensitive manner).
 * @param {*} queryObject   The query object as processed by Express and
 *                          supplied by the request object.
 * @return {*}  Returns a JSON object describing each key-value pair in the
 *              query string.
 */
function queryStringParameters(queryObject) {
    var key,
        value,
        listIndex;

    for (var key in queryObject) {
        var value = queryObject[key],
            listIndex = value.indexOf(',');

        if (value.length === 0) {
            delete queryObject[key];
            continue;
        }

        if ( ! listIndex)
            continue;

        queryObject[key] = value.split(",");
    }

    return queryObject;
}

/**
 * Takes an API target object (where the method has been extracted) and breaks
 * the method property into parts method and response format. If the method is
 * not defined then the original API method object is returned unchanged.
 * @param {*} apiTargetObj  The API target object with a method name already
 *                          processed.
 * @returns {*} Returns an API target object with the method attribute broken
 *              down into the method name and the expected response format. If
 *              a response format is not set then a default response format is
 *              used instead.
 */
function methodResponse(apiTargetObj) {
    var methodComponents;

    if (apiTargetObj.method === undefined
        || apiTargetObj.method.indexOf('.') < 0) {
        return apiTargetObj;
    }

    methodComponents = apiTargetObj.method.split('.');

    // Remove empty components.
    methodComponents.filter(function(e) { return e; });

    apiTargetObj.method = methodComponents[0];
    apiTargetObj.responseFormat = methodComponents[1];

    return apiTargetObj;
}

module.exports = router;