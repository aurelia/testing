import 'aurelia-polyfills';
import 'aurelia-loader-webpack';
import { initialize } from 'aurelia-pal-browser';
import { PLATFORM } from 'aurelia-pal';

initialize();

Error.stackTraceLimit = Infinity;

PLATFORM.moduleName('test/resources/my-parent-component');
PLATFORM.moduleName('test/resources/my-component');
PLATFORM.moduleName('test/resources/my-attribute');
PLATFORM.moduleName('test/resources/composes/compose-1');
PLATFORM.moduleName('test/resources/composes/compose-2');
PLATFORM.moduleName('test/resources/html-only/html-only1.html');
PLATFORM.moduleName('test/resources/html-only/html-only2.html');
