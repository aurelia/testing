define(['exports', './compile-spy', './view-spy'], function (exports, _compileSpy, _viewSpy) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = exports.ViewSpy = exports.CompileSpy = undefined;


  function configure(config) {
    config.globalResources('./compile-spy', './view-spy');
  }

  exports.CompileSpy = _compileSpy.CompileSpy;
  exports.ViewSpy = _viewSpy.ViewSpy;
  exports.configure = configure;
});