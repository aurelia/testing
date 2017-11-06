define(["require", "exports", "./compile-spy", "./view-spy", "./component-tester", "./wait"], function (require, exports, compile_spy_1, view_spy_1, component_tester_1, wait_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(compile_spy_1);
    __export(view_spy_1);
    __export(component_tester_1);
    __export(wait_1);
    function configure(config) {
        config.globalResources([
            './compile-spy',
            './view-spy'
        ]);
    }
    exports.configure = configure;
});
