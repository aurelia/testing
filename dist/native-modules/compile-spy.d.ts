import { TargetInstruction } from 'aurelia-templating';
/**
 * Attribute to be placed on any element to have it emit the View Compiler's
 * TargetInstruction into the debug console, giving you insight into all the
 * parsed bindings, behaviors and event handers for the targeted element.
 */
export declare class CompileSpy {
    /**
     * Creates and instanse of CompileSpy.
     * @param element target element on where attribute is placed on.
     * @param instruction instructions for how the target element should be enhanced.
     */
    constructor(element: Element, instruction: TargetInstruction);
}
