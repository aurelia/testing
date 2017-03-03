define(['exports', './compile-spy', './view-spy', './component-tester', './wait'], function (exports, _compileSpy, _viewSpy, _componentTester, _wait) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.waitForDocumentElements = exports.waitForDocumentElement = exports.waitFor = exports.configure = exports.ComponentTester = exports.StageComponent = exports.ViewSpy = exports.CompileSpy = undefined;


  function configure(config) {
    config.globalResources('./compile-spy', './view-spy');
  }

  exports.CompileSpy = _compileSpy.CompileSpy;
  exports.ViewSpy = _viewSpy.ViewSpy;
  exports.StageComponent = _componentTester.StageComponent;
  exports.ComponentTester = _componentTester.ComponentTester;
  exports.configure = configure;
  exports.waitFor = _wait.waitFor;
  exports.waitForDocumentElement = _wait.waitForDocumentElement;
  exports.waitForDocumentElements = _wait.waitForDocumentElements;
});