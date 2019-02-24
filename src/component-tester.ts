import { View, HtmlBehaviorResource, ResourceLoadContext, ViewStrategy } from 'aurelia-templating';
import { Aurelia, FrameworkConfiguration, Loader, TemplateDependency, TemplateRegistryEntry, Container } from 'aurelia-framework';
import { waitFor } from './wait';

const originalLoad = HtmlBehaviorResource.prototype.load;

interface AureliaWithRoot extends Aurelia {
  root: ViewWithControllers;
}

interface ViewWithControllers extends View {
  controllers: {viewModel: any}[];
}

export class StageComponent {
  public static withResources<T = any>(resources: string | string[] = []): ComponentTester<T> {
    return new ComponentTester().withResources(resources);
  }
}

export class ComponentTester<T = any> {
  public bind: (bindingContext: {}) => Promise<void>;
  public attached: () => Promise<void>;
  public detached: () => Promise<void>;
  public unbind: () => Promise<void>;
  public element: Element;
  public viewModel: T;

  private html: string;
  private resources: string | string[] = [];
  private bindingContext: {};
  private rootView: View;
  private host: HTMLDivElement;

  public configure(aurelia: Aurelia): FrameworkConfiguration {
    return aurelia.use.standardConfiguration();
  }

  public bootstrap(configure: (aurelia: Aurelia) => FrameworkConfiguration) {
    this.configure = configure;
  }

  public withResources(resources: string | string[]): ComponentTester<T> {
    this.resources = resources;
    return this;
  }

  public inView(html: string): ComponentTester<T> {
    this.html = html;
    return this;
  }

  public boundTo(bindingContext: {}): ComponentTester<T> {
    this.bindingContext = bindingContext;
    return this;
  }

  public manuallyHandleLifecycle(): ComponentTester<T> {
    this._prepareLifecycle();
    return this;
  }

  public create(bootstrap: (configure: (aurelia: Aurelia) => Promise<void>) => Promise<void>): Promise<void> {
    return bootstrap((aurelia: AureliaWithRoot) => {

      const loader = aurelia.loader;
      const newLoader = new (loader as any).constructor();
      (loader as any).name = 'original-loader';

      aurelia.loader = newLoader;
      aurelia.container.unregister(Loader);
      aurelia.container.registerInstance(Loader, newLoader);

      return Promise.resolve(this.configure(aurelia)).then(() => {
        if (this.resources) {
          aurelia.use.globalResources(this.resources);
        }

        if (Array.isArray(this.stubbed)) {
          const component = this;
          const originalLoadtemplate = aurelia.loader.loadTemplate;
          aurelia.loader.loadTemplate = async function(url: string): Promise<TemplateRegistryEntry> {
            const entry = await originalLoadtemplate.call(this, url) as TemplateRegistryEntry;
            entry.dependencies = entry.dependencies.filter((d: TemplateDependency) => !component.stubbed.includes(d.src));
            return entry;
          }

          if (HtmlBehaviorResource.prototype.load === originalLoad) {
            HtmlBehaviorResource.prototype.load = async function(
              container: Container,
              target: Function,
              loadContext?: ResourceLoadContext,
              viewStrategy?: ViewStrategy,
              _transientView?: boolean
            ) {
              // reset every load
              this.viewFactory = undefined;
              const factory = await originalLoad.call(this, container, target, loadContext, viewStrategy, true);
              return factory;
            }
          }
        }


        return aurelia.start().then(() => {
          this.host = document.createElement('div');
          this.host.innerHTML = this.html;

          document.body.appendChild(this.host);

          return aurelia.enhance(this.bindingContext, this.host).then(() => {
            this.rootView = aurelia.root;
            this.element = this.host.firstElementChild as Element;

            if (aurelia.root.controllers.length) {
              this.viewModel = aurelia.root.controllers[0].viewModel;
            }

            return new Promise(resolve => setTimeout(() => resolve(), 0)) as Promise<void>;
          });
        });
      });
    });
  }

  public dispose(): Element {
    if (this.host === undefined || this.rootView === undefined) {
      throw new Error(
        'Cannot call ComponentTester.dispose() before ComponentTester.create()'
      );
    }

    this.rootView.detached();
    this.rootView.unbind();

    if (HtmlBehaviorResource.prototype.load !== originalLoad) {
      HtmlBehaviorResource.prototype.load = originalLoad;
    }

    return (this.host.parentNode as Node).removeChild(this.host);
  }

  private _prepareLifecycle() {
    // bind
    const bindPrototype = View.prototype.bind;
    // tslint:disable-next-line:no-empty
    View.prototype.bind = () => {};
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
    View.prototype.attached = () => {};
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

  public waitForElement(selector: string, options?: {
    present?: boolean,
    interval?: number,
    timeout?: number
  }): Promise<Element> {
    return waitFor(() => this.element.querySelector(selector) as Element, options);
  }

  public waitForElements(selector: string, options?: {
    present?: boolean,
    interval?: number,
    timeout?: number
  }): Promise<NodeListOf<Element>> {
    return waitFor(() => this.element.querySelectorAll(selector) as NodeListOf<Element>, options);
  }

  stubbed: string[] = [];
  public stubDependencies(...deps: string[]): this {
    this.stubbed = deps;
    // if (this.host === undefined || this.rootView === undefined) {
    //   throw new Error(
    //     'Cannot call ComponentTester.stubDependencies() before ComponentTester.create()'
    //   );
    // }
    return this;
  }
}
