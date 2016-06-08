'use strict';

System.register(['./compile-spy', './view-spy', './component-tester'], function (_export, _context) {
  "use strict";

  var CompileSpy, ViewSpy, StageComponent, ComponentTester;


  function configure(config) {
    config.globalResources('./compile-spy', './view-spy');
  }

  return {
    setters: [function (_compileSpy) {
      CompileSpy = _compileSpy.CompileSpy;
    }, function (_viewSpy) {
      ViewSpy = _viewSpy.ViewSpy;
    }, function (_componentTester) {
      StageComponent = _componentTester.StageComponent;
      ComponentTester = _componentTester.ComponentTester;
    }],
    execute: function () {
      _export('CompileSpy', CompileSpy);

      _export('ViewSpy', ViewSpy);

      _export('StageComponent', StageComponent);

      _export('ComponentTester', ComponentTester);

      _export('configure', configure);
    }
  };
});