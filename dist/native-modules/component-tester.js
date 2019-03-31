var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { View, HtmlBehaviorResource } from 'aurelia-templating';
import { Loader } from 'aurelia-loader';
import { waitFor } from './wait';
/**
 * Staging Component helpers to bring up basic setup for a test with ComponentTester
 */
var StageComponent = /** @class */ (function () {
    function StageComponent() {
    }
    /**
     * Create a ComponentTester for the given resources
     */
    StageComponent.withResources = function (resources) {
        if (resources === void 0) { resources = []; }
        return new ComponentTester().withResources(resources);
    };
    /**
     * Create a ComponentTester instance for the given html
     */
    StageComponent.inView = function (html) {
        return new ComponentTester().inView(html);
    };
    return StageComponent;
}());
export { StageComponent };
var ComponentTester = /** @class */ (function () {
    function ComponentTester() {
        this.resources = [];
        this.stubbed = new Set();
    }
    /**
     * Apply standard configuration to an Aurelia instance.
     */
    ComponentTester.prototype.configure = function (aurelia) {
        return aurelia.use.standardConfiguration();
    };
    /**
     * Register a configure function to be applied when this ComponentTester initializes
     */
    ComponentTester.prototype.bootstrap = function (configure) {
        this.configure = configure;
    };
    /**
     * Register resources to be applied globally when this ComponentTester initializes
     */
    ComponentTester.prototype.withResources = function (resources) {
        this.resources = resources;
        return this;
    };
    /**
     * Register test application html to create, when this ComponentTester initializes
     */
    ComponentTester.prototype.inView = function (html) {
        this.html = html;
        return this;
    };
    /**
     * Register an object to be used as root viewModel, when this ComponentTester initializes
     */
    ComponentTester.prototype.boundTo = function (bindingContext) {
        this.bindingContext = bindingContext;
        return this;
    };
    ComponentTester.prototype.manuallyHandleLifecycle = function () {
        this._prepareLifecycle();
        return this;
    };
    /**
     * Initializes the test scene, with given bootstrapping function
     */
    ComponentTester.prototype.create = function (bootstrap) {
        var _this = this;
        return bootstrap(function (aurelia) { return __awaiter(_this, void 0, void 0, function () {
            var loader, newLoader, resources, component_1, originalLoadtemplate_1, rootView;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        loader = aurelia.loader;
                        newLoader = new loader.constructor();
                        // remove reference to old loader
                        aurelia.container.unregister(Loader);
                        // register new loader in both property loader and container
                        // property for framework configuration
                        aurelia.loader = newLoader;
                        // container for templating resources/templating
                        aurelia.container.registerInstance(Loader, newLoader);
                        return [4 /*yield*/, this.configure(aurelia)];
                    case 1:
                        _a.sent();
                        if (this.resources) {
                            resources = Array.isArray(this.resources) ? this.resources : [this.resources];
                            aurelia.use.globalResources(resources.filter(function (r) { return typeof r === 'string' ? !_this.stubbed.has(r) : true; }));
                        }
                        if (this.stubbed.size > 0) {
                            component_1 = this;
                            originalLoadtemplate_1 = aurelia.loader.loadTemplate;
                            // overriding loadTemplate method of loader to filter stubbed dependencies
                            aurelia.loader.loadTemplate = function (url) {
                                return __awaiter(this, void 0, void 0, function () {
                                    var entry;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, originalLoadtemplate_1.call(this, url)];
                                            case 1:
                                                entry = _a.sent();
                                                entry.dependencies = entry.dependencies.filter(function (d) { return !component_1.stubbed.has(d.src); });
                                                return [2 /*return*/, entry];
                                        }
                                    });
                                });
                            };
                            overrideHtmlBehaviorResourceLoad();
                        }
                        return [4 /*yield*/, aurelia.start()];
                    case 2:
                        _a.sent();
                        this.host = document.createElement('div');
                        this.host.innerHTML = this.html;
                        document.body.appendChild(this.host);
                        return [4 /*yield*/, aurelia.enhance(this.bindingContext, this.host)];
                    case 3:
                        _a.sent();
                        rootView = aurelia.root;
                        this.rootView = rootView;
                        this.element = this.host.firstElementChild;
                        if (rootView.controllers.length) {
                            this.viewModel = rootView.controllers[0].viewModel;
                        }
                        return [2 /*return*/, new Promise(function (resolve) { return setTimeout(function () { return resolve(); }, 0); })];
                }
            });
        }); });
    };
    /**
     * Dispose this ComponentTester instance, detaching the view and unbind all bindings
     */
    ComponentTester.prototype.dispose = function () {
        if (this.host === undefined || this.rootView === undefined) {
            throw new Error('Cannot call ComponentTester.dispose() before ComponentTester.create()');
        }
        if (this.disposed === true) {
            throw new Error('This ComponentTester instance has already been disposed. Did you call dispose() twice?');
        }
        this.disposed = true;
        this.rootView.detached();
        this.rootView.unbind();
        if (this.stubbed.size > 0) {
            restoreHtmlBehaviorResourceLoad();
        }
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
    /**
     * Register dependencies to be ignored while loading dependencies for custom element.
     *
     * Only works with dependencies registered via `<require from="...">` usage
     * Dependencies are expected to be in absolute path
     */
    ComponentTester.prototype.ignoreDependencies = function () {
        var deps = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            deps[_i] = arguments[_i];
        }
        for (var _a = 0, deps_1 = deps; _a < deps_1.length; _a++) {
            var dep = deps_1[_a];
            this.stubbed.add(dep);
        }
        return this;
    };
    return ComponentTester;
}());
export { ComponentTester };
var originalLoad = HtmlBehaviorResource.prototype.load;
var overrideHtmlBehaviorResourceLoad = function () {
    if (HtmlBehaviorResource.prototype.load === originalLoad) {
        HtmlBehaviorResource.prototype.load = function (container, 
        // tslint:disable-next-line:ban-types
        target, loadContext, viewStrategy) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    // reset every load
                    // so that subsequent load of the same class in different tests won't get old view factory
                    // with modified dependencies
                    this.viewFactory = undefined;
                    return [2 /*return*/, originalLoad.call(this, container, target, loadContext, viewStrategy, true)];
                });
            });
        };
    }
};
var restoreHtmlBehaviorResourceLoad = function () {
    if (HtmlBehaviorResource.prototype.load !== originalLoad) {
        HtmlBehaviorResource.prototype.load = originalLoad;
    }
};
