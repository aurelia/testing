"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./compile-spy"));
__export(require("./view-spy"));
__export(require("./component-tester"));
__export(require("./wait"));
function configure(config) {
    config.globalResources([
        './compile-spy',
        './view-spy'
    ]);
}
exports.configure = configure;
