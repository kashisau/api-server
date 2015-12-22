# API Server Home
This domain name hosts Kashi's API server, an [Express.js](https://express.io) server that is designed to host customised _modules_, where each module handles one concern.

Each module is developed independently however use a common structure and and tap into some common functionality offered by the API server. Built-in modules include the Authentication module (`Auth` module) and Contact / messaging module (`Contact` module).

## Accessing the API

| Version        | Description                                                                        | URL                       |
|----------------|------------------------------------------------------------------------------------|---------------------------|
| **Production** | The live version of the API server bearing the release version of each API module. | https://api.kashis.com.au |

API methods are exposed by each module and documented in detail on actual API endpoints when viewed through a browser. Technically, this is achieved by searching for an `Accepts` header issued by a browser (i.e., `Accepts: text/html, text/css, ...`).

The API server will not respond with documentation if the URL endpoint is suffixed with a `.json` extension.

As the API server is used for development and production, there may be features that are not yet available on the production server. Individual modules all use git tagging to signify a release version and subsequently the documentation available at REST endpoints will correspond to the version that is live.

## API Versions

A list of versions for the API are available below. Please note that major versions will _not_ be compatible. Each API module observes the [JSON API](http://jsonapi.org/) specification.

* **[Version 1 (/v1)](/v1/)** (July 2015 - _present_)

## Open source
The [source code for this web application](https://github.com/kashisau/api-server) is available on GitHub under an MIT licence.