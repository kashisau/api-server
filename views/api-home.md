# API Home
This is the API home, which contains the major API versions for this web server. You may use the features of this API server (within limits).

## Accessing the API
API methods must be accessed directly via the correct URL. Each major version of the API may have various modules that perform different functions. Each module will also have documentation available by visiting the API location with a web browser.

You're seeing this page because it appears that you're visiting from a standard web browser. Technically, this is because the `accepts` header for this HTTP request is set to `text/html` as its first preference. This can be overriden by appending `.json` to the API call (before the query string). Eg. `https://api.kashis.com.au/v1/contact/send.json` instead of  `https://api.kashis.com.au/v1/contact/send`.

## API Versions

A list of versions for the API are available below. Please note that major versions will _not_ be compatible. Each API module observes the [JSON API](http://jsonapi.org/) specification.

* **[Version 1 (/v1)](/v1/)** (July 2015)

## Open source
The [source code for this web application](https://bitbucket.org/KashmaNiaC/website-api) is available on BitBucket under an MIT licence.