var contactModel = {};

/**
 * Takes a JSON object containing a list of fields that have been submitted,
 * validating those fields that are recognised by the contact module.
 * The output of this method will be a JSON object with the same property names
 * as the supplied parameter, but with an array of test results for each
 * property.
 * Unidentified properties will be discarded.
 * @param inputs {*}    An array of the submission data supplied, with each
 *                      input corresponding to the value submitted.
 * @returns {*} Returns an object with recognised input names as keys, each
 *              corresponding to an array of validation tests (along with their
 *              results).
 */
contactModel.validateInput = function(inputs) {
    var name = inputs.name,
        email = inputs.email,
        body = inputs.body,
        fieldTests = {};

    // Check the name field
    fieldTests.name = contactModel.checkName(name);
    // Check the email field
    fieldTests.email = contactModel.checkEmail(email);
    // Check the body field
    fieldTests.body = contactModel.checkMessageBody(body);

    return fieldTests;
};

/**
 * Takes a submitted value for the name field of the contact form and validates
 * it. This method returns an array of tests along with their results.
 * @param name string   The value of the submitted name being tested.
 * @returns {*} Returns an object containing a series of test cases and the
 *              (boolean) test result for each test. This object may be used
 *              to assess overall validity or single out which cases failed.
 */
contactModel.checkName = function(name) {
    var MIN_LENGTH = 2,
        MAX_LENGTH = 100,
        VALID_CHARACTERS_RX = /^[a-zA-Z\s]*$/g,
        tests = {};

    tests.submitted = name !== undefined;
    if ( ! tests.submitted) return tests;

    tests.minLength = name.length >= MIN_LENGTH;
    tests.maxLength = name.length <= MAX_LENGTH;
    tests.validFormat = VALID_CHARACTERS_RX.test(name);

    return tests;
};

/**
 * Validates the email field of the contact submission for acceptable length
 * and correctness towards RFC 2822 (or more accurately an approximation).
 * This method uses the implementation of a regular expression published on
 * StackOverflow by user voyager: http://stackoverflow.com/a/1373724
 * An object containing test cases and their (boolean) results are returned.
 * @param email String  The email address being validated.
 * @returns {*} Returns an object containing a series of test cases and the
 *              (boolean) test result for each test. This object may be used
 *              to assess overall validity or single out which cases failed.
 */
contactModel.checkEmail = function(email) {
    var MIN_LENGTH = 7,
        MAX_LENGTH = 50,
        EMAIL_RX = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/g,
        tests = {};

    tests.submitted = email !== undefined;
    if ( ! tests.submitted) return tests;

    tests.minLength = email.length >= MIN_LENGTH;
    tests.maxLength = email.length <= MAX_LENGTH;
    tests.validFormat = EMAIL_RX.test(email);

    return tests;
};

/**
 * Checks the message body of a contact form submission. There are three basic
 * checks conducted, length (minimum and maximum) and submission (that is, was
 * there any data submitted at all?).
 * @param body string   The message body that was submitted to the validation
 *                      method.
 * @returns {*} Returns an object containing a series of test cases and the
 *              (boolean) test result for each test. This object may be used
 *              to assess overall validity or single out which cases failed.
 */
contactModel.checkMessageBody = function(body) {
    var MIN_LENGTH = 5,
        MAX_LENGTH = 16536,
        tests = {};

    tests.submitted = body !== undefined;
    if ( ! tests.submitted) return tests;

    tests.minLength = body.length >= MIN_LENGTH;
    tests.maxLength = body.length <= MAX_LENGTH;

    return tests;
};

/**
 * Takes the output of a series of test results and iterates through each of
 * the components to assess the overall validity. This is a boolean additive
 * mechanism that short-circuits when a false is found.
 * @param testResults {{bool[]}}    The test result object as processed by a
 *                                  model of this application.
 * @returns boolean Returns true if all the tests are passed, false if not.
 */
contactModel.addTestResults = function(testResults) {
    var testSuite,
        test;

    for (testSuite in testResults) {
        if (testResults.hasOwnProperty(testSuite)) {
            var testSuite = testResults[testSuite];
            for (test in testSuite){
                if (testSuite.hasOwnProperty(test)) {
                    var test = testSuite[test];
                    if ( ! test)
                        return false;
                }
            }
        }
    }

    return true;
};

module.exports = contactModel;