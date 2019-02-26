import { Aurelia, FrameworkConfiguration } from 'aurelia-framework';
/**
 * Staging Component helpers to bring up basic setup for a test with ComponentTester
 */
export declare class StageComponent {
    /**
     * Create a ComponentTester for the given resources
     */
    static withResources<T = any>(resources?: string | string[]): ComponentTester<T>;
    /**
     * Create a ComponentTester instance for the given html
     */
    static inView<T = any>(html: string): ComponentTester<T>;
}
export declare class ComponentTester<T = any> {
    bind: (bindingContext: {}) => Promise<void>;
    attached: () => Promise<void>;
    detached: () => Promise<void>;
    unbind: () => Promise<void>;
    element: Element;
    viewModel: T;
    private html;
    private resources;
    private bindingContext;
    private rootView;
    private host;
    private stubbed;
    private disposed;
    constructor();
    /**
     * Apply standard configuration to an Aurelia instance.
     */
    configure(aurelia: Aurelia): FrameworkConfiguration;
    /**
     * Register a configure function to be applied when this ComponentTester initializes
     */
    bootstrap(configure: (aurelia: Aurelia) => FrameworkConfiguration): void;
    /**
     * Register resources to be applied globally when this ComponentTester initializes
     */
    withResources(resources: string | string[]): ComponentTester<T>;
    /**
     * Register test application html to create, when this ComponentTester initializes
     */
    inView(html: string): ComponentTester<T>;
    /**
     * Register an object to be used as root viewModel, when this ComponentTester initializes
     */
    boundTo(bindingContext: {}): ComponentTester<T>;
    manuallyHandleLifecycle(): ComponentTester<T>;
    /**
     * Initializes the test scene, with given bootstrapping function
     */
    create(bootstrap: (configure: (aurelia: Aurelia) => Promise<void>) => Promise<void>): Promise<void>;
    /**
     * Dispose this ComponentTester instance, detaching the view and unbind all bindings
     */
    dispose(): Element;
    private _prepareLifecycle;
    waitForElement(selector: string, options?: {
        present?: boolean;
        interval?: number;
        timeout?: number;
    }): Promise<Element>;
    waitForElements(selector: string, options?: {
        present?: boolean;
        interval?: number;
        timeout?: number;
    }): Promise<NodeListOf<Element>>;
    /**
     * Register dependencies to be ignored while loading dependencies for custom element.
     *
     * Only works with dependencies registered via `<require from="...">` usage
     * Dependencies are expected to be in absolute path
     */
    ignoreDependencies(...deps: string[]): this;
}
