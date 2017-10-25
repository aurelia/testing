/**
 * Generic function to wait for something to happen. Uses polling
 * @param condition: a function that returns a true value when the
 *                condition is met
 * @param options: lookup options, defaults to
 *                 `{present: true, interval: 50, timeout: 5000}`
 * @returns execution result of condition
 */
export function waitFor(condition: Function<Boolean>, options: any): Promise {
  options = Object.assign({
    present: true,
    interval: 50,
    timeout: 5000
  }, options);

  // prevents infinite recursion if the request times out
  let timedOut = false
  return Promise.race([new Promise((rs, rj) => {
      window.setTimeout(() => {
        timedOut = true;
        rj('condition not met within ' + options.timeout + ' ms');
      }, options.timeout);
    }),
    new Promise((rs) => {
      const wait = () => {
        try {
          let result = condition();
          if (!options.present ^ !!result) {
            rs(result);
            return;
          }
        } catch (err) {}
        timedOut || window.setTimeout(wait, options.interval);
      }
      wait();
    })
  ]);
}
