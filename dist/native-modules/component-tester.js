import { View } from 'aurelia-templating';
import { waitFor } from './wait';
var StageComponent = /** @class */ (function () {
    function StageComponent() {
    }
    StageComponent.withResources = function (resources) {
        if (resources === void 0) { resources = []; }
        return new ComponentTester().withResources(resources);
    };
    return StageComponent;
}());
export { StageComponent };
var ComponentTester = /** @class */ (function () {
    function ComponentTester() {
        this.resources = [];
    }
    ComponentTester.prototype.configure = function (aurelia) {
        return aurelia.use.standardConfiguration();
    };
    ComponentTester.prototype.bootstrap = function (configure) {
        this.configure = configure;
    };
    ComponentTester.prototype.withResources = function (resources) {
        this.resources = resources;
        return this;
    };
    ComponentTester.prototype.inView = function (html) {
        this.html = html;
        return this;
    };
    ComponentTester.prototype.boundTo = function (bindingContext) {
        this.bindingContext = bindingContext;
        return this;
    };
    ComponentTester.prototype.manuallyHandleLifecycle = function () {
        this._prepareLifecycle();
        return this;
    };
    ComponentTester.prototype.create = function (bootstrap) {
        var _this = this;
        return bootstrap(function (aurelia) {
            return Promise.resolve(_this.configure(aurelia)).then(function () {
                if (_this.resources) {
                    aurelia.use.globalResources(_this.resources);
                }
                return aurelia.start().then(function () {
                    _this.host = document.createElement('div');
                    _this.host.innerHTML = _this.html;
                    document.body.appendChild(_this.host);
                    return aurelia.enhance(_this.bindingContext, _this.host).then(function () {
                        _this.rootView = aurelia.root;
                        _this.element = _this.host.firstElementChild;
                        if (aurelia.root.controllers.length) {
                            _this.viewModel = aurelia.root.controllers[0].viewModel;
                        }
                        return new Promise(function (resolve) { return setTimeout(function () { return resolve(); }, 0); });
                    });
                });
            });
        });
    };
    ComponentTester.prototype.dispose = function () {
        if (this.host === undefined || this.rootView === undefined) {
            throw new Error('Cannot call ComponentTester.dispose() before ComponentTester.create()');
        }
        this.rootView.detached();
        this.rootView.unbind();
        return this.host.parentNode.removeChild(this.host);
    };
    ComponentTester.prototype._prepareLifecycle = function () {
        var _this = this;
        // bind
        var bindPrototype = View.prototype.bind;
        // tslint:disable-next-line:no-empty
        View.prototype.bind = function () { };
        this.bind = function (bindingContext) { return new Promise(function (resolve) {
            View.prototype.bind = bindPrototype;
            if (bindingContext !== undefined) {
                _this.bindingContext = bindingContext;
            }
            _this.rootView.bind(_this.bindingContext);
            setTimeout(function () { return resolve(); }, 0);
        }); };
        // attached
        var attachedPrototype = View.prototype.attached;
        // tslint:disable-next-line:no-empty
        View.prototype.attached = function () { };
        this.attached = function () { return new Promise(function (resolve) {
            View.prototype.attached = attachedPrototype;
            _this.rootView.attached();
            setTimeout(function () { return resolve(); }, 0);
        }); };
        // detached
        this.detached = function () { return new Promise(function (resolve) {
            _this.rootView.detached();
            setTimeout(function () { return resolve(); }, 0);
        }); };
        // unbind
        this.unbind = function () { return new Promise(function (resolve) {
            _this.rootView.unbind();
            setTimeout(function () { return resolve(); }, 0);
        }); };
    };
    ComponentTester.prototype.waitForElement = function (selector, options) {
        var _this = this;
        return waitFor(function () { return _this.element.querySelector(selector); }, options);
    };
    ComponentTester.prototype.waitForElements = function (selector, options) {
        var _this = this;
        return waitFor(function () { return _this.element.querySelectorAll(selector); }, options);
    };
    return ComponentTester;
}());
export { ComponentTester };
