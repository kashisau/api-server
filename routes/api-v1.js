var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

/**
 * GET Informational content
 * 
 * This method will examine the URL to find the correct API content, rendering
 * it into the correct template using Jade.
 */
router.get('/*', function(req, res, next) {
    var url = req.originalUrl.replace(/\/+$/gi, ""),
        docUrl = url.substr(url.indexOf('/v1/') + 4).split('/'),
        docFile,
        docType = "method",
        apiTarget;
    
    if (docUrl.length === 0) {
        var err = new Error(
            "No api documentation found for the specified method (" +
            url + ")");
        return next(err);
    }
    
    try {
        apiTarget = getApiTarget(req);
        docFile = apiDocFile(docUrl);
    } catch (fileError) {
        return next(fileError);
    }
    
    fs.readFile(docFile.filePathAbs, 'utf8', function(err, markdown) {
        var remarkable = require('remarkable'),
            mdRenderer;
        
        if (err)
            return next(err);
        
        res.type('html');

        if (docUrl.length === 1)
            docType = "module";

        mdRenderer = new remarkable('full');
        
        res.render(
            'api/v1/_doc-template/' + docType,
            {
                mdRenderer : mdRenderer,
                mdContent : markdown,
                docData : {
                    dates : docFile.dates,
                    sources: docFile.sources
                },
                prettyDateString : prettyDateString
            }
        );
    });
    
});

/**
 * Takes the request from Express and constructs an object that holds data
 * about the hierarchy leading to the requested feature. The resulting object
 * can be used to derive all available details of the request from the API
 * version number to the module, method and optional parameters such as a 
 * supplied identifier and querystring arguments.
 * @param {string} url  The complete URL that the client is requesting.
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
    
    //// Remove empty strings & query strings
    //urlPieces = urlPieces.filter(function (e) {
    //    if (e[0] === '?') return "";
    //    if (e.indexOf('?') > 0) return e.split('?')[0]
    //    return e;
    //});
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

    apiTargetObj.attributes = breakdownQueryString(req.query);
    
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
function breakdownQueryString(queryObject) {
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
 * Converts an API url to a likely path to the corresponding API documentation.
 * This method will check to see if a markdown file exists that corresponds to
 * the API path. If no API path is found, it will look for a README.md file to
 * load instead. If no matching files are found then an error is thrown.
 * 
 * An object that contains the full path and file creation & modification dates
 * is returned upon success.
 * 
 * @param apiDocPath    The URL (relative to the API version) from which to
 *                      find the corresponding API documentation.
 * @returns {Object}    Returns the content of the markdown file corresponding
 *                      to the API class or method call.
 * @throws {Error}  Thrown if there was no markdown file available in the given
 *                  path (nor a generic fall-back README.md).
 */
function apiDocFile(apiDocPath) {
    var docFilePathRel = apiDocPath.join('/') + '.md',
        docFilePathAbs,
        docPathRel = path.join(__dirname).split('/'),
        fileStats,
        docDates;
    
    // Remove the routes directory.
    docPathRel.pop();
    // Add the views directory for this version of the API
    docPathRel.push('views', 'api', 'v1');
    
    // If we're at the very root of the API, find a README file.
    if (apiDocPath[0].length === 0)
        docFilePathRel = 'README.md';

    docFilePathAbs = docPathRel.join('/') + "/" + docFilePathRel;
    try {
        fileStats = fs.lstatSync(docFilePathAbs);
        if (!fileStats.isFile())
            throw new Error("Documentation file issue.");
        docDates = {
            created: fileStats.ctime,
            modified: fileStats.mtime
        };
    } catch (fileError) {
        throw new Error(
            "Documentation file not found (looking for " +
                docFilePathAbs + ").", fileError);
    }
    
    return {
        filePathAbs: docFilePathAbs,
        dates: docDates,
        sources: {
            api: 'javascript:void(0);',
            doc: 'javascript:void(0);'
        }
    };
}

/**
 * Takes a Date object and returns a string with a human-readable date.
 * @param {Date} date   The date which we're converting to a string.
 * @return {string} The outputted string.
 */
function prettyDateString(date) {
    var meridian = (date.getHours() / 12 < 1) ? "am" : "pm",
        leadingZeroRegEx = /^([0-9]{1})$/g,
        leadingZero = function(number) {
            return number.toString().replace(leadingZeroRegEx, '0$1');
        };
    return [
            (date.getHours() - 1) % 12 + 1,
            leadingZero(date.getMinutes())
        ].join(":") +
            meridian +
            " " + 
        [
            leadingZero(date.getDate() + 1),
            leadingZero(date.getMonth() + 1),
            date.getFullYear()
        ].join("/");
}
module.exports = router;