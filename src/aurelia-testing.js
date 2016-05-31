import {CompileSpy} from './compile-spy';
import {ViewSpy} from './view-spy';

function configure(config) {
  config.globalResources(
    './compile-spy',
    './view-spy'
  );
}

export {
  CompileSpy,
  ViewSpy,
  configure
};
