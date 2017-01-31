import {Container} from 'aurelia-dependency-injection';
import * as http from 'aurelia-http-client';
import {request as XHRMock} from 'mock-xhr';
import {RequestHandler} from './request-handler';
import {ExpectationBuilder} from './expectation-builder';

export class HttpClientMock extends http.HttpClient {

  /**
   * @constructor
   */
  constructor() {
    super();

    let handler = this.handler = new RequestHandler();
    // Ensure each http client has it's own xhr mock instance with it's own handler
    function XHR() {
      XHRMock.apply(this, arguments);
      this.upload = {};
      this.onsend = () => handler.handle(this);
    }
    XHR.prototype = XHRMock.prototype;
    // Create message processor with xhr mock
    this.requestProcessorFactories = new Map();
    this.requestProcessorFactories.set(http.HttpRequestMessage, () => HttpClientMock.createMockProcessor(XHR));
    this.requestProcessorFactories.set(http.JSONPRequestMessage, () => HttpClientMock.createMockProcessor(XHR));
  }

  /**
   * @param xhr {XHRMock}
   * @returns {http.RequestMessageProcessor}
   */
  static createMockProcessor(xhr) {
    return new http.RequestMessageProcessor(xhr, [
      http.timeoutTransformer,
      http.credentialsTransformer,
      http.progressTransformer,
      http.responseTypeTransformer,
      http.headerTransformer,
      http.contentTransformer
    ]);
  }

  /**
   * @void
   */
  registerGlobally() {
    new Container().makeGlobal();
    Container.instance.registerInstance(http.HttpClient, this);
  }

  /**
   * @param url {String}
   * @returns {ExpectationBuilder}
   */
  expect(url) {
    return new ExpectationBuilder(this.handler).withUrl(url);
  }

  /**
   * @returns {Boolean}
   */
  isDone() {
    return this.handler.isDone();
  }

  /**
   * @returns {Array<Expectation>}
   */
  getExpected() {
    return this.handler.expected;
  }

  /**
   * @returns {Boolean}
   */
  hadUnexpected() {
    return this.handler.hadUnexpected();
  }

  /**
   * @returns {Array<XHRMock>}
   */
  getUnexpected() {
    return this.handler.unexpected;
  }
}
