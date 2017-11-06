export * from './compile-spy';
export * from './view-spy';
export * from './component-tester';
export * from './wait';
export function configure(config) {
    config.globalResources([
        './compile-spy',
        './view-spy'
    ]);
}
