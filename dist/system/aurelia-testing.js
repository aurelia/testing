'use strict';

System.register([], function (_export, _context) {
  return {
    setters: [],
    execute: function () {
      function configure(config) {
        config.globalResources('./compile-spy', './view-spy');
      }

      _export('configure', configure);
    }
  };
});