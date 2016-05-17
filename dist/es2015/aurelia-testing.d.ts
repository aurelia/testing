declare module 'aurelia-testing' {
  import {
    bootstrap
  } from 'aurelia-bootstrapper';
  import {
    View
  } from 'aurelia-templating';
  import {
    Aurelia
  } from 'aurelia-framework';
  export const StageComponent: any;
  export class ComponentTester {
    bind: ((bindingContext: any) => void);
    attached: (() => void);
    unbind: (() => void);
    dispose: (() => Promise<any>);
    element: Element;
    viewModel: any;
    configure: any;
    _html: string;
    _resources: string | string[];
    _bindingContext: any;
    _rootView: View;
    bootstrap(configure: ((aurelia: Aurelia) => void)): any;
    withResources(resources: string | string[]): ComponentTester;
    inView(html: string): ComponentTester;
    boundTo(bindingContext: any): ComponentTester;
    manuallyHandleLifecycle(): ComponentTester;
    create(): Promise<void>;
  }
}