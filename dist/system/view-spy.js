System.register(["aurelia-templating", "aurelia-logging"], function (exports_1, context_1) {
    "use strict";
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __moduleName = context_1 && context_1.id;
    var aurelia_templating_1, aurelia_logging_1, ViewSpy;
    return {
        setters: [
            function (aurelia_templating_1_1) {
                aurelia_templating_1 = aurelia_templating_1_1;
            },
            function (aurelia_logging_1_1) {
                aurelia_logging_1 = aurelia_logging_1_1;
            }
        ],
        execute: function () {
            ViewSpy = /** @class */ (function () {
                /**
                 * Creates a new instance of ViewSpy.
                 */
                function ViewSpy() {
                    this.logger = aurelia_logging_1.getLogger('view-spy');
                }
                ViewSpy.prototype._log = function (lifecycleName, context) {
                    if (!this.value && lifecycleName === 'created') {
                        this.logger.info(lifecycleName, this.view);
                    }
                    else if (this.value && this.value.indexOf(lifecycleName) !== -1) {
                        this.logger.info(lifecycleName, this.view, context);
                    }
                };
                /**
                 * Invoked when the target view is created.
                 * @param view The target view.
                 */
                ViewSpy.prototype.created = function (view) {
                    this.view = view;
                    this._log('created');
                };
                /**
                 * Invoked when the target view is bound.
                 * @param bindingContext The target view's binding context.
                 */
                ViewSpy.prototype.bind = function (bindingContext) {
                    this._log('bind', bindingContext);
                };
                /**
                 * Invoked when the target element is attached to the DOM.
                 */
                ViewSpy.prototype.attached = function () {
                    this._log('attached');
                };
                /**
                 * Invoked when the target element is detached from the DOM.
                 */
                ViewSpy.prototype.detached = function () {
                    this._log('detached');
                };
                /**
                 * Invoked when the target element is unbound.
                 */
                ViewSpy.prototype.unbind = function () {
                    this._log('unbind');
                };
                ViewSpy = __decorate([
                    aurelia_templating_1.customAttribute('view-spy')
                ], ViewSpy);
                return ViewSpy;
            }());
            exports_1("ViewSpy", ViewSpy);
        }
    };
});
