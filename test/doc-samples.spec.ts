import { StageComponent, ComponentTester } from '../src/component-tester';
import { bootstrap } from 'aurelia-bootstrapper';

describe('SampleCustomComponent', () => {
  let component: ComponentTester;

  beforeEach(() => {
    component = StageComponent
      .withResources('dist/test/test/resources/my-component')
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
      .catch(error => {
        fail(error);
        done();
      });
  });

  afterEach(() => {
    component.dispose();
  });
});

describe('SampleCustomAttribute', () => {
  let component: ComponentTester;

  beforeEach(() => {
    component = StageComponent
      .withResources('dist/test/test/resources/my-attribute')
      .inView('<div my-attribute.bind="color">Bob</div>')
      .boundTo({ color: 'blue' });
  });

  it('should set the background color to provided color', done => {
    component.create(bootstrap)
      .then(() => {
        expect((component.element as HTMLElement).style.backgroundColor).toBe('blue');
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
