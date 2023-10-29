import { Boundary } from "./boundary";
import { DeltaUpdate } from "./delta";
import { Entity, Position } from "./types";
import { entitiesAngle, entitiesCollideEh, entitiesDistance } from "./utils";
import { View } from "./view";

export class Player implements Entity {
  radius = 0.02;
  shooting = false;
  target?: Entity;
  speed = 0.0003;

  constructor(
    public pos: Position,
    public boundary: Boundary,
  ) {}

  draw(view: View) {
    const { x, y, radius } = view.resolve(this);
    view.ctx.beginPath();
    view.ctx.arc(x, y, radius, 0, Math.PI * 2);
    view.ctx.closePath();
    view.ctx.fillStyle = this.shooting ? "red" : "white";
    view.ctx.fill();

    if (!this.target) return;

    const angle = entitiesAngle(this, this.target);
    const distance = entitiesDistance(this, this.target);
    const radius2 = view.resolveRadius(distance);
    const target = view.resolve(this.target);
    view.ctx.beginPath();
    const angle2 = (angle - Math.PI / 4) % (Math.PI * 2);
    const angle3 = (angle + Math.PI / 4) % (Math.PI * 2);
    view.ctx.arc(x, y, radius2, angle, angle2, true);
    view.ctx.moveTo(target.x, target.y);
    view.ctx.arc(x, y, radius2, angle, angle3);
    view.ctx.moveTo(target.x, target.y);
    view.ctx.lineTo(x, y);
    view.ctx.moveTo(target.x, target.y);
    view.ctx.closePath();
    view.ctx.lineWidth = 4;
    view.ctx.setLineDash([4, 64, 4, 96, 4, 192, 4, 352, 4, 576, 4, 864]);
    view.ctx.strokeStyle = this.shooting ? "red" : "white";
    view.ctx.stroke();
  }

  update(delta: DeltaUpdate) {
    this.shooting = delta.shooting;
    this.updatePosition(delta);
  }

  updatePosition(delta: DeltaUpdate) {
    if (!this.target) return;
    if (entitiesCollideEh(this.target, this)) return;

    let angle = entitiesAngle(this, this.target);
    this.pos.x += Math.cos(angle) * this.speed * delta.time;
    this.pos.y += Math.sin(angle) * this.speed * delta.time;

    const distance = entitiesDistance(this, this.boundary.mid);
    const threshold = this.boundary.inner.radius - this.radius;
    if (distance <= threshold) return;

    angle = entitiesAngle(this.boundary.mid, this);
    this.pos.x = Math.cos(angle) * threshold;
    this.pos.y = Math.sin(angle) * threshold;
  }

  get targetAngle() {
    return this.target ? entitiesAngle(this, this.target) : 0;
  }
}
