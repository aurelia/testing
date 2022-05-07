import { TargetInstruction, View } from 'aurelia-templating';
import { getLogger } from 'aurelia-logging';
import { DOM } from 'aurelia-pal';

var CompileSpy = (function () {
    function CompileSpy(element, instruction) {
        getLogger('compile-spy').info(element.toString(), instruction);
    }
    Object.defineProperty(CompileSpy, "inject", {
        get: function () { return [DOM.Element, TargetInstruction]; },
        enumerable: false,
        configurable: true
    });
    CompileSpy.$resource = {
        type: 'attribute',
        name: 'compile-spy'
    };
    return CompileSpy;
}());

var ViewSpy = (function () {
    function ViewSpy() {
        this.logger = getLogger('view-spy');
    }
    ViewSpy.prototype._log = function (lifecycleName, context) {
        if (!this.value && lifecycleName === 'created') {
            this.logger.info(lifecycleName, this.view);
        }
        else if (this.value && this.value.indexOf(lifecycleName) !== -1) {
            this.logger.info(lifecycleName, this.view, context);
        }
    };
    ViewSpy.prototype.created = function (view) {
        this.view = view;
        this._log('created');
    };
    ViewSpy.prototype.bind = function (bindingContext) {
        this._log('bind', bindingContext);
    };
    ViewSpy.prototype.attached = function () {
        this._log('attached');
    };
    ViewSpy.prototype.detached = function () {
        this._log('detached');
    };
    ViewSpy.prototype.unbind = function () {
        this._log('unbind');
    };
    ViewSpy.$resource = {
        type: 'attribute',
        name: 'view-spy'
    };
    return ViewSpy;
}());

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function waitFor(getter, options) {
    if (options === void 0) { options = { present: true, interval: 50, timeout: 5000 }; }
    var timedOut = false;
    options = __assign({ present: true, interval: 50, timeout: 5000 }, options);
    function wait() {
        var element = getter();
        var found = element !== null && (!(element instanceof NodeList) &&
            !element.jquery || element.length > 0);
        if (!options.present === !found || timedOut) {
            return Promise.resolve(element);
        }
        return new Promise(function (rs) { return setTimeout(rs, options.interval); }).then(wait);
    }
    return Promise.race([
        new Promise(function (_, rj) { return setTimeout(function () {
            timedOut = true;
            rj(new Error(options.present ? 'Element not found' : 'Element not removed'));
        }, options.timeout); }),
        wait()
    ]);
}
function waitForDocumentElement(selector, options) {
    return waitFor(function () { return document.querySelector(selector); }, options);
}
function waitForDocumentElements(selector, options) {
    return waitFor(function () { return document.querySelectorAll(selector); }, options);
}

var StageComponent = (function () {
    function StageComponent() {
    }
    StageComponent.withResources = function (resources) {
        if (resources === void 0) { resources = []; }
        return new ComponentTester().withResources(resources);
    };
    return StageComponent;
}());
var ComponentTester = (function () {
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
        var bindPrototype = View.prototype.bind;
        View.prototype.bind = function () { };
        this.bind = function (bindingContext) { return new Promise(function (resolve) {
            View.prototype.bind = bindPrototype;
            if (bindingContext !== undefined) {
                _this.bindingContext = bindingContext;
            }
            _this.rootView.bind(_this.bindingContext);
            setTimeout(function () { return resolve(); }, 0);
        }); };
        var attachedPrototype = View.prototype.attached;
        View.prototype.attached = function () { };
        this.attached = function () { return new Promise(function (resolve) {
            View.prototype.attached = attachedPrototype;
            _this.rootView.attached();
            setTimeout(function () { return resolve(); }, 0);
        }); };
        this.detached = function () { return new Promise(function (resolve) {
            _this.rootView.detached();
            setTimeout(function () { return resolve(); }, 0);
        }); };
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

function configure(config) {
    config.globalResources([CompileSpy, ViewSpy]);
}

export { CompileSpy, ComponentTester, StageComponent, ViewSpy, configure, waitFor, waitForDocumentElement, waitForDocumentElements };
//# sourceMappingURL=aurelia-testing.js.map
