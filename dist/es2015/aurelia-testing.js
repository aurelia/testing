import { TargetInstruction, View } from 'aurelia-templating';
import { getLogger } from 'aurelia-logging';
import { DOM } from 'aurelia-pal';

class CompileSpy {
    constructor(element, instruction) {
        getLogger('compile-spy').info(element.toString(), instruction);
    }
    static get inject() { return [DOM.Element, TargetInstruction]; }
}
CompileSpy.$resource = {
    type: 'attribute',
    name: 'compile-spy'
};

class ViewSpy {
    constructor() {
        this.logger = getLogger('view-spy');
    }
    _log(lifecycleName, context) {
        if (!this.value && lifecycleName === 'created') {
            this.logger.info(lifecycleName, this.view);
        }
        else if (this.value && this.value.indexOf(lifecycleName) !== -1) {
            this.logger.info(lifecycleName, this.view, context);
        }
    }
    created(view) {
        this.view = view;
        this._log('created');
    }
    bind(bindingContext) {
        this._log('bind', bindingContext);
    }
    attached() {
        this._log('attached');
    }
    detached() {
        this._log('detached');
    }
    unbind() {
        this._log('unbind');
    }
}
ViewSpy.$resource = {
    type: 'attribute',
    name: 'view-spy'
};

function waitFor(getter, options = { present: true, interval: 50, timeout: 5000 }) {
    let timedOut = false;
    options = Object.assign({ present: true, interval: 50, timeout: 5000 }, options);
    function wait() {
        const element = getter();
        const found = element !== null && (!(element instanceof NodeList) &&
            !element.jquery || element.length > 0);
        if (!options.present === !found || timedOut) {
            return Promise.resolve(element);
        }
        return new Promise(rs => setTimeout(rs, options.interval)).then(wait);
    }
    return Promise.race([
        new Promise((_, rj) => setTimeout(() => {
            timedOut = true;
            rj(new Error(options.present ? 'Element not found' : 'Element not removed'));
        }, options.timeout)),
        wait()
    ]);
}
function waitForDocumentElement(selector, options) {
    return waitFor(() => document.querySelector(selector), options);
}
function waitForDocumentElements(selector, options) {
    return waitFor(() => document.querySelectorAll(selector), options);
}

class StageComponent {
    static withResources(resources = []) {
        return new ComponentTester().withResources(resources);
    }
}
class ComponentTester {
    constructor() {
        this.resources = [];
    }
    configure(aurelia) {
        return aurelia.use.standardConfiguration();
    }
    bootstrap(configure) {
        this.configure = configure;
    }
    withResources(resources) {
        this.resources = resources;
        return this;
    }
    inView(html) {
        this.html = html;
        return this;
    }
    boundTo(bindingContext) {
        this.bindingContext = bindingContext;
        return this;
    }
    manuallyHandleLifecycle() {
        this._prepareLifecycle();
        return this;
    }
    create(bootstrap) {
        return bootstrap((aurelia) => {
            return Promise.resolve(this.configure(aurelia)).then(() => {
                if (this.resources) {
                    aurelia.use.globalResources(this.resources);
                }
                return aurelia.start().then(() => {
                    this.host = document.createElement('div');
                    this.host.innerHTML = this.html;
                    document.body.appendChild(this.host);
                    return aurelia.enhance(this.bindingContext, this.host).then(() => {
                        this.rootView = aurelia.root;
                        this.element = this.host.firstElementChild;
                        if (aurelia.root.controllers.length) {
                            this.viewModel = aurelia.root.controllers[0].viewModel;
                        }
                        return new Promise(resolve => setTimeout(() => resolve(), 0));
                    });
                });
            });
        });
    }
    dispose() {
        if (this.host === undefined || this.rootView === undefined) {
            throw new Error('Cannot call ComponentTester.dispose() before ComponentTester.create()');
        }
        this.rootView.detached();
        this.rootView.unbind();
        return this.host.parentNode.removeChild(this.host);
    }
    _prepareLifecycle() {
        const bindPrototype = View.prototype.bind;
        View.prototype.bind = () => { };
        this.bind = bindingContext => new Promise(resolve => {
            View.prototype.bind = bindPrototype;
            if (bindingContext !== undefined) {
                this.bindingContext = bindingContext;
            }
            this.rootView.bind(this.bindingContext);
            setTimeout(() => resolve(), 0);
        });
        const attachedPrototype = View.prototype.attached;
        View.prototype.attached = () => { };
        this.attached = () => new Promise(resolve => {
            View.prototype.attached = attachedPrototype;
            this.rootView.attached();
            setTimeout(() => resolve(), 0);
        });
        this.detached = () => new Promise(resolve => {
            this.rootView.detached();
            setTimeout(() => resolve(), 0);
        });
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
}

function configure(config) {
    config.globalResources([CompileSpy, ViewSpy]);
}

export { CompileSpy, ComponentTester, StageComponent, ViewSpy, configure, waitFor, waitForDocumentElement, waitForDocumentElements };
//# sourceMappingURL=aurelia-testing.js.map
