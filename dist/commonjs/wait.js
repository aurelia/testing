'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.waitFor = waitFor;
exports.waitForDocumentElement = waitForDocumentElement;
exports.waitForDocumentElements = waitForDocumentElements;
function waitFor(getter, options) {
  var timedOut = false;

  options = Object.assign({
    present: true,
    interval: 50,
    timeout: 5000
  }, options);

  function wait() {
    var element = getter();

    var found = element !== null && (!(element instanceof NodeList) && !element.jquery || element.length > 0);

    if (!options.present ^ found || timedOut) {
      return Promise.resolve(element);
    }

    return new Promise(function (rs) {
      return setTimeout(rs, options.interval);
    }).then(wait);
  }

  return Promise.race([new Promise(function (rs, rj) {
    return setTimeout(function () {
      timedOut = true;
      rj(options.present ? 'Element not found' : 'Element not removed');
    }, options.timeout);
  }), wait()]);
}

function waitForDocumentElement(selector, options) {
  return waitFor(function () {
    return document.querySelector(selector);
  }, options);
}

function waitForDocumentElements(selector, options) {
  return waitFor(function () {
    return document.querySelectorAll(selector);
  }, options);
}