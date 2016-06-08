'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configure = exports.ComponentTester = exports.StageComponent = exports.ViewSpy = exports.CompileSpy = undefined;

var _compileSpy = require('./compile-spy');

var _viewSpy = require('./view-spy');

var _componentTester = require('./component-tester');

function configure(config) {
  config.globalResources('./compile-spy', './view-spy');
}

exports.CompileSpy = _compileSpy.CompileSpy;
exports.ViewSpy = _viewSpy.ViewSpy;
exports.StageComponent = _componentTester.StageComponent;
exports.ComponentTester = _componentTester.ComponentTester;
exports.configure = configure;