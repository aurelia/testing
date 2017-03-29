import {Expectation} from './expectation';

export class ExpectationBuilder {

  /**
   * @param handler {RequestHandler}
   */
  constructor(handler) {
    this.expectation = new Expectation();
    // Set reference to handler
    handler.expect(this.expectation);
  }

  /**
   * Expect an url to be called
   * @param url {String}
   * @returns {ExpectationBuilder}
   */
  withUrl(url) {
    this.expectation.url = url;
    return this;
  }

  /**
   * Expect the request to be done with a specific method
   * @param method {String}
   * @returns {ExpectationBuilder}
   */
  withMethod(method) {
    this.expectation.method = method;
    return this;
  }

  /**
   * Expect the request to contain certain header
   * @param name {String}
   * @param value {String}
   * @returns {ExpectationBuilder}
   */
  withRequestHeader(name, value) {
    this.expectation.requestHeaders[name.toLocaleLowerCase()] = value;
    return this;
  }

  /**
   * Expect the request to send specific data
   * @param body {String}
   * @returns {ExpectationBuilder}
   */
  withRequestBody(body) {
    this.expectation.requestBody = typeof body === 'string' ? body : JSON.stringify(body);
    return this;
  }

  /**
   * Expect the request to respond with specific http status code
   * @param status {Number}
   * @returns {ExpectationBuilder}
   */
  withResponseStatus(status) {
    this.expectation.responseStatus = status;
    return this;
  }

  /**
   * Expect the response to contain a certain header
   * @param name {String}
   * @param value {String}
   * @returns {ExpectationBuilder}
   */
  withResponseHeader(name, value) {
    this.expectation.responseHeaders[name.toLocaleLowerCase()] = value;
    return this;
  }

  /**
   * Expect the response to contain specific data
   * @param body {String|Object}
   * @returns {ExpectationBuilder}
   */
  withResponseBody(body) {
    this.expectation.responseBody = typeof body === 'string' ? body : JSON.stringify(body);
    return this;
  }
}
