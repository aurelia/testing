// Generated by dts-bundle-generator v6.9.0

import { Aurelia, FrameworkConfiguration } from 'aurelia-framework';
import { IStaticResourceConfig, TargetInstruction } from 'aurelia-templating';

/**
 * Attribute to be placed on any element to have it emit the View Compiler's
 * TargetInstruction into the debug console, giving you insight into all the
 * parsed bindings, behaviors and event handers for the targeted element.
 */
export declare class CompileSpy {
	/**
	 * Creates and instanse of CompileSpy.
	 * @param element target element on where attribute is placed on.
	 * @param instruction instructions for how the target element should be enhanced.
	 */
	constructor(element: Element, instruction: TargetInstruction);
}
/**
 * Attribute to be placed on any HTML element in a view to emit the View instance
 * to the debug console, giving you insight into the live View instance, including
 * all child views, live bindings, behaviors and more.
 */
export declare class ViewSpy {
	static $resource: IStaticResourceConfig;
	private logger;
	private value;
	private view;
	/**
	 * Creates a new instance of ViewSpy.
	 */
	constructor();
	private _log;
	/**
	 * Invoked when the target view is created.
	 * @param view The target view.
	 */
	created(view: any): void;
	/**
	 * Invoked when the target view is bound.
	 * @param bindingContext The target view's binding context.
	 */
	bind(bindingContext: {}): void;
	/**
	 * Invoked when the target element is attached to the DOM.
	 */
	attached(): void;
	/**
	 * Invoked when the target element is detached from the DOM.
	 */
	detached(): void;
	/**
	 * Invoked when the target element is unbound.
	 */
	unbind(): void;
}
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
	withResources(resources: string | string[]): this;
	inView(html: string): this;
	boundTo(bindingContext: {}): this;
	manuallyHandleLifecycle(): this;
	create(bootstrap: (configure: (aurelia: Aurelia) => Promise<void>) => Promise<void>): Promise<void>;
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
}
/**
 * Generic function to wait for something to happen. Uses polling
 * @param getter: a getter function that returns anything else than `null` or an
 *                empty array or an empty jQuery object when the
 *                condition is met
 * @param options: lookup options, defaults to
 *                 `{present: true, interval: 50, timeout: 5000}`
 */
export declare function waitFor<T>(getter: () => T, options?: {
	present?: boolean;
	interval?: number;
	timeout?: number;
}): Promise<T>;
export declare function waitForDocumentElement(selector: string, options?: {
	present?: boolean;
	interval?: number;
	timeout?: number;
}): Promise<Element>;
export declare function waitForDocumentElements(selector: string, options?: {
	present?: boolean;
	interval?: number;
	timeout?: number;
}): Promise<NodeListOf<Element>>;
export declare function configure(config: FrameworkConfiguration): void;

export {};