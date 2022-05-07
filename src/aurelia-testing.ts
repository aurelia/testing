import type { FrameworkConfiguration } from 'aurelia-framework';
import { CompileSpy } from './compile-spy';
import { ViewSpy } from './view-spy';

export * from './compile-spy';
export * from './view-spy';
export * from './component-tester';
export * from './wait';

export function configure(config: FrameworkConfiguration) {
  config.globalResources([CompileSpy, ViewSpy]);
}
