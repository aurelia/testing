
export class RequestHandler {

  /**
   * @type {Array<Expectation>}
   */
  expected = [];

  /**
   * @type {Array<XHRMock>}
   */
  unexpected = [];

  /**
   * @param expected {Expectation}
   */
  expect(expected) {
    this.expected.push(expected);
  }

  /**
   * @param xhr {XHRMock}
   */
  handle(xhr) {
    for (let i = this.expected.length; i--;) {
      let expected = this.expected[i];
      // Compare url and http method
      if (expected.matches(xhr)) {
        // Set expected response headers on xhr mock
        xhr.responseHeaders = expected.responseHeaders || {};
        // Emulate response with expected values
        xhr.receive(expected.responseStatus, expected.responseBody);
        // Remove the expected request because we handle it only once
        this.expected.splice(i, 1);
        return;
      }
    }
    // No expected request was found if the function hasn't returned yet
    this.unexpected.push(xhr);
  }

  /**
   * @returns {Boolean}
   */
  isDone() {
    return !this.expected.length;
  }

  /**
   * @returns {Boolean}
   */
  hadUnexpected() {
    return !!this.unexpected.length;
  }
}
