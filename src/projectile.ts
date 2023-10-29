import { Boundary } from "./boundary";
import { DeltaUpdate } from "./delta";
import { Entity, Position } from "./types";
import { entitiesDistance } from "./utils";
import { View } from "./view";

export class Projectile implements Entity {
  static normalRadius = 0.01;

  pos = { x: 0, y: 0 };
  free = true;
  angle = 0;
  speed = 0.0006;
  radius = Projectile.normalRadius;
  boundary = Boundary.placeholder;

  start(pos: Position, radius: number, angle: number, boundary: Boundary) {
    if (!this.free) return;
    this.free = false;
    this.pos.x = pos.x;
    this.pos.y = pos.y;
    this.radius = radius;
    this.angle = angle;
    this.boundary = boundary;
  }

  draw(view: View) {
    if (this.free) return;
    const { x, y, radius } = view.resolve(this);
    view.ctx.beginPath();
    view.ctx.arc(x, y, radius, 0, Math.PI * 2);
    view.ctx.closePath();
    view.ctx.fillStyle = "gold";
    view.ctx.fill();
  }

  update(delta: DeltaUpdate) {
    if (this.free) return;
    this.pos.x += Math.cos(this.angle) * this.speed * delta.time;
    this.pos.y += Math.sin(this.angle) * this.speed * delta.time;

    const distance = entitiesDistance(this, this.boundary.mid);
    const threshold = this.boundary.inner.radius + this.radius;
    if (distance >= threshold) {
      this.free = true;
    }
  }
}
