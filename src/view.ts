import { Game } from "./game";
import { Entity, Pointer, Position } from "./types";

export class View {
  scale = 0;
  left = 0;
  top = 0;
  full = { width: 0, height: 0 };
  half = { width: 0, height: 0 };
  inner = { radius: 0, left: 0, top: 0 };

  constructor(
    public ctx: CanvasRenderingContext2D,
    public game: Game,
  ) {
    this.resize();
  }

  resize() {
    let w = innerWidth;
    let h = innerHeight - 6; // Prevent scrollbar :S
    this.ctx.canvas.style.width = `${w}px`;
    this.ctx.canvas.style.height = `${h}px`;
    this.half.width = w;
    this.half.height = h;

    w *= 2;
    h *= 2;

    this.ctx.canvas.width = w;
    this.ctx.canvas.height = h;

    this.full.width = w;
    this.full.height = h;

    const factor = 0.95;

    this.scale = (Math.min(w, h) * factor) / 2;

    [this.inner.left, this.inner.top] =
      w > h ? [((w - h) / 2) * factor, 0] : [0, ((h - w) / 2) * factor];
    this.inner.radius = (w > h ? h * factor : w * factor) / 2;

    this.left = w / 2;
    this.top = h / 2;
  }

  resolve(entity: Entity) {
    return {
      x: this.half.width + this.scale * entity.pos.x,
      y: this.half.height + this.scale * entity.pos.y,
      radius: this.scale * entity.radius,
    };
  }

  resolveRadius(radius: number) {
    return this.scale * radius;
  }

  pointersToTarget([first, second]: Pointer[]): Entity | undefined {
    if (!first) return;

    if (!second) {
      const pos = this.mouseToPos(first);
      return { pos, radius: 0 };
    }

    const mouse = first.time < second.time ? first : second;

    const pos = this.mouseToPos(mouse);
    return { pos, radius: 0 };
  }

  mouseToPos(pointer: Pointer): Position {
    return {
      x: (pointer.x * 2 - this.half.width) / this.scale,
      y: (pointer.y * 2 - this.half.height) / this.scale,
    };
  }

  get width() {
    return this.canvas.width;
  }
  get height() {
    return this.canvas.height;
  }
  get canvas() {
    return this.ctx.canvas;
  }

  get level() {
    return this.game.level;
  }
}
