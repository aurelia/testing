import {bootstrap} from 'aurelia-bootstrapper';
import {View} from 'aurelia-templating';
import {Aurelia} from 'aurelia-framework';

export const StageComponent = {
  withResources(resources): ComponentTester {
    return new ComponentTester().withResources(resources);
  }
};

export class ComponentTester {
  bind: (bindingContext: any) => void;
  attached: () => void;
  unbind: () => void;
  dispose: () => Promise<any>;
  element: Element;
  viewModel: any;
  configure = aurelia => aurelia.use.standardConfiguration();
  _html: string;
  _resources: string | string[] = [];
  _bindingContext: any;
  _rootView: View;

  bootstrap(configure: (aurelia: Aurelia) => void) {
    this.configure = configure;
  }

  withResources(resources: string | string[]): ComponentTester {
    this._resources = resources;
    return this;
  }

  inView(html: string): ComponentTester {
    this._html = html;
    return this;
  }

  boundTo(bindingContext: any): ComponentTester {
    this._bindingContext = bindingContext;
    return this;
  }

  manuallyHandleLifecycle(): ComponentTester {
    this._prepareLifecycle();
    return this;
  }

  create(): Promise<void> {
    return bootstrap(aurelia => {
      return Promise.resolve(this.configure(aurelia)).then(() => {
        aurelia.use.globalResources(this._resources);
        return aurelia.start().then(a => {
          let host = document.createElement('div');
          host.innerHTML = this._html;
          document.body.appendChild(host);
          aurelia.enhance(this._bindingContext, host);
          this._rootView = aurelia.root;
          this.element = host.firstElementChild;
          if (aurelia.root.controllers.length) {
            this.viewModel = aurelia.root.controllers[0].viewModel;
          }
          this.dispose = () => host.parentNode.removeChild(host);
          return new Promise(resolve => setTimeout(() => resolve(), 0));
        });
      });
    });
  }

  _prepareLifecycle() {
    // bind
    const bindPrototype = View.prototype.bind;
    View.prototype.bind = () => {};
    this.bind = bindingContext => new Promise(resolve => {
      View.prototype.bind = bindPrototype;
      if (bindingContext !== undefined) {
        this._bindingContext = bindingContext;
      }
      this._rootView.bind(this._bindingContext);
      setTimeout(() => resolve(), 0);
    });

    // attached
    const attachedPrototype = View.prototype.attached;
    View.prototype.attached = () => {};
    this.attached = () => new Promise(resolve => {
      View.prototype.attached = attachedPrototype;
      this._rootView.attached();
      setTimeout(() => resolve(), 0);
    });

    // detached
    this.detached = () => new Promise(resolve => {
      this._rootView.detached();
      setTimeout(() => resolve(), 0);
    });

    // unbind
    this.unbind = () => new Promise(resolve => {
      this._rootView.unbind();
      setTimeout(() => resolve(), 0);
    });
  }
}
