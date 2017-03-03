'use strict';

System.register([], function (_export, _context) {
  "use strict";

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

  _export('waitFor', waitFor);

  function waitForDocumentElement(selector, options) {
    return waitFor(function () {
      return document.querySelector(selector);
    }, options);
  }

  _export('waitForDocumentElement', waitForDocumentElement);

  function waitForDocumentElements(selector, options) {
    return waitFor(function () {
      return document.querySelectorAll(selector);
    }, options);
  }

  _export('waitForDocumentElements', waitForDocumentElements);

  return {
    setters: [],
    execute: function () {}
  };
});