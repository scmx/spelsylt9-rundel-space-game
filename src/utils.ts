import { Entity, Position } from "./types";

export function entitiesDistance(a: Entity, b: Entity) {
  return Math.hypot(b.pos.x - a.pos.x, b.pos.y - a.pos.y);
}

export function entitiesCollideEh(a: Entity, b: Entity) {
  const distance = entitiesDistance(a, b);
  const threshold = a.radius + b.radius;
  return distance < threshold;
}

export function entitiesAngle(a: Entity, b: Entity) {
  const dx = b.pos.x - a.pos.x;
  const dy = b.pos.y - a.pos.y;
  return Math.atan2(dy, dx);
}

export function teleportOutside(a: Entity, angle: number): Position {
  const x = a.pos.x + Math.cos(angle) * a.radius;
  const y = a.pos.y + Math.sin(angle) * a.radius;
  return { x, y };
}
