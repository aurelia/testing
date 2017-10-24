import { FrameworkConfiguration } from 'aurelia-framework';
export * from './compile-spy';
export * from './view-spy';
export * from './component-tester';
export * from './wait';

export function configure(config: FrameworkConfiguration) {
  config.globalResources([
    './compile-spy',
    './view-spy'
  ]);
}
