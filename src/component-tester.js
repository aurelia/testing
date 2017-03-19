import {View} from 'aurelia-templating';
import {Aurelia} from 'aurelia-framework';
import {waitFor} from './wait';

export class StageComponent {
  static withResources(resources?: string | string[]): ComponentTester {
    return new ComponentTester().withResources(resources);
  }
}

export class ComponentTester {
  bind: (bindingContext: any) => void;
  attached: () => void;
  unbind: () => void;
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

  create(bootstrap: (configure: (aurelia: Aurelia) => Promise<void>) => Promise<void>): Promise<void> {
    return bootstrap(aurelia => {
      return Promise.resolve(this.configure(aurelia)).then(() => {
        if (this._resources) {
          aurelia.use.globalResources(this._resources);
        }

        return aurelia.start().then(a => {
          this.host = document.createElement('div');
          this.host.innerHTML = this._html;

          document.body.appendChild(this.host);

          return aurelia.enhance(this._bindingContext, this.host).then(() => {
            this._rootView = aurelia.root;
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
    if (this.host === undefined || this._rootView === undefined) {
      throw new Error(
        'Cannot call ComponentTester.dispose() before ComponentTester.create()'
      );
    }

    this._rootView.detached();
    this._rootView.unbind();

    return this.host.parentNode.removeChild(this.host);
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

  waitForElement(selector: string, options: any): Promise<Element> {
    return waitFor(() => this.element.querySelector(selector), options);
  }

  waitForElements(selector: string, options: any): Promise<Element> {
    return waitFor(() => this.element.querySelectorAll(selector), options);
  }
}
