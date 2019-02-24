import './setup';
import { StageComponent } from '../src/component-tester';
import { bootstrap } from 'aurelia-bootstrapper';
import { PLATFORM } from 'aurelia-pal';

PLATFORM.moduleName('test/resources/my-parent-component');
PLATFORM.moduleName('test/resources/my-component');
PLATFORM.moduleName('test/resources/composes/compose-1');
PLATFORM.moduleName('test/resources/composes/compose-2');

fdescribe('Template dependency stubbing', () => {

  describe('with normal custom element', () => {

    it('prevents the matching dependency from being loaded even if a template <require>s it', async () => {
      // stubTemplateDependency('test/resources/my-component');

      let component = await StageComponent
        .withResources('test/resources/my-parent-component')
        .inView('<my-parent-component></my-parent-component>')
        .stubDependencies('test/resources/my-component');
      await component.create(bootstrap);

      let subComponent = component.element.firstElementChild as HTMLElement;
      expect(subComponent.tagName.toLowerCase()).toEqual('my-component');
      expect(subComponent.innerHTML.trim()).toEqual('');

      await component.dispose();

      // resetStubbedTemplateDependencies();
      component = StageComponent
        .withResources('test/resources/my-parent-component')
        .inView('<my-parent-component></my-parent-component>');
      await component.create(bootstrap);

      subComponent = component.element.firstElementChild as HTMLElement;
      expect(subComponent.tagName.toLowerCase()).toEqual('my-component');
      expect(subComponent.innerHTML.trim()).not.toEqual('');

      await component.dispose();
    });
  });

  fdescribe('with compose()', () => {

    it('discard <compose/> dependencies', async () => {

      let component = await StageComponent
        .withResources()
        .inView('<compose view="test/resources/composes/compose-1.html"></compose>')
        .stubDependencies('test/resources/composes/compose-2')
        .boundTo({ message: 'Hello from Component tester' });

      await component.create(bootstrap);
      await new Promise(r => setTimeout(r, 100));
      debugger;
      let subComponent = component.element as HTMLElement;
      expect(subComponent.textContent!.trim()).toEqual('Hello from Component tester');

      await component.dispose();
    });
  });
});
