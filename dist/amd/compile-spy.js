var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "aurelia-templating", "aurelia-logging", "aurelia-pal"], function (require, exports, aurelia_templating_1, aurelia_logging_1, aurelia_pal_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Attribute to be placed on any element to have it emit the View Compiler's
     * TargetInstruction into the debug console, giving you insight into all the
     * parsed bindings, behaviors and event handers for the targeted element.
     */
    var CompileSpy = /** @class */ (function () {
        /**
         * Creates and instanse of CompileSpy.
         * @param element target element on where attribute is placed on.
         * @param instruction instructions for how the target element should be enhanced.
         */
        function CompileSpy(element, instruction) {
            aurelia_logging_1.getLogger('compile-spy').info(element.toString(), instruction);
        }
        /**
         * @internal
         */
        CompileSpy.inject = function () {
            return [aurelia_pal_1.DOM.Element, aurelia_templating_1.TargetInstruction];
        };
        CompileSpy = __decorate([
            aurelia_templating_1.customAttribute('compile-spy')
        ], CompileSpy);
        return CompileSpy;
    }());
    exports.CompileSpy = CompileSpy;
});
