import { Boundary } from "./boundary";
import { DeltaUpdate } from "./delta";
import { Entity } from "./types";
import { entitiesAngle, entitiesCollideEh, entitiesDistance } from "./utils";
import { View } from "./view";

export class Enemy {
  static normalSpeed = 0.001;

  pos = { x: 0, y: 0 };
  free = true;
  speed = Enemy.normalSpeed;
  target = Boundary.placeholder.mid;
  radius = 0;
  boundary = Boundary.placeholder;
  permeationTimer?: number;
  permeationInterval = 2000;

  start(target: Entity) {
    if (!this.free) return;
    this.free = false;
    this.target = target;
    delete this.permeationTimer;
    const angle = Math.random() * Math.PI * 2;
    const x = Math.cos(angle) * 3;
    const y = Math.sin(angle) * 3;
    this.radius = Math.random() * 0.05 + 0.01;
    this.speed = Math.random() * 0.001 - 0.0005 + Enemy.normalSpeed;
    this.pos.x = x;
    this.pos.y = y;
  }

  draw(view: View) {
    const { x, y, radius } = view.resolve(this);
    view.ctx.beginPath();
    view.ctx.arc(x, y, radius, 0, Math.PI * 2);
    view.ctx.closePath();
    view.ctx.fillStyle =
      entitiesDistance(this, this.boundary.mid) + this.radius >
      this.boundary.inner.radius
        ? "black"
        : view.level.color;
    view.ctx.fill();
  }

  update(delta: DeltaUpdate) {
    if (!this.permeationTimer && entitiesCollideEh(this, this.boundary.inner)) {
      this.permeationTimer = 1;
      return;
    }

    const target = this.permeationTimer ? this.target : this.boundary.inner;

    if (this.permeationTimer) {
      if (this.permeationTimer < this.permeationInterval) {
        this.permeationTimer += delta.time;
        return;
      }
    }

    const angle = entitiesAngle(this, target);
    const step = this.speed * delta.time;
    this.pos.x += Math.cos(angle) * step;
    this.pos.y += Math.sin(angle) * step;
  }
}
