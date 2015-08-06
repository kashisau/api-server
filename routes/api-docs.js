/**
 * API Documentation renderer
 * 
 * Retrieves the documentation for a given API call. This is called by the
 * main api router once the request has been parsed.
 * 
 * This is an Express middleware that handles the final output if the apiTarget
 * has determined that docs are being requested.
 * 
 * Documentation is closely linked to the specific method being called (based
 * on the request URL).
 * 
 * @author Kashi Samaraweera <kashi@kashis.com.au>
 * @version 1.0.0
 */
    
var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var remarkable = require('remarkable');

/**
 * GET Informational content
 *
 * This method will examine the URL to find the correct API content, rendering
 * it into the correct template using Jade.
 */
router.get('/*', function(req, res, next) {
    var apiTarget = req.apiTarget,
        docFile;
    
    // See if the API target is requesting the documentation, if not: onwards!
    if ( ! apiTarget.fetchDoc) return next();

    docFile = getFirstFile(
        likelyDocFiles(req.apiTarget)
    );
    
    docFile.apiTarget = apiTarget;
    
    renderDoc(docFile, res);
});

/**
 * Renders the documentation file being requested. This method will take the
 * built-in response object from Express to manage the document render.
 * @param {Object} docFile  The 
 * @param res
 */
function renderDoc(docFile, res) {
    var mdRenderer = new remarkable('full');
    
    res.render(
        'api/v1/_doc-template/api-v1.jade',
        {
            mdRenderer : mdRenderer,
            mdContent : docFile.content,
            docData : {
                dates : docFile.dates,
                sources: docFile.sources,
                apiTarget: docFile.apiTarget,
                breadcrumbs: breadcrumbs(docFile.apiTarget)
            },
            prettyDateString : prettyDateString
        }
    );
}

function relParent(level) { return (level)? "*" + relParent(--level) : ""; }

/**
 * Arranges the request components to construct a path to the requested
 * document for use in breadcrumbs.
 * @param {*} apiTarget The API target information as arranged by the api
 *                      target middleware.
 * @returns {Array} Returns an array of nestable bread crumbs.
 */
function breadcrumbs(apiTarget) {
    var pathComponents = [ 
            { type: 'method', friendlyType: "Method" },
            { type: 'module', friendlyType: "Module" },
            { type: 'apiVersion', friendlyType: "API Version" }
        ],
        crumbs = [];

    for (var i = 0, total = pathComponents.length; i < total; i++) {
        if (apiTarget.hasOwnProperty(pathComponents[i].type)) {
            crumbs.unshift(
                {
                    type: pathComponents[i].type,
                    friendlyType: pathComponents[i].friendlyType,
                    name: apiTarget[pathComponents[i].type]
                }
            );
        }
    }
    
    return crumbs;
}

/**
 * Takes an apiTarget object and attempts to construct a series of file paths
 * for corresponding documentation. The file paths are supplied in order of
 * preference (likeliness and generality).
 * 
 * @param {Object} apiTarget    An apiTarget object as constructed by the API
 *                              target Express middleware.
 * @returns {string[]}  Returns an array of strings that contain likely file
 *                      paths for relevant documentation.
 */
function likelyDocFiles(apiTarget) {
    var pathComponents = ['method', 'module', 'apiVersion'],
        applicationPath = path.join(__dirname).split('/'),
        docPath = [],
        docFiles = [];

    applicationPath.pop();
    applicationPath.push('views');
    applicationPath.push('api');
    applicationPath.push('');
    
    for (var i = 0, total = pathComponents.length; i < total; i++) {
        if (apiTarget.hasOwnProperty(pathComponents[i])) {
            docPath.unshift(apiTarget[pathComponents[i]]);
        }
    }
    docFiles.push(applicationPath.join('/') + docPath.join('/') + '.md');
    docFiles.push(applicationPath.join('/') + docPath.join('/') + '/README.md');
    docFiles.push(applicationPath.join('/') + docPath.join('/') + '/README');
    
    return docFiles;
}

/**
 * Takes an array of file paths, checking for the existence of each one (in
 * supplied order) until a matching file is found on the filesystem. Once a 
 * matching file is established, both the contents and metatdata of the file
 * is returned.
 * @param {string[]} filePaths  An array of the file paths that should be
 *                              checked, in the order that they should be
 *                              checked.
 * @returns {Object[]}  Returns an object that contains both the content of the
 *                      first matched file and its metadata.
 */
function getFirstFile(filePaths) {
    var filePath = filePaths.shift(),
        fileStats,
        docDates;
    var REPO_URL = "https://bitbucket.org/KashmaNiaC/website-api/src/master";

    if (filePath === undefined)
        throw new Error('No file could be found that corresponds to the \
            method or module being used.');
    try {
        fileStats = fs.lstatSync(filePath);
        if (!fileStats.isFile())
            throw new Error("Documentation file issue.");

        docDates = {
            created: fileStats.ctime,
            modified: fileStats.mtime
        };
    } catch (fileError) { return getFirstFile(filePaths); }

    return {
        path: filePath, 
        content: fs.readFileSync(filePath, "utf8"),
        dates: docDates,
        sources: {
            api: REPO_URL + relativeViewPath(filePath),
            doc: REPO_URL + relativeViewPath(filePath)
        }
    };
}

/**
 * Takes an absolute path and reduces it to one that is relative to the Express
 * application path.
 * @param {string} fullPath The complete (or absolute) path in the filesystem.
 * @return {string} Returns a path that is relative to the Express application
 *                  directory.
 */
function relativeViewPath(fullPath) {
    var applicationPath = path.join(__dirname).split('/');
    
    applicationPath.pop();
//    applicationPath.push('views');
//    applicationPath.push('api');

    return fullPath.substr(applicationPath.join('/').length);
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