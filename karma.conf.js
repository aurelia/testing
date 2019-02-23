// Karma configuration
// Generated on Sun Aug 28 2016 19:03:27 GMT-0400 (Eastern Daylight Time)

var TemplateServerMiddlewareFactory = function (config) {
  var TEMPLATE_REQUEST_REGEXP = /^\/base\/dist\/test\/.+\.html$/i;
  return function (req, res, next) {
    if(TEMPLATE_REQUEST_REGEXP.test(req.url)) {
      req.url = req.url.replace(/^\/base\/dist\/test\//, '/base/');
    }

    next();
  };
}

const path = require('path');
const { AureliaPlugin } = require('aurelia-webpack-plugin');

module.exports = function (config) {
  const browsers = config.browsers;
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      // 'dist/test/test/setup.js',
      // { pattern: 'dist/test/**/*.js', included: false, watched: true },
      // { pattern: '**/*.html', included: false, watched: true },
      // { pattern: 'node_modules/**/*.js', included: false, watched: false },
      'test/**/*.spec.ts'
    ],


    // list of files to exclude
    exclude: [],


    preprocessors: {
      "**/*.ts": ["webpack"]
    },
    webpack: {
      mode: "development",
      resolve: {
        extensions: [".ts", ".js"],
        modules: ["src", "node_modules"],
        alias: {
          src: path.resolve(__dirname, "src"),
          test: path.resolve(__dirname, "test")
        }
      },
      devtool: "cheap-module-eval-source-map",
      module: {
        rules: [
          {
            test: /\.ts$/,
            loader: "ts-loader",
            exclude: /node_modules/,
            options: {
              configFile: path.resolve(__dirname, "tsconfig.test.json")
            }
          },
          {
            test: /\.html?$/i,
            loader: "html-loader"
          }
        ]
      },
      plugins: [
        new AureliaPlugin({
          aureliaApp: undefined,
          dist: "es2015",
          noWebpackLoader: true
        })
      ]
    },
    mime: {
      "text/x-typescript": ["ts"]
    },
    reporters: ["mocha", "progress"],
    webpackServer: { noInfo: config.noInfo },
    
    browsers: browsers && browsers.length > 0 ? browsers : ['ChromeHeadlessOpt'],
    customLaunchers: {
      ChromeDebugging: {
        base: "Chrome",
        flags: [...commonChromeFlags, "--remote-debugging-port=9333"],
        debug: true
      },
      ChromeHeadlessOpt: {
        base: 'ChromeHeadless',
        flags: [
          ...commonChromeFlags
        ]
      }
    },


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}

const commonChromeFlags = [
  '--no-default-browser-check',
  '--no-first-run',
  '--no-managed-user-acknowledgment-check',
  '--no-pings',
  '--no-sandbox',
  '--no-wifi',
  '--no-zygote',
  '--disable-background-networking',
  '--disable-background-timer-throttling',
  '--disable-backing-store-limit',
  '--disable-boot-animation',
  '--disable-breakpad',
  '--disable-cache',
  '--disable-clear-browsing-data-counters',
  '--disable-cloud-import',
  '--disable-component-extensions-with-background-pages',
  '--disable-contextual-search',
  '--disable-default-apps',
  '--disable-extensions',
  '--disable-infobars',
  '--disable-translate',
  '--disable-sync'
];
