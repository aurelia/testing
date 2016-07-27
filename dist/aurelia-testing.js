import * as LogManager from 'aurelia-logging';
import {View,customAttribute,TargetInstruction} from 'aurelia-templating';
import {Aurelia} from 'aurelia-framework';
import {inject} from 'aurelia-dependency-injection';
import {DOM} from 'aurelia-pal';

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
}

/**
* Attribute to be placed on any HTML element in a view to emit the View instance
* to the debug console, giving you insight into the live View instance, including
* all child views, live bindings, behaviors and more.
*/
@customAttribute('view-spy')
export class ViewSpy {
  /**
  * Creates a new instance of ViewSpy.
  */
  constructor() {
    this.logger = LogManager.getLogger('view-spy');
  }

  _log(lifecycleName, context) {
    if (!this.value && lifecycleName === 'created' ) {
      this.logger.info(lifecycleName, this.view);
    } else if (this.value && this.value.indexOf(lifecycleName) !== -1) {
      this.logger.info(lifecycleName, this.view, context);
    }
  }

  /**
  * Invoked when the target view is created.
  * @param view The target view.
  */
  created(view) {
    this.view = view;
    this._log('created');
  }

  /**
  * Invoked when the target view is bound.
  * @param bindingContext The target view's binding context.
  */
  bind(bindingContext) {
    this._log('bind', bindingContext);
  }

  /**
  * Invoked when the target element is attached to the DOM.
  */
  attached() {
    this._log('attached');
  }

  /**
  * Invoked when the target element is detached from the DOM.
  */
  detached() {
    this._log('detached');
  }

  /**
  * Invoked when the target element is unbound.
  */
  unbind() {
    this._log('unbind');
  }
}

/**
* Attribute to be placed on any element to have it emit the View Compiler's
* TargetInstruction into the debug console, giving you insight into all the
* parsed bindings, behaviors and event handers for the targeted element.
*/
@customAttribute('compile-spy')
@inject(DOM.Element, TargetInstruction)
export class CompileSpy {
  /**
  * Creates and instanse of CompileSpy.
  * @param element target element on where attribute is placed on.
  * @param instruction instructions for how the target element should be enhanced.
  */
  constructor(element, instruction) {
    LogManager.getLogger('compile-spy').info(element, instruction);
  }
}
