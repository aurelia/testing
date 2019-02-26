var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { View, HtmlBehaviorResource } from 'aurelia-templating';
import { Loader } from 'aurelia-loader';
import { waitFor } from './wait';
/**
 * Staging Component helpers to bring up basic setup for a test with ComponentTester
 */
export class StageComponent {
    /**
     * Create a ComponentTester for the given resources
     */
    static withResources(resources = []) {
        return new ComponentTester().withResources(resources);
    }
    /**
     * Create a ComponentTester instance for the given html
     */
    static inView(html) {
        return new ComponentTester().inView(html);
    }
}
export class ComponentTester {
    constructor() {
        this.resources = [];
        this.stubbed = new Set();
    }
    /**
     * Apply standard configuration to an Aurelia instance.
     */
    configure(aurelia) {
        return aurelia.use.standardConfiguration();
    }
    /**
     * Register a configure function to be applied when this ComponentTester initializes
     */
    bootstrap(configure) {
        this.configure = configure;
    }
    /**
     * Register resources to be applied globally when this ComponentTester initializes
     */
    withResources(resources) {
        this.resources = resources;
        return this;
    }
    /**
     * Register test application html to create, when this ComponentTester initializes
     */
    inView(html) {
        this.html = html;
        return this;
    }
    /**
     * Register an object to be used as root viewModel, when this ComponentTester initializes
     */
    boundTo(bindingContext) {
        this.bindingContext = bindingContext;
        return this;
    }
    manuallyHandleLifecycle() {
        this._prepareLifecycle();
        return this;
    }
    /**
     * Initializes the test scene, with given bootstrapping function
     */
    create(bootstrap) {
        return bootstrap((aurelia) => __awaiter(this, void 0, void 0, function* () {
            const loader = aurelia.loader;
            const newLoader = new loader.constructor();
            // remove reference to old loader
            aurelia.container.unregister(Loader);
            // register new loader in both property loader and container
            // property for framework configuration
            aurelia.loader = newLoader;
            // container for templating resources/templating
            aurelia.container.registerInstance(Loader, newLoader);
            yield this.configure(aurelia);
            if (this.resources) {
                const resources = Array.isArray(this.resources) ? this.resources : [this.resources];
                aurelia.use.globalResources(resources.filter(r => typeof r === 'string' ? !this.stubbed.has(r) : true));
            }
            if (this.stubbed.size > 0) {
                // tslint:disable-next-line:no-this-assignment
                const component = this;
                const originalLoadtemplate = aurelia.loader.loadTemplate;
                // overriding loadTemplate method of loader to filter stubbed dependencies
                aurelia.loader.loadTemplate = function (url) {
                    return __awaiter(this, void 0, void 0, function* () {
                        const entry = yield originalLoadtemplate.call(this, url);
                        entry.dependencies = entry.dependencies.filter((d) => !component.stubbed.has(d.src));
                        return entry;
                    });
                };
                overrideHtmlBehaviorResourceLoad();
            }
            yield aurelia.start();
            this.host = document.createElement('div');
            this.host.innerHTML = this.html;
            document.body.appendChild(this.host);
            yield aurelia.enhance(this.bindingContext, this.host);
            const rootView = aurelia.root;
            this.rootView = rootView;
            this.element = this.host.firstElementChild;
            if (rootView.controllers.length) {
                this.viewModel = rootView.controllers[0].viewModel;
            }
            return new Promise(resolve => setTimeout(() => resolve(), 0));
        }));
    }
    /**
     * Dispose this ComponentTester instance, detaching the view and unbind all bindings
     */
    dispose() {
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
    }
    _prepareLifecycle() {
        // bind
        const bindPrototype = View.prototype.bind;
        // tslint:disable-next-line:no-empty
        View.prototype.bind = () => { };
        this.bind = bindingContext => new Promise(resolve => {
            View.prototype.bind = bindPrototype;
            if (bindingContext !== undefined) {
                this.bindingContext = bindingContext;
            }
            this.rootView.bind(this.bindingContext);
            setTimeout(() => resolve(), 0);
        });
        // attached
        const attachedPrototype = View.prototype.attached;
        // tslint:disable-next-line:no-empty
        View.prototype.attached = () => { };
        this.attached = () => new Promise(resolve => {
            View.prototype.attached = attachedPrototype;
            this.rootView.attached();
            setTimeout(() => resolve(), 0);
        });
        // detached
        this.detached = () => new Promise(resolve => {
            this.rootView.detached();
            setTimeout(() => resolve(), 0);
        });
        // unbind
        this.unbind = () => new Promise(resolve => {
            this.rootView.unbind();
            setTimeout(() => resolve(), 0);
        });
    }
    waitForElement(selector, options) {
        return waitFor(() => this.element.querySelector(selector), options);
    }
    waitForElements(selector, options) {
        return waitFor(() => this.element.querySelectorAll(selector), options);
    }
    /**
     * Register dependencies to be ignored while loading dependencies for custom element.
     *
     * Only works with dependencies registered via `<require from="...">` usage
     * Dependencies are expected to be in absolute path
     */
    ignoreDependencies(...deps) {
        for (const dep of deps) {
            this.stubbed.add(dep);
        }
        return this;
    }
}
const originalLoad = HtmlBehaviorResource.prototype.load;
const overrideHtmlBehaviorResourceLoad = () => {
    if (HtmlBehaviorResource.prototype.load === originalLoad) {
        HtmlBehaviorResource.prototype.load = function (container, 
        // tslint:disable-next-line:ban-types
        target, loadContext, viewStrategy) {
            return __awaiter(this, void 0, void 0, function* () {
                // reset every load
                // so that subsequent load of the same class in different tests won't get old view factory
                // with modified dependencies
                this.viewFactory = undefined;
                return originalLoad.call(this, container, target, loadContext, viewStrategy, true);
            });
        };
    }
};
const restoreHtmlBehaviorResourceLoad = () => {
    if (HtmlBehaviorResource.prototype.load !== originalLoad) {
        HtmlBehaviorResource.prototype.load = originalLoad;
    }
};
