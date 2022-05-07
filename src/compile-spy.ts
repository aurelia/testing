import { type IStaticResourceConfig, TargetInstruction } from 'aurelia-templating';
import { getLogger } from 'aurelia-logging';
import { DOM } from 'aurelia-pal';

/**
 * Attribute to be placed on any element to have it emit the View Compiler's
 * TargetInstruction into the debug console, giving you insight into all the
 * parsed bindings, behaviors and event handers for the targeted element.
 */
export class CompileSpy {
  /** @internal */
  static get inject() { return [DOM.Element, TargetInstruction]; }
  /** @internal */
  static $resource: IStaticResourceConfig = {
    type: 'attribute',
    name: 'compile-spy'
  }
  /**
   * Creates and instanse of CompileSpy.
   * @param element target element on where attribute is placed on.
   * @param instruction instructions for how the target element should be enhanced.
   */
  constructor(element: Element, instruction: TargetInstruction) {
    getLogger('compile-spy').info(element.toString(), instruction);
  }
}
