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

With the Component Tester you can easily stage a custom element or custom attribute in isolation inside a mini Aurelia application,
assert how it responds to databinding and assert its behavior throughout the component's lifecycle (bind, attached etc).

## [Getting Started](aurelia-doc://section/2/version/1.0.0)

If you are using JSPM:

```shell
jspm install aurelia-testing
```

If you are using npm:

```shell
npm install aurelia-testing
```

Once you've got the library installed, you can use it in a unit test. In the examples we are using Jasmine, but any testing framework can be used.

## [Testing a Custom Elements](aurelia-doc://section/3/version/1.0.0)

Given you want to test following Custom Element

```html
<template>
  <div class="firstName">${firstName}</div>
</template>
```

```JavaScript
import {bindable} from 'aurelia-framework';

export class MyComponent {
  @bindable firstName;
}
```

In order to test that the component render expected html based on what the view is bount to we can write following test:

```JavaScript
import {StageComponent} from 'aurelia-testing';

describe('MyComponent', () => {
  let component;

  beforeEach(() => {
    component = StageComponent
      .withResources('src/my-component')
      .inView('<my-component name.bind="name"></my-component>')
      .boundTo({ firstName: 'Bob' });
  });

  it('should render first name', done => {
    component.create().then(() => {
      const nameElement = document.querySelector('.firstName');
      expect(nameElement.innerHTML).toBe('Bob');
      done();
    });
  });

  afterEach(() => {
    component.dispose();
  });
});

```

Running the test following html should be rendered `<div class="firstName">Bob</div>` and the test should pass.

But let's take a step back and take a closer look at what is going on

First we import `StageComponent` from `aurelia-testing`

```JavaScript
import {StageComponent} from 'aurelia-testing';
```

`StageComponent` is just a convenience factory that creates a new instance of the `ComponentTester` class. `ComponentTester` is the actual class doing all the work.

Next we use the `StageComponent` factory the stage our component

```JavaScript
component = StageComponent
      .withResources('src/my-component')
      .inView('<my-component name.bind="name"></my-component>')
      .boundTo({ name: 'Bob' });
```

`StageCompnent` comes with one property `withResources` that lets you start off the staging with a fluent API. `withResources` lets you specify which resource or resources for Aurelia to register.
It takes either a string for registering one single resource or an Array of strings for registering of multiple resources. `inView` lets you provide the html markup to be run, this is just a standard
Aurelia view where you can do all data binding you are used to in a full blown Aurelia application. `boundTo` is basically your `viewModel` with the data that the view will get bound to.

In this example the staging of the component of done in Jasmine's `beforeEach` method in order to reuse the same setup for multiple tests.

Then we come to the actual test where we call `create` on the `ComponentTester`, create will kick everyting off and bootstrap the mini Aurelia application, configure it with `standardConfiguration`
(we will take a look later how you can run with your own configureation), register provided resources as global resources, start the application and finally render your componenet for you to assert
it behaves as expected. In this case we want make sure our `firstName` property gets rendered correctly in the html by basically selecting the `div` tag by it's class name `document.querySelector('.firstName');`
and check that its innerHTML is `Bob`. Then we call Jasmine's `done` function to tell Jasmine the test is done. Calling `done` is needed since the `create` method is asynchronous and returns a Promise.

Last we call `dispose` on our `ComponentTester` instance, this will clean up the DOM for next test to start out with a clean document.

That's pretty much all there is to it, pretty easy right? Imagine doing the same assert with stand alone unit tests that runs outside of Aurelia, that would be pretty hard, especially for a little more realistic
and more complex component.

## [Testing a Custom Attribute](aurelia-doc://section/3/version/1.0.0)

Testing a Custom Attribute is not much different than testing a Custom Element. Here is an example of how you can test a simple Custom Attribute

Given you have following Custom Attribute that lets you change the background color it is placed on

```JavaScript
export class MyAttributeCustomAttribute {
  static inject = [Element];
  constructor(element) {
    this.element = element;
  }

  valueChanged(newValue){
    this.element.style.backgroundColor = newValue;
  }
}
```

You now want to assert the element actually gets the background color of the color that is bound to, we can write a test like this

```JavaScript
import {StageComponent} from 'aurelia-testing';

describe('MyAttribute', () => {
  let component;

  beforeEach(() => {
    component = StageComponent
        .withResources('src/my-attribute')
        .inView('<div my-attribute.bind="color">Bob</div>')
        .boundTo({ color: 'blue' });
  });

  it('should set the background color to provided color', done => {
     component.create().then(() => {
       expect(component.element.style.backgroundColor).toBe('blue');
       done();
     });
  });

  afterEach(() => {
    component.dispose();
  });
});
```

As you can see everything is follows the same pattern we had for our Custom Element test. One exception is we take advantage of the `element` property that gets provided by the `ComponentTester` instance,
the element property is the actual html element that gets rendered. This can also be used when testing custom elements.

## [Exposed properties and functions](aurelia-doc://section/4/version/1.0.0)

The `ComponentTester` exposes a set of properties that can be handy when doing asserts or the stage the component in a specific way

* `element` - The html element that gets rendered.
* `viewModel` - The controller instance (view model) for the component.
* `configure` - The `ComponentTester`'s configure method can be overwritten in order to set up with custom configuration or get hold of the `container` instance.
* `dispose` - Clean up the DOM after a test has run.
* `bind` - Manually handle `bind`.
* `unbind` - Manually handle `unbind`.
* `attached` - Manually handle `attached`.
* `detached` - Manually handle `detached`.
