'use strict';

System.register(['aurelia-templating', 'aurelia-logging'], function (_export, _context) {
  "use strict";

  var customAttribute, LogManager, _dec, _class, ViewSpy;

  

  return {
    setters: [function (_aureliaTemplating) {
      customAttribute = _aureliaTemplating.customAttribute;
    }, function (_aureliaLogging) {
      LogManager = _aureliaLogging;
    }],
    execute: function () {
      _export('ViewSpy', ViewSpy = (_dec = customAttribute('view-spy'), _dec(_class = function () {
        function ViewSpy() {
          

          this.logger = LogManager.getLogger('view-spy');
        }

        ViewSpy.prototype._log = function _log(lifecycleName, context) {
          if (!this.value && lifecycleName === 'created') {
            this.logger.info(lifecycleName, this.view);
          } else if (this.value && this.value.indexOf(lifecycleName) !== -1) {
            this.logger.info(lifecycleName, this.view, context);
          }
        };

        ViewSpy.prototype.created = function created(view) {
          this.view = view;
          this._log('created');
        };

        ViewSpy.prototype.bind = function bind(bindingContext) {
          this._log('bind', bindingContext);
        };

        ViewSpy.prototype.attached = function attached() {
          this._log('attached');
        };

        ViewSpy.prototype.detached = function detached() {
          this._log('detached');
        };

        ViewSpy.prototype.unbind = function unbind() {
          this._log('unbind');
        };

        return ViewSpy;
      }()) || _class));

      _export('ViewSpy', ViewSpy);
    }
  };
});