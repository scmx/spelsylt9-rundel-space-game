import { DeltaUpdate } from "./delta";
import { Poolable } from "./types";

export class Pool<T extends Poolable> {
  items: T[] = [];
  timer = 0;

  constructor(
    public size: number,
    public Klass: { new (): T },
    public interval?: number,
    public autoFill = false,
  ) {
    for (let i = 0; i < this.size; i++) {
      const item = new Klass();
      if (autoFill) item.start();
      this.items.push(item);
    }
  }

  get values() {
    return this.items.values();
  }

  get idle() {
    return this.items.every((item) => item.free);
  }

  [Symbol.iterator]() {
    return this.items.values();
  }

  getFree() {
    if (this.interval && this.timer < this.interval) return;
    this.timer = 0;
    return this.getFreeImmediate();
  }

  getFreeImmediate() {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].free) return this.items[i];
    }
  }

  updatePoolTimer(delta: DeltaUpdate) {
    if (this.interval) this.timer += delta.time;
  }
}
