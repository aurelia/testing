
export function waitFor(getter, options) {
  let timedOut = false;

  options = Object.assign({
    present: true,
    interval: 50,
    timeout: 5000
  }, options);

  function wait() {
    let element = getter();

    let found = element !== null && (!(element instanceof NodeList) && !element.jquery || element.length > 0);

    if (!options.present ^ found || timedOut) {
      return Promise.resolve(element);
    }

    return new Promise(rs => setTimeout(rs, options.interval)).then(wait);
  }

  return Promise.race([new Promise((rs, rj) => setTimeout(() => {
    timedOut = true;
    rj(options.present ? 'Element not found' : 'Element not removed');
  }, options.timeout)), wait()]);
}

export function waitForDocumentElement(selector, options) {
  return waitFor(() => document.querySelector(selector), options);
}

export function waitForDocumentElements(selector, options) {
  return waitFor(() => document.querySelectorAll(selector), options);
}