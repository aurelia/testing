'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CompileSpy = exports.ViewSpy = exports.ComponentTester = exports.StageComponent = undefined;

var _dec, _class2, _dec2, _dec3, _class3;

var _aureliaLogging = require('aurelia-logging');

var LogManager = _interopRequireWildcard(_aureliaLogging);

var _aureliaTemplating = require('aurelia-templating');

var _aureliaFramework = require('aurelia-framework');

var _aureliaDependencyInjection = require('aurelia-dependency-injection');

var _aureliaPal = require('aurelia-pal');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

var ViewSpy = exports.ViewSpy = (_dec = (0, _aureliaTemplating.customAttribute)('view-spy'), _dec(_class2 = function () {
  function ViewSpy() {
    _classCallCheck(this, ViewSpy);

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
}()) || _class2);
var CompileSpy = exports.CompileSpy = (_dec2 = (0, _aureliaTemplating.customAttribute)('compile-spy'), _dec3 = (0, _aureliaDependencyInjection.inject)(_aureliaPal.DOM.Element, _aureliaTemplating.TargetInstruction), _dec2(_class3 = _dec3(_class3 = function CompileSpy(element, instruction) {
  _classCallCheck(this, CompileSpy);

  LogManager.getLogger('compile-spy').info(element, instruction);
}) || _class3) || _class3);