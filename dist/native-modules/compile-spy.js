var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { customAttribute, TargetInstruction } from 'aurelia-templating';
import { inject } from 'aurelia-dependency-injection';
import { getLogger } from 'aurelia-logging';
import { DOM } from 'aurelia-pal';
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
        getLogger('compile-spy').info(element.toString(), instruction);
    }
    CompileSpy = __decorate([
        customAttribute('compile-spy'),
        inject(DOM.Element, TargetInstruction)
    ], CompileSpy);
    return CompileSpy;
}());
export { CompileSpy };
