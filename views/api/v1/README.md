# API Version v1
This is the initial API that is available over HTTPS, first published in July, 2015. Modules in this version of the API follow [JSON API](http://jsonapi.org/) conventions.

API methods are handled by independent modules that have been built on Node.js. This server will parse the `accepts` header of the HTTP request and vary the response accordingly. If you are seeing this page, it is likely that your browser is sending `text/html` as its first preference.

See the [API home](../) page for more information.

## Modules

These modules are currently available via the online API.

### [Auth](auth/)
Supplies authorisation tokens for the various modules that are available on this server.

### [Contact](contact/)
Handles contact form data validation and submission

### [Geo](geo/)
Australian geographic data and services.

### [Publish](publish/)
Publishing API for the main website.

## Authorisation

Modules apply a level of availability that apply to the 