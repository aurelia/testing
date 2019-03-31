import './setup';
import { StageComponent, ComponentTester } from '../src/component-tester';
import { bootstrap } from 'aurelia-bootstrapper';

describe('ComponentTester', () => {
  let component: ComponentTester;

  beforeEach(() => {
    component = StageComponent
      .withResources('test/resources/my-component')
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

  it('should wait for a child element', async () => {
    await component.create(bootstrap);
    const element = await component.waitForElement('my-component');

    expect(element.nodeName.toLowerCase()).toEqual('my-component');
  });

  it('should wait for multiple child elements', async () => {
    await component.create(bootstrap);
    const elements = await component.waitForElements('.component-tester-spec');

    expect(elements.length).toBe(2);
  });

  afterEach(() => {
    component.dispose();
  });
});
