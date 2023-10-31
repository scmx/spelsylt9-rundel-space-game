import { Boundary } from "./boundary";
import { DeltaUpdate } from "./delta";
import { Entity } from "./types";
import { entitiesAngle, entitiesCollideEh, entitiesDistance } from "./utils";
import { View } from "./view";

export class Player implements Entity {
  static defaultRadius = 0.02;
  static defaultSpeed = 0.0003;

  radius = Player.defaultRadius;
  shooting = false;
  target?: Entity;
  speed = 0.0003;
  energy = 0;
  supernovaTimer?: number;
  supernovaInterval: 2000;
  hasInteracted = false;
  pos = { x: 0, y: 0 };

  constructor(public boundary: Boundary) {}

  start() {
    this.radius = Player.defaultRadius;
    this.shooting = false;
    delete this.target;
    this.speed = Player.defaultSpeed;
    this.energy = 0;
    delete this.supernovaTimer;
    this.hasInteracted = false;
    this.pos.x = this.boundary.mid.pos.x;
    this.pos.y = this.boundary.mid.pos.y;
  }

  draw(view: View) {
    const { x, y, radius } = view.resolve(this);
    view.ctx.beginPath();
    view.ctx.arc(x, y, radius, 0, Math.PI * 2);
    view.ctx.closePath();
    view.ctx.fillStyle = this.supernovaTimer
      ? "white"
      : this.shooting
      ? "red"
      : "orange";
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
    if (this.shooting) this.hasInteracted = true;
    if (this.supernovaTimer) {
      this.supernovaTimer += delta.time;
      if (this.supernovaTimer < this.supernovaInterval) return;
      if (!this.hasInteracted) return;
      this.start();
    }
    this.updatePosition(delta);
  }

  updatePosition(delta: DeltaUpdate) {
    if (!this.target) return;
    if (this.shooting) this.hasInteracted = true;
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

  drainEnergy(entity: Entity) {
    if (this.supernovaTimer) return;
    this.energy += 1;
    const area1 = this.radius ** 2 * Math.PI;
    const area2 = entity.radius ** 2 * Math.PI;
    const area3 = area1 + area2;
    this.radius += Math.sqrt(area3 ** (this.energy ** (1 / 2)) / Math.PI);
    if (this.radius < 3) return;
    this.supernovaTimer = 1;
    this.hasInteracted = false;
  }
}
