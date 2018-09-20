/**
 * Generic function to wait for something to happen. Uses polling
 * @param getter: a getter function that returns anything else than `null` or an
 *                empty array or an empty jQuery object when the
 *                condition is met
 * @param options: lookup options, defaults to
 *                 `{present: true, interval: 50, timeout: 5000}`
 */
export function waitFor<T>(getter: () => T, options: {
  present?: boolean,
  interval?: number,
  timeout?: number
} = {present: true, interval: 50, timeout: 5000}): Promise<T> {
  // prevents infinite recursion if the request times out
  let timedOut = false;

  options = {
    present: true,
    interval: 50,
    timeout: 5000,
    ...options
  };

  function wait(): Promise<T> {
    const element = getter();
    // boolean is needed here, hence the length > 0
    const found = element !== null && (!(element instanceof NodeList) &&
      !(element as any).jquery || (element as any).length > 0);

    if (!options.present === !found || timedOut) {
      return Promise.resolve(element);
    }

    return new Promise(rs => setTimeout(rs, options.interval)).then(wait);
  }

  return Promise.race([
    new Promise(
      (_, rj) => setTimeout(() => {
        timedOut = true;
        rj(new Error(options.present ? 'Element not found' : 'Element not removed'));
      }, options.timeout)
    ),
    wait()
  ]) as Promise<T>;
}

export function waitForDocumentElement(selector: string, options?: {
  present?: boolean,
  interval?: number,
  timeout?: number
}): Promise<Element> {
  return waitFor(() => document.querySelector(selector) as Element, options);
}

export function waitForDocumentElements(selector: string, options?: {
  present?: boolean,
  interval?: number,
  timeout?: number
}): Promise<NodeListOf<Element>> {
  return waitFor(() => document.querySelectorAll(selector), options);
}
