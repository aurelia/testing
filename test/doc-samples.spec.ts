import { bootstrap } from 'aurelia-bootstrapper';
import { StageComponent } from '../src/component-tester';
import './setup';

describe('SampleCustomComponent', () => {

  it('should render first name', async () => {

    const component = StageComponent
      .withResources('test/resources/my-component')
      .inView('<my-component first-name.bind="firstName"></my-component>')
      .boundTo({ firstName: 'Bob' });
    await component.create(bootstrap);
    const nameElement = (document.querySelector('.firstName') as Element);
    expect(nameElement.innerHTML).toBe('Bob');

    component.dispose();
  });

});

describe('SampleCustomAttribute', () => {

  it('should set the background color to provided color', async () => {
    const component = StageComponent
      .withResources('test/resources/my-attribute')
      .inView('<div my-attribute.bind="color">Bob</div>')
      .boundTo({ color: 'blue' });

    await component.create(bootstrap);
    expect((component.element as HTMLElement).style.backgroundColor).toBe('blue');

    component.dispose();
  });
});
