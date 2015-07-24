# Tokens methods
## Auth module

The Tokens method handles the issuing, validation and revocation of authentication tokens that are used by the API server. The API server will track all authentication tokens that have been issued and keep a record of activity for each one.

## Methods

### `POST` tokens [AccessLevel 0]

Used to request a new authentication token got use with API modules. Authentication tokens vary in [access level](../../#Authorisation) depending on the data provided during creation.

#### Required attributes

There are no mandatory attributes required to create an authentication token of access level 1. If no post information is supplied, then a new token of access level 1 will be provided.

| Property | Value | Description |
|----------|-------|-------------|
| (none)   | -     | -           |

#### Optional attributes

There are three access levels that an authentication token may posses. The following set of attributes must be supplied for access level 2.

| Attribute | Values             | Description                                                                                                                              |
| --------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| apiKey   | XXXX-XXXX-XXXX-XXXX | The API key that has been issued to identify an individual account  holder. This is merely used to identify the user of the api service. |

The highest access level is for authenticated consumers, who must supply both an API key and the correseponding secret key. This will generate an authentication token with access level 3.

| Attribute | Values                          | Description                                                                                                                              |
| --------- | -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| apiKey    | XXXX-XXXX-XXXX-XXXX              | The API key that has been issued to identify an individual account  holder. This is merely used to identify the user of the api service. |
| secretKey | ae2b 1fca 5159 49e5 d54f b22b 8ed9 5575 | The secret key that corresponds to the supplied APIKey                                                                                   |

#### Expected response

The command will respond with a JWT character string of up to 200 characters. This character string must be included in the head of API calls that have an access level of 1 or more.

A JSON API compatible response will contain the authentication token.

``` json
{
  "data": {
    "authenticationToken" : "aaaaa.bbbbb.ccccc",
    "expirySeconds" : 7200
  }
}
```

#### Method-specific errors

Note: Please see the [standard errors](../errors) section for details of generic API errors.

* `api_key_invalid` - The supplied `APIKey` attribute was not recognised as a valid API key.
* `api_key_malformed` - The supplied `APIKey` attribute was not in the correct format (i.e., it does not contain the correct number of characters).
* `secret_key_invalid` - The supplied `SecretKey` does not correspond to the `APIKey` attribute
* `secret_key_malformed` - The supplied `SecretKey` does not correspond to the `APIKey` attribute

### `GET` tokens [AccessLevel 3]
Retrieves a list of authentication tokens that have been issued by the system. Please note that **whole tokens will not be retrieved**.

#### Required attributes

| Attribute           | Values        | Description                                  |
| ------------------- | -------------- | -------------------------------------------- |
| authenticationToken | `<authentication token>` | A valid authentication token with access level 3. |

#### Optional attributes

| Attribute | Value(s)                                      | Default | Description                                                                                                                                 |
| --------- | --------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| count     | 1-1000                                        | 100     | Determines the number of tokens that will be returned.                                                                                      |
| offset    | ℤ                                             | 0       | The offset (beginning 0) from which to begin the set of results.                                                                            |
| sortType  | `issue`&#124;`expiry`&#124;`accessLevel`&#124;`apiKey` | `issue` | Results are ordered by these attributes before applying the (optional) count and offset to the set.                                         |
| sortOrder | `asc`&#124;`desc`                                | `desc`  | Results will be sorted in ascending or descending order based on this attribute before applying the (optional) count and offset to the set. |

#### Expected response

A list of tokens in use by the API server, both valid and invalid will be returned. They will adhere to the following structure:

```
{
  "data": {
    "authenticationTokens : [
      {
        "authenticationToken" : "aa***.*****.****cc",
        "apiKey" : "abcd***********f",
        "secretKey" : null,
        "expirySeconds" : 1252
      },
      {
        "authenticationToken" : "bb***.*****.****dd",
        "apiKey" : "abcd***********f",
        "secretKey" : null,
        "expirySeconds" : 1532
      },
      ...
      {
        "authenticationToken" : "yy***.*****.****zz",
        "apiKey" : "abcd***********f",
        "secretKey" : null,
        "expirySeconds" : -1235
      },
    ]
  }
}
```
#### Method-specific errors

Note: Please see the [standard errors](../errors) section for details of generic API errors.

* `count_invalid` - The supplied `count` attribute was not a valid natural number or out of bounds.
* `offset_invalid` - The supplied `offset` attribute was out of bounds.
* `sort_type_invalid` - An unrecognised sort type was requested.
* `sort_order_invalid` - The `sortOrder` was neither `asc` nor `desc`.

### `GET` tokens/:authentication-token [AccessLevel 1]

Validates an authentication, returning information about its issue and validity.

