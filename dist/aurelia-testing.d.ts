import * as LogManager from 'aurelia-logging';
import {
  View,
  customAttribute,
  TargetInstruction
} from 'aurelia-templating';
import {
  Aurelia
} from 'aurelia-framework';
import {
  inject
} from 'aurelia-dependency-injection';
import {
  DOM
} from 'aurelia-pal';
export declare const StageComponent: any;
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
  create(bootstrap: ((aurelia: Aurelia) => Promise<void>)): Promise<void>;
  dispose(): any;
}

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