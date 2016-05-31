'use strict';

System.register(['./compile-spy', './view-spy'], function (_export, _context) {
  "use strict";

  var CompileSpy, ViewSpy;


  function configure(config) {
    config.globalResources('./compile-spy', './view-spy');
  }

  return {
    setters: [function (_compileSpy) {
      CompileSpy = _compileSpy.CompileSpy;
    }, function (_viewSpy) {
      ViewSpy = _viewSpy.ViewSpy;
    }],
    execute: function () {
      _export('CompileSpy', CompileSpy);

      _export('ViewSpy', ViewSpy);

      _export('configure', configure);
    }
  };
});