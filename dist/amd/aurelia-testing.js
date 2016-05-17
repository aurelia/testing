define(['exports', 'aurelia-bootstrapper', 'aurelia-templating', 'aurelia-framework'], function (exports, _aureliaBootstrapper, _aureliaTemplating, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ComponentTester = exports.StageComponent = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var StageComponent = exports.StageComponent = {
    withResources: function withResources(resources) {
      return new ComponentTester().withResources(resources);
    }
  };

  var ComponentTester = exports.ComponentTester = function () {
    function ComponentTester() {
      _classCallCheck(this, ComponentTester);

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

    ComponentTester.prototype.create = function create() {
      var _this = this;

      return (0, _aureliaBootstrapper.bootstrap)(function (aurelia) {
        return Promise.resolve(_this.configure(aurelia)).then(function () {
          aurelia.use.globalResources(_this._resources);
          return aurelia.start().then(function (a) {
            var host = document.createElement('div');
            host.innerHTML = _this._html;
            document.body.appendChild(host);
            aurelia.enhance(_this._bindingContext, host);
            _this._rootView = aurelia.root;
            _this.element = host.firstElementChild;
            _this.viewModel = _this.element.au.controller.viewModel;
            _this.dispose = function () {
              return host.parentNode.removeChild(host);
            };
            return new Promise(function (resolve) {
              return setTimeout(function () {
                return resolve();
              }, 0);
            });
          });
        });
      });
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