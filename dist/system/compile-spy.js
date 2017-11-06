System.register(["aurelia-templating", "aurelia-dependency-injection", "aurelia-logging", "aurelia-pal"], function (exports_1, context_1) {
    "use strict";
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __moduleName = context_1 && context_1.id;
    var aurelia_templating_1, aurelia_dependency_injection_1, aurelia_logging_1, aurelia_pal_1, CompileSpy;
    return {
        setters: [
            function (aurelia_templating_1_1) {
                aurelia_templating_1 = aurelia_templating_1_1;
            },
            function (aurelia_dependency_injection_1_1) {
                aurelia_dependency_injection_1 = aurelia_dependency_injection_1_1;
            },
            function (aurelia_logging_1_1) {
                aurelia_logging_1 = aurelia_logging_1_1;
            },
            function (aurelia_pal_1_1) {
                aurelia_pal_1 = aurelia_pal_1_1;
            }
        ],
        execute: function () {
            CompileSpy = /** @class */ (function () {
                /**
                 * Creates and instanse of CompileSpy.
                 * @param element target element on where attribute is placed on.
                 * @param instruction instructions for how the target element should be enhanced.
                 */
                function CompileSpy(element, instruction) {
                    aurelia_logging_1.getLogger('compile-spy').info(element.toString(), instruction);
                }
                CompileSpy = __decorate([
                    aurelia_templating_1.customAttribute('compile-spy'),
                    aurelia_dependency_injection_1.inject(aurelia_pal_1.DOM.Element, aurelia_templating_1.TargetInstruction)
                ], CompileSpy);
                return CompileSpy;
            }());
            exports_1("CompileSpy", CompileSpy);
        }
    };
});
