define(['exports', './compile-spy', './view-spy', './component-tester'], function (exports, _compileSpy, _viewSpy, _componentTester) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = exports.ComponentTester = exports.StageComponent = exports.ViewSpy = exports.CompileSpy = undefined;


  function configure(config) {
    config.globalResources('./compile-spy', './view-spy');
  }

  exports.CompileSpy = _compileSpy.CompileSpy;
  exports.ViewSpy = _viewSpy.ViewSpy;
  exports.StageComponent = _componentTester.StageComponent;
  exports.ComponentTester = _componentTester.ComponentTester;
  exports.configure = configure;
});