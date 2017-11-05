import { StageComponent, ComponentTester } from '../src/component-tester';
import { bootstrap } from 'aurelia-bootstrapper';

describe('ComponentTester', () => {
  let component: ComponentTester;

  beforeEach(() => {
    component = StageComponent
      .withResources('dist/test/test/resources/my-component')
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
      .catch(error => {
        fail(error);
        done();
      });
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
      .catch(error => {
        fail(error);
        done();
      });
  });

  afterEach(() => {
    component.dispose();
  });
});
