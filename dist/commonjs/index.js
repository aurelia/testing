'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _aureliaTesting = require('./aurelia-testing');

Object.keys(_aureliaTesting).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _aureliaTesting[key];
    }
  });
});