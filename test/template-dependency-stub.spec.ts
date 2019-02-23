import './setup';
import { stubTemplateDependency, resetStubbedTemplateDependencies } from '../src/template-depency-stub';
import { StageComponent } from '../src/component-tester';
import { bootstrap } from 'aurelia-bootstrapper';
import { PLATFORM } from 'aurelia-pal';

PLATFORM.moduleName('test/resources/my-parent-component');
PLATFORM.moduleName('test/resources/my-component');

fdescribe('Template dependency stubbing', () => {

  describe('stubTemplateDependency()', () => {

    it('prevents the matching dependency from being loaded even if a template <require>s it', async () => {
      stubTemplateDependency('test/resources/my-component');

      const component = await StageComponent
        .withResources('test/resources/my-parent-component')
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
