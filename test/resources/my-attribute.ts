export class MyAttributeCustomAttribute {
  public static inject = [Element];

  constructor(public element: Element) {}

  public valueChanged(newValue: string) {
    (this.element as HTMLElement).style.backgroundColor = newValue;
  }
}
