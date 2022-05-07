import { Aurelia, FrameworkConfiguration } from 'aurelia-framework';
export declare class StageComponent {
    static withResources<T = any>(resources?: string | string[]): ComponentTester<T>;
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
    configure(aurelia: Aurelia): FrameworkConfiguration;
    bootstrap(configure: (aurelia: Aurelia) => FrameworkConfiguration): void;
    withResources(resources: string | string[]): ComponentTester<T>;
    inView(html: string): ComponentTester<T>;
    boundTo(bindingContext: {}): ComponentTester<T>;
    manuallyHandleLifecycle(): ComponentTester<T>;
    create(bootstrap: (configure: (aurelia: Aurelia) => Promise<void>) => Promise<void>): Promise<void>;
    dispose(): Element;
    private _prepareLifecycle();
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
}
