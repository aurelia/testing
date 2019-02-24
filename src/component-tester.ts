import { View, HtmlBehaviorResource, ResourceLoadContext, ViewStrategy } from 'aurelia-templating';
import {
  Container
} from 'aurelia-dependency-injection';
import {
  TemplateDependency,
  TemplateRegistryEntry,
  Loader
} from 'aurelia-loader';
import { waitFor } from './wait';
import {
  Aurelia,
  FrameworkConfiguration
} from 'aurelia-framework';

const originalLoad = HtmlBehaviorResource.prototype.load;

interface AureliaWithRoot extends Aurelia {
  root: ViewWithControllers;
}

interface ViewWithControllers extends View {
  controllers: {viewModel: any}[];
}

/**
 * Staging Component helpers to bring up basic setup for a test with ComponentTester
 */
export class StageComponent {

  /**
   * Create a ComponentTester for the given resources
   */
  public static withResources<T = any>(resources: string | string[] = []): ComponentTester<T> {
    return new ComponentTester().withResources(resources);
  }

  /**
   * Create a ComponentTester instance for the given html
   */
  public static inView<T = any>(html: string): ComponentTester<T> {
    return new ComponentTester().inView(html);
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
  private stubbed: string[];

  /**
   * Apply standard configuration to an Aurelia instance.
   */
  public configure(aurelia: Aurelia): FrameworkConfiguration {
    return aurelia.use.standardConfiguration();
  }

  /**
   * Register a configure function to be applied when this ComponentTester initializes
   */
  public bootstrap(configure: (aurelia: Aurelia) => FrameworkConfiguration) {
    this.configure = configure;
  }

  /**
   * Register resources to be applied globally when this ComponentTester initializes
   */
  public withResources(resources: string | string[]): ComponentTester<T> {
    this.resources = resources;
    return this;
  }

  /**
   * Register test application html to create, when this ComponentTester initializes
   */
  public inView(html: string): ComponentTester<T> {
    this.html = html;
    return this;
  }

  /**
   * Register an object to be used as root viewModel, when this ComponentTester initializes
   */
  public boundTo(bindingContext: {}): ComponentTester<T> {
    this.bindingContext = bindingContext;
    return this;
  }

  public manuallyHandleLifecycle(): ComponentTester<T> {
    this._prepareLifecycle();
    return this;
  }

  /**
   * Initializes the test scene, with given bootstrapping function
   */
  public create(bootstrap: (configure: (aurelia: Aurelia) => Promise<void>) => Promise<void>): Promise<void> {
    return bootstrap(async (aurelia: AureliaWithRoot) => {

      const loader = aurelia.loader;
      const newLoader = new (loader as any).constructor();

      // remove reference to old loader
      aurelia.container.unregister(Loader);
      // register new loader in both property loader and container
      // property for framework configuration
      aurelia.loader = newLoader;
      // container for templating resources/templating
      aurelia.container.registerInstance(Loader, newLoader);

      await this.configure(aurelia);

      if (this.resources) {
        aurelia.use.globalResources(this.resources);
      }

      if (Array.isArray(this.stubbed)) {
        // tslint:disable-next-line:no-this-assignment
        const component = this;
        const originalLoadtemplate = aurelia.loader.loadTemplate;

        // overriding loadTemplate method of loader to filter stubbed dependencies
        aurelia.loader.loadTemplate = async function(url: string): Promise<TemplateRegistryEntry> {
          const entry = await originalLoadtemplate.call(this, url) as TemplateRegistryEntry;
          entry.dependencies = entry.dependencies.filter((d: TemplateDependency) => !component.stubbed.includes(d.src));
          return entry;
        };

        if (HtmlBehaviorResource.prototype.load === originalLoad) {
          HtmlBehaviorResource.prototype.load = async function(
            container: Container,
            // tslint:disable-next-line:ban-types
            target: Function,
            loadContext?: ResourceLoadContext,
            viewStrategy?: ViewStrategy
          ) {
            // reset every load
            // so that subsequent load of the same class in different tests won't get old view factory
            // with modified dependencies
            this.viewFactory = undefined;
            return originalLoad.call(this, container, target, loadContext, viewStrategy, true);
          };
        }
      }

      await aurelia.start();
      this.host = document.createElement('div');
      this.host.innerHTML = this.html;

      document.body.appendChild(this.host);

      await aurelia.enhance(this.bindingContext, this.host);

      const rootView: ViewWithControllers = aurelia.root;
      this.rootView = rootView;
      this.element = this.host.firstElementChild as Element;

      if (rootView.controllers.length) {
        this.viewModel = rootView.controllers[0].viewModel;
      }

      return new Promise(resolve => setTimeout(() => resolve(), 0)) as Promise<void>;
    });
  }

  /**
   * Dispose this ComponentTester instance, detaching the view and unbind all bindings
   */
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

  /**
   * Register dependencies to be ignored while loading dependencies for custom element
   */
  public stubDependencies(...deps: string[]): this {
    this.stubbed = deps;
    return this;
  }
}
