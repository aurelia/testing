import {CompileSpy} from './compile-spy';
import {ViewSpy} from './view-spy';
import {StageComponent, ComponentTester} from './component-tester';

function configure(config) {
  config.globalResources(
    './compile-spy',
    './view-spy'
  );
}

export {
  CompileSpy,
  ViewSpy,
  StageComponent,
  ComponentTester,
  configure
};
