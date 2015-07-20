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
        docUrl = url.substr(url.indexOf('/1.0/') + 5).split('/'),
        docFilePath,
        docType = "method";

    if (docUrl.length === 0) {
        var err = new Error("No api documentation found for the specified method (" + url + ")");
        return next(err);
    }
    
    try {
        docFilePath = docMarkdown(docUrl);
    } catch (fileError) {
        return next(fileError);
    }
    
    fs.readFile(docFilePath, 'utf8', function(err, markdown) {
        var marked = require('marked');
        
        if (err)
            return next(err);
        
        res.type('html');

        if (docUrl.length === 1)
            docType = "class";

        res.render('api/1.0/_doc-template/' + docType, { marked : marked, content : markdown });
        
        //res.send(markdown);
    });
    
});

function docMarkdown(apiDocPath) {
    var docFilePath = apiDocPath.join('/') + '.md',
        routesPath = path.join(__dirname).split('/'),
        apiDocFile,
        fileStat;
    
    // Remove the routes directory.
    routesPath.pop();
    routesPath.push('views', 'api', '1.0');
    
    apiDocFile = routesPath.join('/') + "/" + docFilePath;
    try {
        fileStat = fs.lstatSync(apiDocFile);
        if (!fileStat.isFile())
            throw new Error("Documentation file issue.");
    } catch (fileError) {
        throw new Error("Documentation file not found.", fileError);
    }
    
    return apiDocFile;
}
module.exports = router;