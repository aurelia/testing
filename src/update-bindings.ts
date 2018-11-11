import { Container, TaskQueue } from 'aurelia-framework';

export function updateBindings() {
  const tq: TaskQueue = Container.instance.get(TaskQueue);

  if (tq) {
    tq.flushMicroTaskQueue();
  }
}
