/**
 * Generic function to wait for something to happen. Uses polling
 * @param getter: a getter function that returns anything else than `null` or an
 *                empty array or an empty jQuery object when the
 *                condition is met
 * @param options: lookup options, defaults to
 *                 `{present: true, interval: 50, timeout: 5000}`
 */
export declare function waitFor<T>(getter: () => T, options?: {
    present?: boolean;
    interval?: number;
    timeout?: number;
}): Promise<T>;
export declare function waitForDocumentElement(selector: string, options?: {
    present?: boolean;
    interval?: number;
    timeout?: number;
}): Promise<Element>;
export declare function waitForDocumentElements(selector: string, options?: {
    present?: boolean;
    interval?: number;
    timeout?: number;
}): Promise<NodeListOf<Element>>;
