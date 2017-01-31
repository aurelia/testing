
export class Expectation {

  url = null;

  method = null;

  requestHeaders = {};

  requestBody = null;

  responseStatus = 200;

  responseHeaders = {};

  responseBody = '';

  /**
   * @param xhr {XHRMock}
   * @returns {Boolean}
   */
  matches(xhr) {
    if (this.url && xhr.url !== this.url) {
      return false;
    }
    if (this.method && xhr.method !== this.method) {
      return false;
    }
    if (!this._compareObjects(this.requestHeaders, xhr.requestHeaders)) {
      return false;
    }

    return !(this.requestBody && xhr.requestText !== this.requestBody);
  }

  /**
   * @param object1 {Object}
   * @param object2 {Object}
   * @returns {Boolean}
   * @private
   */
  _compareObjects(object1, object2) {
    if (Object.keys(object1).length) {
      for (let key in object1) {
        if (!object1.hasOwnProperty(key)) {
          continue;
        }
        if (!object2[key] || object2[key] !== object1[key]) {
          return false;
        }
      }
    }
    return true;
  }
}
