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
  element: Element;
  viewModel: any;
  configure = aurelia => aurelia.use.standardConfiguration();
  _html: string;
  _resources: string | string[] = [];
  _bindingContext: any;
  _rootView: View;

  waitOptions = {
    interval: 50,
    timeout: 5000
  };
  
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

  create(bootstrap: (aurelia: Aurelia) => Promise<void>): Promise<void> {
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
  
  waitForElement(getter: () => any, options: any): Promise<Element> {

    // prevents infinite recursion if the request times out
    var timedOut = false;

    options = Object.assign({
      present: true
    }, this.waitOptions, options);


    function wait() {
      var element = getter(),
        // boolean is needed here, hence the length > 0
        found = element !== null && (!element.jquery || element.length > 0);

      if (!options.present^found || timedOut) {
        return Promise.resolve(element);
      }

      return new Promise(rs => setTimeout(rs, options.interval)).then(wait);
    }

    return Promise.race([
      new Promise((rs, rj) => setTimeout(() => {
          timedOut = true;
          rj(options.present ? 'Element not found' : 'Element not removed');
        }, options.timeout)
      ),
      wait()
    ]);
  }
}
