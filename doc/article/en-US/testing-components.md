---
{
  "name": "Testing Components",
  "culture": "en-US",
  "description": "An overview of how to unit test Custom Elements and Custom Attributes.",
  "engines" : { "aurelia-doc" : "^1.0.0" },
  "author": {
  	"name": "Martin Gustafsson",
  	"url": "http://github.com/martingust"
  },
  "contributors": [],
  "translators": [],
  "keywords": ["JavaScript", "Unit Testing", "Custom Elements", "Custom Attributes"]
}
---
## [Introduction](aurelia-doc://section/1/version/1.0.0)

With the Component Tester you can easily stage a custom element or custom attribute in isolation inside a mini Aurelia application, assert how it responds to data-binding and assert its behavior throughout the component's lifecycle (bind, attached etc).

## [Getting Started](aurelia-doc://section/2/version/1.0.0)

If you are using JSPM:

```shell
jspm install aurelia-testing
```

If you are using NPM:

```shell
npm install aurelia-testing
```

Once you've got the library installed, you can use it in a unit test. In the following examples we will be using Jasmine, but any testing framework would work.

## [Testing a Custom Elements](aurelia-doc://section/3/version/1.0.0)

Let's start with a simple custom element that we want to test:

<code-listing heading="A Custom Element's View">
  <source-code lang="HTML">
    <template>
      <div class="firstName">${firstName}</div>
    </template>
  </source-code>
</code-listing>

<code-listing heading="A Custom Element's View-Model">
  <source-code lang="JavaScript">
    import {bindable} from 'aurelia-framework';

    export class MyComponent {
      @bindable firstName;
    }
  </source-code>
</code-listing>

In order to test that the component renders expected HTML, based on what the view is bound to, we can write following test:

<code-listing heading="A Custom Element Test">
  <source-code lang="JavaScript">
    import {StageComponent} from 'aurelia-testing';
    import {bootstrap} from 'aurelia-bootstrapper';

    describe('MyComponent', () => {
      let component;

      beforeEach(() => {
        component = StageComponent
          .withResources('src/my-component')
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
  </source-code>
</code-listing>

Running the test should result in the following html should be rendered `<div class="firstName">Bob</div>` and the test should pass. But let's take a step back and see what is going on here. First, we import `StageComponent` from `aurelia-testing`:

<code-listing heading="Importing StageComponent">
  <source-code lang="JavaScript">
    import {StageComponent} from 'aurelia-testing';
  </source-code>
</code-listing>

`StageComponent` is just a convenience factory that creates a new instance of the `ComponentTester` class. `ComponentTester` is the actual class doing all the work. Next we use the `StageComponent` factory to stage our component:

<code-listing heading="Staging The Element">
  <source-code lang="JavaScript">
    component = StageComponent
      .withResources('src/my-component')
      .inView('<my-component first-name.bind="firstName"></my-component>')
      .boundTo({ firstName: 'Bob' });
  </source-code>
</code-listing>

`StageComponent` comes with one property, `withResources`, that lets you start off the staging with a fluent API. `withResources` lets you specify which resource or resources for Aurelia to register. It takes either a string for registering one single resource or an Array of strings for registering multiple resources. `inView` lets you provide the html markup to be run. This is just a standard Aurelia view where you can do all the data binding you are used to in a full-blown Aurelia application. `boundTo` lets you provide a test `viewModel` with the data that the view will get bound to. In this example, the staging of the component is done in Jasmine's `beforeEach` method in order to reuse the same setup for multiple tests.

Next, we come to the actual test where we call `create` on the `ComponentTester`. Create will kick everything off and bootstrap the mini Aurelia application, configure it with `standardConfiguration` (we will take a look later at how you can run with your own configuration), register provided resources as global resources, start the application and finally render your component so you can assert the expected behavior. In this case, we want to make sure our `firstName` property gets rendered correctly in the HTML by selecting the `div` tag via it's class name. We use `document.querySelector('.firstName');` to grab that and then check that its innerHTML is `Bob`. Next we call Jasmine's `done` function to tell Jasmine that the test is complete. Calling `done` is needed since the `create` method is asynchronous and returns a Promise.

Finally, we call `dispose` on our `ComponentTester` instance. This will clean up the DOM so our next test will start out with a clean document. That's pretty much all there is to it. Easy right? Imagine doing the same assert with stand alone unit tests that run outside of Aurelia. It would be pretty difficult, especially for a more complex component.

## [Testing a Custom Attribute](aurelia-doc://section/4/version/1.0.0)

Testing a Custom Attribute is not much different than testing a Custom Element. Let's look at how it's done by starting with a simple example custom attribute that lets you change the background color of the element it is placed on:

<code-listing heading="A Custom Attribute">
  <source-code lang="JavaScript">
    export class MyAttributeCustomAttribute {
      static inject = [Element];
      constructor(element) {
        this.element = element;
      }

      valueChanged(newValue){
        this.element.style.backgroundColor = newValue;
      }
    }
  </source-code>
</code-listing>

Now, let's assert that the element actually gets the background color it is bound to:

<code-listing heading="A Custom Attribute Test">
  <source-code lang="JavaScript">
    import {StageComponent} from 'aurelia-testing';
    import {bootstrap} from 'aurelia-bootstrapper';

    describe('MyAttribute', () => {
      let component;

      beforeEach(() => {
        component = StageComponent
            .withResources('src/my-attribute')
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
  </source-code>
</code-listing>

As you can see, everything follows the same pattern we had for our custom element test. One exception is that we take advantage of the `element` property which gets provided by the `ComponentTester` instance. The `element` property is the actual HTML element that gets rendered. This can also be used when testing custom elements.

## [Helpful Properties and Functions](aurelia-doc://section/5/version/1.0.0)

The `ComponentTester` exposes a set of properties that can be handy when doing asserts or to stage a component in a specific way. Here's a list of what is available:

* `element` - The HTML element that gets rendered.
* `viewModel` - The view-model for the component.
* `configure` - The `ComponentTester`'s configure method can be overwritten in order to set it up with custom configuration or get a reference to the `container` instance.
* `dispose` - Cleans up the DOM after a test has run.
* `bind` - Manually handles `bind`.
* `unbind` - Manually handles `unbind`.
* `attached` - Manually handles `attached`.
* `detached` - Manually handles `detached`.
