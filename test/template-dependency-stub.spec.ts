import './setup';
import { StageComponent } from '../src/component-tester';
import { bootstrap } from 'aurelia-bootstrapper';

describe('Template dependency stubbing', () => {

  it('ignores deps per ComponentTesterInstance', async () => {
    const component1 = await StageComponent
      .withResources(['test/resources/no-deps/el1', 'test/resources/no-deps/el2'])
      .inView('<el1></el1><el2><el1></el1></el2>')
      .ignoreDependencies('test/resources/no-deps/el2');

    const component2 = await StageComponent
      .withResources(['test/resources/no-deps/el1', 'test/resources/no-deps/el2'])
      .inView('<el1></el1><el2><el1></el1></el2>')
      .ignoreDependencies('test/resources/no-deps/el1');

    await Promise.all([
      component1.create(bootstrap),
      component2.create(bootstrap)
    ]);

    // component1 works
    expect(component1['host'].textContent).toEqual('el1el1', 'component1.host.textContent');
    component1['host'].querySelectorAll('.au-target').forEach(el => {
      el.removeAttribute('class');
      el.removeAttribute('au-target-id');
    });
    expect(component1['host'].innerHTML).toEqual(
      '<el1>el1</el1><el2><el1>el1</el1></el2>',
      'component1.host.innerHTML'
    );
    component1.dispose();

    // component2 works
    expect(component2['host'].textContent).toEqual('el2', 'component2.textContent');
    component2['host'].querySelectorAll('.au-target').forEach(el => {
      el.removeAttribute('class');
      el.removeAttribute('au-target-id');
    });
    expect(component2['host'].innerHTML).toEqual(
      '<el1></el1><el2>el2</el2>',
      'component2.host.innerHTML'
    );

    component2.dispose();
  });

  describe('with global resources', () => {
    it('discards globally declared resources', async () => {
      const component = await StageComponent
        .withResources(['test/resources/no-deps/el1', 'test/resources/no-deps/el2'])
        .inView('<el1></el1><el2><el1></el1></el2>')
        .ignoreDependencies('test/resources/no-deps/el2');
      await component.create(bootstrap);

      expect(component['host'].textContent).toEqual('el1el1', 'host.textContent');
      component['host'].querySelectorAll('.au-target').forEach(el => {
        el.removeAttribute('class');
        el.removeAttribute('au-target-id');
      });
      expect(component['host'].innerHTML).toEqual(
        '<el1>el1</el1><el2><el1>el1</el1></el2>',
        'host.innerHTML'
      );
      component.dispose();
    });

    it('works with all deps discarded', async () => {
      const component = await StageComponent
        .withResources(['test/resources/no-deps/el1', 'test/resources/no-deps/el2'])
        .inView('<el1></el1><el2><el1></el1></el2>')
        .ignoreDependencies('test/resources/no-deps/el1', 'test/resources/no-deps/el2');
      await component.create(bootstrap);

      expect(component['host'].textContent).toEqual('', 'host.textContent');
      expect(component['host'].innerHTML).toEqual(
        '<el1></el1><el2><el1></el1></el2>',
        'host.innerHTML'
      );
      component.dispose();
    });
  });

  describe('with normal custom element', () => {

    it('prevents the matching dependency from being loaded even if a template <require>s it', async () => {
      let component = await StageComponent
        .withResources('test/resources/my-parent-component')
        .inView('<my-parent-component></my-parent-component>')
        .ignoreDependencies('test/resources/my-component');
      await component.create(bootstrap);

      let subComponent = component.element.firstElementChild as HTMLElement;
      expect(subComponent.tagName.toLowerCase()).toEqual('my-component');
      expect(subComponent.innerHTML.trim()).toEqual('');

      await component.dispose();

      component = StageComponent
        .withResources('test/resources/my-parent-component')
        .inView('<my-parent-component></my-parent-component>');
      await component.create(bootstrap);

      subComponent = component.element.firstElementChild as HTMLElement;
      expect(subComponent.tagName.toLowerCase()).toEqual('my-component');
      expect(subComponent.innerHTML.trim()).not.toEqual('');

      await component.dispose();
    });

    it('discards html only custom element', async () => {
      const component = await StageComponent
        .withResources('test/resources/html-only/html-only1.html')
        .inView('<html-only1></html-only1>')
        .ignoreDependencies('test/resources/html-only/html-only2.html');
      await component.create(bootstrap);

      const subComponent = component.element as HTMLElement;
      expect(subComponent.tagName.toLowerCase()).toEqual('html-only1');
      expect(subComponent.textContent!.trim()).toEqual('html-only1');

      await component.dispose();
    });
  });

  describe('with compose()', () => {

    it('discard <compose/> dependencies using view only', async () => {
      let component = await StageComponent
        .withResources()
        .inView('<compose view="test/resources/composes/compose-1.html"></compose>')
        .ignoreDependencies('test/resources/composes/compose-2')
        .boundTo({ message: 'Hello from Component tester' });

      await component.create(bootstrap);
      let subComponent = component.element as HTMLElement;
      expect(subComponent.textContent!.trim()).toEqual('Hello from Component tester');

      await component.dispose();

      component = await StageComponent
        .withResources()
        .inView('<compose view="test/resources/composes/compose-1.html"></compose>')
        .ignoreDependencies()
        .boundTo({ message: 'Hello from Component tester' });

      await component.create(bootstrap);
      subComponent = component.element as HTMLElement;
      expect(subComponent.textContent!.trim().includes('compose2')).toEqual(true, 'textContent.includes(compose2)');

      await component.dispose();
    });

    it('discard <compose/> dependencies using view model', async () => {
      let component = await StageComponent
        .withResources()
        .inView('<compose view-model="test/resources/composes/compose-1"></compose>')
        .ignoreDependencies('test/resources/composes/compose-2')
        .boundTo({ message: 'Hello from Component tester' });

      await component.create(bootstrap);
      let subComponent = component.element as HTMLElement;
      expect(subComponent.tagName).toEqual('COMPOSE');
      expect(subComponent.textContent!.trim()).toEqual('compose1', 'textContent === compose1');

      await component.dispose();

      // Now test that stubbing one doesn't not affect other
      component = await StageComponent
        .withResources()
        .inView('<compose view-model="test/resources/composes/compose-1"></compose>')
        .boundTo({ message: 'Hello from Component tester' });

      await component.create(bootstrap);
      subComponent = component.element as HTMLElement;
      expect(subComponent.tagName).toEqual('COMPOSE');
      expect(subComponent.textContent!.trim().includes('Hello from Component tester')).toBe(false);
      expect(subComponent.textContent!.trim().includes('compose1')).toBe(true, 'textContent.includes(compose1)');
      expect(subComponent.textContent!.trim().includes('compose2')).toBe(true, 'textContent.includes(compose2)');

      await component.dispose();
    });
  });
});
