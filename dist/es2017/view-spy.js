var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { customAttribute } from 'aurelia-templating';
import { getLogger } from 'aurelia-logging';
/**
 * Attribute to be placed on any HTML element in a view to emit the View instance
 * to the debug console, giving you insight into the live View instance, including
 * all child views, live bindings, behaviors and more.
 */
let ViewSpy = class ViewSpy {
    /**
     * Creates a new instance of ViewSpy.
     */
    constructor() {
        this.logger = getLogger('view-spy');
    }
    _log(lifecycleName, context) {
        if (!this.value && lifecycleName === 'created') {
            this.logger.info(lifecycleName, this.view);
        }
        else if (this.value && this.value.indexOf(lifecycleName) !== -1) {
            this.logger.info(lifecycleName, this.view, context);
        }
    }
    /**
     * Invoked when the target view is created.
     * @param view The target view.
     */
    created(view) {
        this.view = view;
        this._log('created');
    }
    /**
     * Invoked when the target view is bound.
     * @param bindingContext The target view's binding context.
     */
    bind(bindingContext) {
        this._log('bind', bindingContext);
    }
    /**
     * Invoked when the target element is attached to the DOM.
     */
    attached() {
        this._log('attached');
    }
    /**
     * Invoked when the target element is detached from the DOM.
     */
    detached() {
        this._log('detached');
    }
    /**
     * Invoked when the target element is unbound.
     */
    unbind() {
        this._log('unbind');
    }
};
ViewSpy = __decorate([
    customAttribute('view-spy')
], ViewSpy);
export { ViewSpy };
