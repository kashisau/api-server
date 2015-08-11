# Validate methods

## Contact module

## Methods

### `POST` validate [AccessLevel 1]

A method that will test the data that will be sent using the [`POST` send](../send) method. This allows the consuming application to verify the correctness of the data before sending a notification.

#### Required attributes

Both the authorisation token and contact form data must be supplied in this request as follows:

| Attribute   | Value(s)                 | Description                                                    |
|-------------|--------------------------|----------------------------------------------------------------|
| authToken   | `<authentication token>` | An authentication token with accessLevel ≥ 1.                  |
| senderName  | `[a-zA-Z\s.,]{2,100}`    | The sender's full name or handle.                              |
| senderEmail | A valid email address    | The sender's reply email address.                              |
| body        | Contact form message     | The body of the email that is being sent to the administrator. |

#### Optional attributes
There are optional attributes for this method.

| Property | Value(s) | Description |
|----------|----------|-------------|
| (none)   | -        | -           |

#### Expected response

A JSON object supplies feedback on the overall validity of all supplied data (excluding authentication data) as well as assessments of the individual attributes supplied.
 
 ```JSON
 {
  "data": {
    "valid" : false,
    "senderName" : true,
    "senderEmail" : "Not a valid email address.",
    "body" : "Too short"
  }
 }
 ```

#### Method-specific errors

This method is exposed to [authentication errors](/v1/auth/errors) where the authentication information provided cannot be succsfully validated. It may also observe the [general errors](/v1#general-errors) effecting the API.
 