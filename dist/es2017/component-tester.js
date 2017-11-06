import { View } from 'aurelia-templating';
import { waitFor } from './wait';
export class StageComponent {
    static withResources(resources = []) {
        return new ComponentTester().withResources(resources);
    }
}
export class ComponentTester {
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
}
