# API Version v1
This version of the API follows the JSON-API standard described on [jsonapi.org](http://jsonapi.org). For information about module development, see [Module Development](#module-development) below.

## List of Modules

### [Auth](auth/)
Supplies authorisation tokens for the various modules that are available on this server.

### [Contact](contact/)
Handles contact form data validation and submission

### [Portfolio](portfolio/)
Provides access to portfolio content for Kashi's Website.

### [Publish](publish/)
Publishing API for the main website.

## Authorisation

A common method of authentication is used throughout the API server's endpoints. These are facilitated by the [Authentication module](auth/).

### Authentication Tokens

Authentication for API endpoints is done by means of JWT token strings, as supplied by the [Authentication module](auth/) when requested from the [`auth/tokens`](auth/tokens) endpoint using `HTTP 1.1 POST`. Once a consuming API client receives an valid JWT token string, it should be supplied to each subsequent request using a header `authentication-token: #####`.

## Errors

Errors issued by the API server share a common syntax. API server modules follow [JSONAPI.org](https://jsonapi.org) convention, requests that are met with errors are resolved to JSON objects with the following structure:

``` json
{
    "errors": [
        {
            "name" : "some_error_name",
            "description" : "A more detailed description of the error.",
            "module" : /*[the codename of the module issuing the error. e.g.]*/ "auth"
        }
    ]
}
```

### General Errors

Each error has a _name_, specifying the exact error encountered which may be used to reference the documentation. Errors will typically be formed using the following combination:

```
<API module>_<Error>_<Summary>
```
This ensures that the source of the error is immediately identifiable.

See also: [Authentication Module Errors](auth/errors)

## Module Development

API server modules all follow a similar pattern for organising their routes, models, views, documentation, etc. Modules are inherintly Express.js modules, however they are stored in a folder `./api-modules/<module_name>` so that they can be easily distingued for version control.

There is a [module template on GitHub](https://github.org/kashisau/website-api-module-template) which has more information on the structure of an API module.