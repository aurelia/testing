define(['exports', 'aurelia-templating', 'aurelia-framework'], function (exports, _aureliaTemplating, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ComponentTester = exports.StageComponent = undefined;

  

  var StageComponent = exports.StageComponent = {
    withResources: function withResources(resources) {
      return new ComponentTester().withResources(resources);
    }
  };

  var ComponentTester = exports.ComponentTester = function () {
    function ComponentTester() {
      

      this.configure = function (aurelia) {
        return aurelia.use.standardConfiguration();
      };

      this._resources = [];
    }

    ComponentTester.prototype.bootstrap = function bootstrap(configure) {
      this.configure = configure;
    };

    ComponentTester.prototype.withResources = function withResources(resources) {
      this._resources = resources;
      return this;
    };

    ComponentTester.prototype.inView = function inView(html) {
      this._html = html;
      return this;
    };

    ComponentTester.prototype.boundTo = function boundTo(bindingContext) {
      this._bindingContext = bindingContext;
      return this;
    };

    ComponentTester.prototype.manuallyHandleLifecycle = function manuallyHandleLifecycle() {
      this._prepareLifecycle();
      return this;
    };

    ComponentTester.prototype.create = function create(bootstrap) {
      var _this = this;

      return bootstrap(function (aurelia) {
        return Promise.resolve(_this.configure(aurelia)).then(function () {
          if (_this._resources) {
            aurelia.use.globalResources(_this._resources);
          }

          return aurelia.start().then(function (a) {
            _this.host = document.createElement('div');
            _this.host.innerHTML = _this._html;

            document.body.appendChild(_this.host);

            return aurelia.enhance(_this._bindingContext, _this.host).then(function () {
              _this._rootView = aurelia.root;
              _this.element = _this.host.firstElementChild;

              if (aurelia.root.controllers.length) {
                _this.viewModel = aurelia.root.controllers[0].viewModel;
              }

              return new Promise(function (resolve) {
                return setTimeout(function () {
                  return resolve();
                }, 0);
              });
            });
          });
        });
      });
    };

    ComponentTester.prototype.dispose = function dispose() {
      if (this.host === undefined || this._rootView === undefined) {
        throw new Error('Cannot call ComponentTester.dispose() before ComponentTester.create()');
      }

      this._rootView.detached();
      this._rootView.unbind();

      return this.host.parentNode.removeChild(this.host);
    };

    ComponentTester.prototype._prepareLifecycle = function _prepareLifecycle() {
      var _this2 = this;

      var bindPrototype = _aureliaTemplating.View.prototype.bind;
      _aureliaTemplating.View.prototype.bind = function () {};
      this.bind = function (bindingContext) {
        return new Promise(function (resolve) {
          _aureliaTemplating.View.prototype.bind = bindPrototype;
          if (bindingContext !== undefined) {
            _this2._bindingContext = bindingContext;
          }
          _this2._rootView.bind(_this2._bindingContext);
          setTimeout(function () {
            return resolve();
          }, 0);
        });
      };

      var attachedPrototype = _aureliaTemplating.View.prototype.attached;
      _aureliaTemplating.View.prototype.attached = function () {};
      this.attached = function () {
        return new Promise(function (resolve) {
          _aureliaTemplating.View.prototype.attached = attachedPrototype;
          _this2._rootView.attached();
          setTimeout(function () {
            return resolve();
          }, 0);
        });
      };

      this.detached = function () {
        return new Promise(function (resolve) {
          _this2._rootView.detached();
          setTimeout(function () {
            return resolve();
          }, 0);
        });
      };

      this.unbind = function () {
        return new Promise(function (resolve) {
          _this2._rootView.unbind();
          setTimeout(function () {
            return resolve();
          }, 0);
        });
      };
    };

    return ComponentTester;
  }();
});