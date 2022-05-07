import { StageComponent, ComponentTester } from '../src/aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import { PLATFORM } from 'aurelia-pal';

describe('SampleCustomComponent', () => {
  let component: ComponentTester;

  beforeEach(() => {
    component = StageComponent
      .withResources(PLATFORM.moduleName('resources/my-component'))
      .inView('<my-component first-name.bind="firstName"></my-component>')
      .boundTo({ firstName: 'Bob' });
  });

  it('should render first name', done => {
    component.create(bootstrap)
      .then(() => {
        const nameElement = document.querySelector('.firstName') as Element;
        expect(nameElement.innerHTML).toBe('Bob');
        done();
      })
      .catch(done.fail);
  });

  afterEach(() => {
    component.dispose();
  });
});

describe('SampleCustomAttribute', () => {
  let component: ComponentTester;

  beforeEach(() => {
    component = StageComponent
      .withResources(PLATFORM.moduleName('resources/my-attribute'))
      .inView('<div my-attribute.bind="color">Bob</div>')
      .boundTo({ color: 'blue' });
  });

  it('should set the background color to provided color', done => {
    component.create(bootstrap)
      .then(() => {
        expect((component.element as HTMLElement).style.backgroundColor).toBe('blue');
        done();
      })
      .catch(done.fail);
  });

  afterEach(() => {
    component.dispose();
  });
});
