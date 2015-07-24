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
        docType = "method";

    if (docUrl.length === 0) {
        var err = new Error(
            "No api documentation found for the specified method (" +
            url + ")");
        return next(err);
    }
    
    try {
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