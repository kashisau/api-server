# API Version 1.0
This is the initial API that is available over HTTPS, first published in July, 2015. Modules in this version of the API follow [JSON API](http://jsonapi.org/) conventions.

API methods are handled by independent modules that have been built on Node.js. This server will parse the `accepts` header of the HTTP request and vary the response accordingly. If you are seeing this page, it is likely that your browser is sending `text/html` as its first preference.

See the [API home](../) page for more information.

## Modules

These modules are currently available via the online API.

### [/1.0/contact/](contact/)
Contact form validation and submission.

### [/1.0/geo/](geo/)
Australian geographic data and services.

### [/1.0/publish](publish/)
Publishing API for the main website.
