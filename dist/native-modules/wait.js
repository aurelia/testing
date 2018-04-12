var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
/**
 * Generic function to wait for something to happen. Uses polling
 * @param getter: a getter function that returns anything else than `null` or an
 *                empty array or an empty jQuery object when the
 *                condition is met
 * @param options: lookup options, defaults to
 *                 `{present: true, interval: 50, timeout: 5000}`
 */
export function waitFor(getter, options) {
    if (options === void 0) { options = { present: true, interval: 50, timeout: 5000 }; }
    // prevents infinite recursion if the request times out
    var timedOut = false;
    options = __assign({ present: true, interval: 50, timeout: 5000 }, options);
    function wait() {
        var element = getter();
        // boolean is needed here, hence the length > 0
        var found = element !== null && (!(element instanceof NodeList) &&
            !element.jquery || element.length > 0);
        if (!options.present === !found || timedOut) {
            return Promise.resolve(element);
        }
        return new Promise(function (rs) { return setTimeout(rs, options.interval); }).then(wait);
    }
    return Promise.race([
        new Promise(function (_, rj) { return setTimeout(function () {
            timedOut = true;
            rj(new Error(options.present ? 'Element not found' : 'Element not removed'));
        }, options.timeout); }),
        wait()
    ]);
}
export function waitForDocumentElement(selector, options) {
    return waitFor(function () { return document.querySelector(selector); }, options);
}
export function waitForDocumentElements(selector, options) {
    return waitFor(function () { return document.querySelectorAll(selector); }, options);
}
