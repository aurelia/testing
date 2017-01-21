/**
 * Generic function to wait for something to happen. Uses polling
 * @param getter: a getter function that returns anything else than `null` or an
 *                empty array or an empty jQuery object when the
 *                condition is met
 * @param options: lookup options, defaults to
 *                 `{present: true, interval: 50, timeout: 5000}`
 */
export function waitFor(getter: () => any, options: any): Promise<any> {
  // prevents infinite recursion if the request times out
  let timedOut = false;

  options = Object.assign({
    present: true,
    interval: 50,
    timeout: 5000
  }, options);


  function wait() {
    let element = getter();
    // boolean is needed here, hence the length > 0
    let found = element !== null && (!(element instanceof NodeList) &&
      !element.jquery || element.length > 0);

    if (!options.present ^ found || timedOut) {
      return Promise.resolve(element);
    }

    return new Promise(rs => setTimeout(rs, options.interval)).then(wait);
  }

  return Promise.race([
    new Promise(
      (rs, rj) => setTimeout(() => {
        timedOut = true;
        rj(options.present ? 'Element not found' : 'Element not removed');
      }, options.timeout)
    ),
    wait()
  ]);
}

export function waitForDocumentElement(selector: string, options: any): Promise<Element> {
  return waitFor(() => document.querySelector(selector), options);
}

export function waitForDocumentElements(selector: string, options: any): Promise<Element> {
  return waitFor(() => document.querySelectorAll(selector), options);
}
