import {StageComponent} from '../src/component-tester';
import {bootstrap} from 'aurelia-bootstrapper';
import {Container} from 'aurelia-dependency-injection';

describe('SampleCustomComponent', () => {
  let component;

  beforeEach(() => {
    component = StageComponent
      .withResources('test/resources/my-component')
      .inView('<my-component first-name.bind="firstName"></my-component>')
      .boundTo({ firstName: 'Bob' });
  });

  it('should render first name', done => {
    component.create(bootstrap).then(() => {
      const nameElement = document.querySelector('.firstName');
      expect(nameElement.innerHTML).toBe('Bob');
      done();
    });
  });

  afterEach(() => {
    component.dispose();
  });
});

describe('SampleCustomAttribute', () => {
  let component;

  beforeEach(() => {
    component = StageComponent
        .withResources('test/resources/my-attribute')
        .inView('<div my-attribute.bind="color">Bob</div>')
        .boundTo({ color: 'blue' });
  });

  it('should set the background color to provided color', done => {
     component.create(bootstrap).then(() => {
       expect(component.element.style.backgroundColor).toBe('blue');
       done();
     });
  });

  afterEach(() => {
    component.dispose();
  });
});
