import {CompileSpy} from './compile-spy';
import {ViewSpy} from './view-spy';
import {StageComponent, ComponentTester} from './component-tester';
import {HttpClientMock} from './http-client-mock';
import {waitFor, waitForDocumentElement, waitForDocumentElements} from './wait';

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
  HttpClientMock,
  configure,
  waitFor,
  waitForDocumentElement,
  waitForDocumentElements
};
