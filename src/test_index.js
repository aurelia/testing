var testsContext = require.context(".", true, /setup.js/);
testsContext(testsContext.keys()[0]);

testsContext = require.context(".", true, /.spec.js/);
testsContext.keys().forEach(testsContext);
