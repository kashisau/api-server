# Contact module 1.0

Handles the validation of form data and submission of contact forms on the [main website](https://kashis.com.au). The contact form system follows a process that must be observed in order to function correctly (to avoid abuse).

## Authorisation

Applications attempting to use the Contact module will need to apply for an authorisation token from the Auth module before executing the `/send` method.

### Token requirements

When calling methods of the Contact module, an authentication token must be supplied and contain (at minimum) the following properties:

| Property      | Value(s)     |
| ------------- | ------------ |
| method        | contact.send |
| accessLevel   | 1            |
| accessTimeout | 120-7200     |

## Methods

Below is a list of methods that are made available by the module.

* [`/send`](send/)