import * as LogManager from 'aurelia-logging';
import {
  customAttribute,
  TargetInstruction,
  View
} from 'aurelia-templating';
import {
  inject
} from 'aurelia-dependency-injection';
import {
  DOM
} from 'aurelia-pal';
import {
  Aurelia
} from 'aurelia-framework';

/**
 * Generic function to wait for something to happen. Uses polling
 * @param getter: a getter function that returns anything else than `null` or an
 *                empty array or an empty jQuery object when the
 *                condition is met
 * @param options: lookup options, defaults to
 *                 `{present: true, interval: 50, timeout: 5000}`
 */
export declare function waitFor(getter: (() => any), options: any): Promise<any>;
export declare function waitForDocumentElement(selector: string, options: any): Promise<Element>;
export declare function waitForDocumentElements(selector: string, options: any): Promise<Element>;

/**
* Attribute to be placed on any HTML element in a view to emit the View instance
* to the debug console, giving you insight into the live View instance, including
* all child views, live bindings, behaviors and more.
*/
export declare class ViewSpy {
  
  /**
    * Creates a new instance of ViewSpy.
    */
  constructor();
  
  /**
    * Invoked when the target view is created.
    * @param view The target view.
    */
  created(view?: any): any;
  
  /**
    * Invoked when the target view is bound.
    * @param bindingContext The target view's binding context.
    */
  bind(bindingContext?: any): any;
  
  /**
    * Invoked when the target element is attached to the DOM.
    */
  attached(): any;
  
  /**
    * Invoked when the target element is detached from the DOM.
    */
  detached(): any;
  
  /**
    * Invoked when the target element is unbound.
    */
  unbind(): any;
}

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
  constructor(element?: any, instruction?: any);
}
export declare class StageComponent {
  static withResources(resources?: string | string[]): ComponentTester;
}
export declare class ComponentTester {
  bind: ((bindingContext: any) => void);
  attached: (() => void);
  unbind: (() => void);
  element: Element;
  viewModel: any;
  configure: any;
  bootstrap(configure: ((aurelia: Aurelia) => void)): any;
  withResources(resources: string | string[]): ComponentTester;
  inView(html: string): ComponentTester;
  boundTo(bindingContext: any): ComponentTester;
  manuallyHandleLifecycle(): ComponentTester;
  create(bootstrap: ((configure: ((aurelia: Aurelia) => Promise<void>)) => Promise<void>)): Promise<void>;
  dispose(): any;
  waitForElement(selector: string, options: any): Promise<Element>;
  waitForElements(selector: string, options: any): Promise<Element>;
}