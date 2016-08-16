export class MyAttributeCustomAttribute {
  static inject = [Element];
  constructor(element) {
    this.element = element;
  }

  valueChanged(newValue){
    this.element.style.backgroundColor = newValue;
  }
}
