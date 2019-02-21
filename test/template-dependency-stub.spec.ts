import { stubTemplateDependency, resetStubbedTemplateDependencies } from '../src/template-depency-stub';
import { StageComponent } from '../src/component-tester';
import { bootstrap } from 'aurelia-bootstrapper';

describe('Template dependency stubbing', () => {

  describe('stubTemplateDependency()', () => {

    it('prevents the matching dependency from being loaded even if a template <require>s it', async () => {
      stubTemplateDependency('dist/test/test/resources/my-component');

      const component = await StageComponent
        .withResources('dist/test/test/resources/my-parent-component')
        .inView('<my-parent-component></my-parent-component>');
      await component.create(bootstrap);

      let subComponent = component.element.firstElementChild as HTMLElement;
      expect(subComponent.tagName.toLowerCase()).toEqual('my-component');
      expect(subComponent.innerHTML.trim()).toEqual('');

      await component.dispose();

      resetStubbedTemplateDependencies();
      await component.create(bootstrap);

      subComponent = component.element.firstElementChild as HTMLElement;
      expect(subComponent.innerHTML.trim()).not.toEqual('');

      await component.dispose();
    });
  });
});
