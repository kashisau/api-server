# Send methods

## Contact module

## Methods

### `POST` send [AccessLevel 1]

Used to send an email to the website administrator. The information supplied will be validated before being accepted, and will therefore raise the same errors as the [*`POST` validate*](/v1/contact/validate) method if validation fails.

#### Required attributes

Both the authorisation token and contact form data must be supplied in this request as follows:

| Attribute            | Value(s)                 | Description                                                    |
|----------------------|--------------------------|----------------------------------------------------------------|
| authentication-token | `<authentication token>` | An authentication token with accessLevel ≥ 1.                  |
| name                 | `[a-zA-Z\s.,]{2,100}`    | The sender's full name or handle.                              |
| email                | A valid email address    | The sender's reply email address.                              |
| body                 | Contact form message     | The body of the email that is being sent to the administrator. |

#### Optional attributes
There are optional attributes for this method.

| Property | Value(s) | Description |
|----------|----------|-------------|
| (none)   | -        | -           |

#### Expected response
A success message will be returned to the requesting client with timestamp information and the supplied recipient details.
```
{
    "data": {
        "sent": true,
        "serverTime": 1444049103544,
        "recipientName": "Some Person",
        "replyTo": "some-email@address.com"
    }
    ...
}
```

#### Method-specific errors
Note: Please see the [standard errors](../errors) section for details of generic API errors.

* `validation_failed` - The supplied data was met with validation errors. Details of the validation errors are supplied in `errors.meta` of the JSON response.
