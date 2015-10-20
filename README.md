# Website API
This repository is for Kashi's Website API, an Express server that runs on Node.js, facilitating module-based microservices.

The idea behind this project is to separate the front-end and back-end features that are implemented in any of Kashi's personal website. Each microservice is a _module_ of the Website API.

## Website API modules

Each module of the Website API are treated as separate projects, each version controlled (typically on BitBucket). Modules are responsible for a single homogenous set of concerns for the web application.

The idea behind this architecture is to make feature development simple to implement, with independence between modules during development. The "built-in" modules include the [Authentication module](https://bitbucket.org/KashiS/website-api-api-modules-v1-auth) and a currently work-in-progress [Contact module](https://bitbucket.org/KashiS/website-api-api-modules-v1-contact), which implements features of the Authentication module.

Module repositories arrange the Express route handlers, views (i.e., public-facing API documentation) and business logic (models) along with any ancilliary files.

```
+-- api-modules
    +-- v1 # Each API module is stored in a subdirectory here (separate repos)
    	+-- auth # Auth API module (bitbucket.org/KashiS)
        	+-- ...
        +-- contact # Cotact API module (bitbucket.org/KashiS)
        	+-- ...
        +-- ...
+-- bin
	+-- www # Express.js application file
+-- middlewares
	+-- v1
    	+-- api-target.js # Deconstructs the HTTP request for the next route 
                          # handler. This middleware will also assess the
                          # validity of the RESTful request, falling-back to
                          # displaying contextual API documentation for the
                          # specific module/method being requested.
+-- public
	+-- stylesheets
    	+-- ... # CSS (SASS) for the API documentation presented by the app
+-- routes
	+-- api-docs.js # Responsible for finding and presenting contextual
    				# documentation if the app doesn't recognise a valid
                    # RESTful request
    +-- index.js # Displays the introductory documentation for the API when in
    			 # operation
+-- tests
	+-- ... # To be implemented, mocha test suites for the API features
+-- views
	... # Templates and documentation for the API features
+-- app.js # Loads API modules and binds route handlers
```

## Development roadmap

testing is the next major implementation for this project, using mocha for unit-testing and eventually a full suite of HTTP testing for the API route handling.