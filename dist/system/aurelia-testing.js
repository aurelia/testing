'use strict';

System.register(['./compile-spy', './view-spy', './component-tester', './wait'], function (_export, _context) {
  "use strict";

  var CompileSpy, ViewSpy, StageComponent, ComponentTester, waitFor, waitForDocumentElement, waitForDocumentElements;


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
    }, function (_wait) {
      waitFor = _wait.waitFor;
      waitForDocumentElement = _wait.waitForDocumentElement;
      waitForDocumentElements = _wait.waitForDocumentElements;
    }],
    execute: function () {
      _export('CompileSpy', CompileSpy);

      _export('ViewSpy', ViewSpy);

      _export('StageComponent', StageComponent);

      _export('ComponentTester', ComponentTester);

      _export('configure', configure);

      _export('waitFor', waitFor);

      _export('waitForDocumentElement', waitForDocumentElement);

      _export('waitForDocumentElements', waitForDocumentElements);
    }
  };
});