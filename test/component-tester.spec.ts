import { StageComponent, ComponentTester } from '../src/aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import { PLATFORM } from 'aurelia-pal';

describe('ComponentTester', () => {
  let component: ComponentTester;

  beforeEach(() => {
    debugger
    component = StageComponent
      .withResources(PLATFORM.moduleName('resources/my-component'))
      .inView(`<div>
                 <div class="component-tester-spec">
                   <my-component first-name.bind="firstName"></my-component>
                 </div>
                 <div class="component-tester-spec">
                   Number two
                 </div>
               </div>`)
      .boundTo({ firstName: 'Bob' });
  });

  it('should wait for a child element', (done) => {
    component.create(bootstrap)
      .then(() => {
        return component.waitForElement('my-component');
      })
      .then((element) => {
        expect(element.nodeName.toLowerCase()).toEqual('my-component');
        done();
      })
      .catch(done.fail);
  });

  it('should wait for multiple child elements', (done) => {
    component.create(bootstrap)
      .then(() => {
        return component.waitForElements('.component-tester-spec');
      })
      .then((elements) => {
        expect(elements.length).toBe(2);
        done();
      })
      .catch(done.fail);
  });

  afterEach(() => {
    component.dispose();
  });
});
