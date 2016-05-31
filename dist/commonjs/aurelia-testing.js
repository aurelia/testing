'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configure = exports.ViewSpy = exports.CompileSpy = undefined;

var _compileSpy = require('./compile-spy');

var _viewSpy = require('./view-spy');

function configure(config) {
  config.globalResources('./compile-spy', './view-spy');
}

exports.CompileSpy = _compileSpy.CompileSpy;
exports.ViewSpy = _viewSpy.ViewSpy;
exports.configure = configure;