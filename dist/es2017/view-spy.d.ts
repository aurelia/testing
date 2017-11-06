/**
 * Attribute to be placed on any HTML element in a view to emit the View instance
 * to the debug console, giving you insight into the live View instance, including
 * all child views, live bindings, behaviors and more.
 */
export declare class ViewSpy {
    private logger;
    private value;
    private view;
    /**
     * Creates a new instance of ViewSpy.
     */
    constructor();
    private _log(lifecycleName, context?);
    /**
     * Invoked when the target view is created.
     * @param view The target view.
     */
    created(view: any): void;
    /**
     * Invoked when the target view is bound.
     * @param bindingContext The target view's binding context.
     */
    bind(bindingContext: {}): void;
    /**
     * Invoked when the target element is attached to the DOM.
     */
    attached(): void;
    /**
     * Invoked when the target element is detached from the DOM.
     */
    detached(): void;
    /**
     * Invoked when the target element is unbound.
     */
    unbind(): void;
}
