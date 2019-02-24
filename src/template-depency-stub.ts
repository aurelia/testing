import { TemplateDependency, TemplateRegistryEntry } from 'aurelia-loader';

const STUBBED_DEPENDENCIES: string[] = [];

export function stubTemplateDependency(modulePath: string) {
  STUBBED_DEPENDENCIES.push(modulePath);
}

export function resetStubbedTemplateDependencies() {
  STUBBED_DEPENDENCIES.length = 0;
}

const templateDescriptor = Object.getOwnPropertyDescriptor(TemplateRegistryEntry.prototype, 'template')!;
const oldGet = templateDescriptor.get!;
const oldSet = templateDescriptor.set!;
Object.defineProperty(TemplateRegistryEntry.prototype, 'template', {
  get: oldGet,
  set(value: HTMLTemplateElement) {
    oldSet.call(this, value);
    if (STUBBED_DEPENDENCIES.length > 0) {
      this.dependencies = this.dependencies
          .filter((d: TemplateDependency) => !STUBBED_DEPENDENCIES.includes(d.src));
    }
  },
});
