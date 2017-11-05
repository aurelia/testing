import { customAttribute } from 'aurelia-templating';
import { getLogger, Logger } from 'aurelia-logging';

/**
 * Attribute to be placed on any HTML element in a view to emit the View instance
 * to the debug console, giving you insight into the live View instance, including
 * all child views, live bindings, behaviors and more.
 */
@customAttribute('view-spy')
export class ViewSpy {
  private logger: Logger;
  private value: any;
  private view: any;

  /**
   * Creates a new instance of ViewSpy.
   */
  constructor() {
    this.logger = getLogger('view-spy');
  }

  private _log(lifecycleName: string, context?: {}) {
    if (!this.value && lifecycleName === 'created') {
      this.logger.info(lifecycleName, this.view);
    } else if (this.value && this.value.indexOf(lifecycleName) !== -1) {
      this.logger.info(lifecycleName, this.view, context);
    }
  }

  /**
   * Invoked when the target view is created.
   * @param view The target view.
   */
  public created(view: any) {
    this.view = view;
    this._log('created');
  }

  /**
   * Invoked when the target view is bound.
   * @param bindingContext The target view's binding context.
   */
  public bind(bindingContext: {}) {
    this._log('bind', bindingContext);
  }

  /**
   * Invoked when the target element is attached to the DOM.
   */
  public attached() {
    this._log('attached');
  }

  /**
   * Invoked when the target element is detached from the DOM.
   */
  public detached() {
    this._log('detached');
  }

  /**
   * Invoked when the target element is unbound.
   */
  public unbind() {
    this._log('unbind');
  }
}
