System.register(["./compile-spy", "./view-spy", "./component-tester", "./wait"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function configure(config) {
        config.globalResources([
            './compile-spy',
            './view-spy'
        ]);
    }
    exports_1("configure", configure);
    var exportedNames_1 = {
        "configure": true
    };
    function exportStar_1(m) {
        var exports = {};
        for (var n in m) {
            if (n !== "default" && !exportedNames_1.hasOwnProperty(n)) exports[n] = m[n];
        }
        exports_1(exports);
    }
    return {
        setters: [
            function (compile_spy_1_1) {
                exportStar_1(compile_spy_1_1);
            },
            function (view_spy_1_1) {
                exportStar_1(view_spy_1_1);
            },
            function (component_tester_1_1) {
                exportStar_1(component_tester_1_1);
            },
            function (wait_1_1) {
                exportStar_1(wait_1_1);
            }
        ],
        execute: function () {
        }
    };
});
