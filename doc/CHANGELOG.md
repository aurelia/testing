<a name="1.0.0-beta.5.0.0"></a>
# [1.0.0](https://github.com/aurelia/testing/compare/1.0.0-beta.4.0.0...1.0.0) (2018-09-25)


### Bug Fixes

* **code example:** fix to the manually handling lifecycle example ([#82](https://github.com/aurelia/testing/issues/82)) ([b0fb939](https://github.com/aurelia/testing/commit/b0fb939))
* **waitFor:** reject with Error rather than string ([#84](https://github.com/aurelia/testing/issues/84)) ([054dab5](https://github.com/aurelia/testing/commit/054dab5))



<a name="1.0.0-beta.4.0.0"></a>
# [1.0.0-beta.4.0.0](https://github.com/aurelia/testing/compare/1.0.0-beta.3.0.1...1.0.0-beta.4.0.0) (2017-11-06)

This entire library was converted to TypeScript. This doesn't involve any breaking changes to the functionality, but the TypeScript definitions are now more accurate and could result in some requried code fixups for TS consumers.

<a name="1.0.0-beta.3.0.1"></a>
# [1.0.0-beta.3.0.1](https://github.com/aurelia/testing/compare/1.0.0-beta.3.0.0...v1.0.0-beta.3.0.1) (2017-03-25)


### Bug Fixes

* **ComponentTester:** import missing waitFor function ([#60](https://github.com/aurelia/testing/issues/60)) ([1ecfbfe](https://github.com/aurelia/testing/commit/1ecfbfe))
* **ComponentTester:** withResources args are optional ([2154b8f](https://github.com/aurelia/testing/commit/2154b8f))



<a name="1.0.0-beta.3.0.0"></a>
# [1.0.0-beta.3.0.0](https://github.com/aurelia/testing/compare/1.0.0-beta.2.0.1...v1.0.0-beta.3.0.0) (2017-03-03)


### Bug Fixes

* **typings:** Typings for StageComponent ([#52](https://github.com/aurelia/testing/issues/52)) ([01036e7](https://github.com/aurelia/testing/commit/01036e7)), closes [#46](https://github.com/aurelia/testing/issues/46)


### Features

* **component-tester:** add waitForElement method and options ([#32](https://github.com/aurelia/testing/issues/32)) ([65eb382](https://github.com/aurelia/testing/commit/65eb382))



<a name="1.0.0-beta.2.0.0"></a>
# [1.0.0-beta.2.0.0](https://github.com/aurelia/testing/compare/1.0.0-beta.1.0.3...v1.0.0-beta.2.0.0) (2016-07-27)


### Bug Fixes

* **component-tester:** call detached and unbind when disposing of tested component ([#27](https://github.com/aurelia/testing/issues/27)) ([f1585cc](https://github.com/aurelia/testing/commit/f1585cc))
* **component-tester:** handle enhance promise ([681cff2](https://github.com/aurelia/testing/commit/681cff2))



<a name="1.0.0-beta.1.0.0"></a>
# [1.0.0-beta.1.0.0](https://github.com/aurelia/testing/compare/0.5.0...v1.0.0-beta.1.0.0) (2016-06-22)



<a name="0.5.0"></a>
# [0.5.0](https://github.com/aurelia/testing/compare/0.4.2...v0.5.0) (2016-06-22)


### Features

* **component-tester:** remove hard dependency on bootstrapper ([3887d19](https://github.com/aurelia/testing/commit/3887d19))



### 0.3.1 (2016-06-08)


#### Bug Fixes

* **aurelia-testing:** missing exports ([94bfbaca](http://github.com/aurelia/testing/commit/94bfbacac394d10a35da19adf044612f89066a39), closes [#10](http://github.com/aurelia/testing/issues/10))


## 0.3.0 (2016-05-31)


#### Bug Fixes

* **index:** correct export strategy ([d1a0533f](http://github.com/aurelia/testing/commit/d1a0533f5a462f5df8f711798aab7a9b1ec95bdd))
* **package:** add missing dependencies ([466971e9](http://github.com/aurelia/testing/commit/466971e9d5564756b2bbd7c22415de83e6e2b9cc))


#### Features

* **spies:** add view-spy and compile-spy ([fc81850f](http://github.com/aurelia/testing/commit/fc81850f9f23a2131fc370d0b744f53ddb58374e))


### 0.2.2 (2016-05-17)


#### Features

* **component-tester:** make configure function public ([b17e4ac0](http://github.com/aurelia/testing/commit/b17e4ac0e6dac2af8fb0ef75261677744982ee99))


### 0.2.1 (2016-05-10)


## 0.2.0 (2016-05-03)


#### Bug Fixes

* **component-tester:** correct type annotations ([53f57f08](http://github.com/aurelia/testing/commit/53f57f080c22015a720f58cf9493d1c14cbfd3ef))


#### Features

* **component-tester:**
  * support lifecycle testing ([cd9bd78a](http://github.com/aurelia/testing/commit/cd9bd78a0905c0e4900a6f4fbc67ef1e30990075))
  * enable custom bootstrap ([50d1d72a](http://github.com/aurelia/testing/commit/50d1d72aa5af9ed5e8fd20efdf7fade027baccb2))
  * initial poc ([1db19514](http://github.com/aurelia/testing/commit/1db195142715503746e49e179c044c0ad39a4763))
