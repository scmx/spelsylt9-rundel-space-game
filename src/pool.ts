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

  get used() {
    let count = 0;
    for (let i = 0; i < this.items.length; i++) {
      if (!this.items[i].free) count++;
    }
    return count;
  }

  [Symbol.iterator]() {
    return this.items.values();
  }

  getFree(count = 1) {
    if (this.interval && this.timer < this.interval) return [];
    this.timer = 0;
    return this.getFreeImmediate(count);
  }

  getFreeImmediate(count = 1) {
    const results: T[] = [];
    for (let i = 0; i < this.items.length; i++) {
      if (!this.items[i].free) continue;
      results.push(this.items[i]);
      if (results.length >= count) break;
    }
    return results;
  }

  updatePoolTimer(delta: DeltaUpdate) {
    if (this.interval) this.timer += delta.time;
  }

  updateSize(size: number) {
    this.size = size;
    while (this.items.length < this.size) {
      const item = new this.Klass();
      if (this.autoFill) item.start();
      this.items.push(item);
    }
    while (this.items.length > this.size) {
      this.items.pop();
    }
  }
}
