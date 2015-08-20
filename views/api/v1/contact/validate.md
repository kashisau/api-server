# Validate methods

## Contact module

## Methods

### `POST` validate [AccessLevel 1]

A method that will test the data that will be sent using the [`POST` send](../send) method. This allows the consuming application to verify the correctness of the data before sending a notification.

#### Required attributes

Both the authorisation token and contact form data must be supplied. For all submissions to this method, all form fields must be supplied (i.e., partial form submission may be made, but required fields will be flagged as such).

| Attribute   | Value(s)                 | Description                                                                                |
|-------------|--------------------------|--------------------------------------------------------------------------------------------|
| authToken   | `<authentication token>` | A valid authentication token with accessLevel ≥ 1.                                         |
| senderName  | `[a-zA-Z\s.,]{2,100}`    | The sender's full name or handle.                                                          |
| senderEmail | A valid email address    | The sender's reply email address.                                                          |
| body        | Contact form message     | The body of the email that is being sent to the administrator. Maximum length 16,384 bytes |

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
    "senderEmail" : "invalid_email",
    "body" : "min_length"
  }
 }
 ```

Codes are used to communicate the feedback of each individual form field. Potential errors cascade, but only one error per form field will be reported. a boolean `true` indicates a lack of any errors for the field.
 
##### Error codes

| Error           | Description |
|-----------------|-------------|
| `invalid_email` | Indicates that the submitted data for this field was not a syntactically-correct email address. This only applies to the `senderEmail` field. |
| `required`      | This field is required however was not supplied for validation. |
| `min_length`    | The content supplied for this field does not meet the minimum length requirements. |
| `max_length`    | The content supplied for this field exceeds the maximum length allowed. |

#### Method-specific errors

This method is exposed to [authentication errors](/v1/auth/errors) where the authentication information provided cannot be succsfully validated. It may also observe the [general errors](/v1#general-errors) effecting the API.
 