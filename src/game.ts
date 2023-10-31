import { Boundary } from "./boundary";
import { DeltaUpdate } from "./delta";
import { Enemy } from "./enemy";
import { Level } from "./level";
import { Player } from "./player";
import { Pool } from "./pool";
import { Projectile } from "./projectile";
import { Position } from "./types";
import { entitiesCollideEh } from "./utils";
import { View } from "./view";

const origin: Position = { x: 0, y: 0 };

export class Game {
  boundary = new Boundary();
  levels = Level.initArray();
  player: Player;
  enemies: Pool<Enemy>;
  projectiles = new Pool(40, Projectile, 100);
  private levelIndex = 0;

  constructor() {
    const waveSize = new URLSearchParams(location.search).has("easy") ? 4 : 40;
    this.enemies = new Pool(waveSize, Enemy, 100);
    let json: any;
    try {
      const raw = localStorage.getItem("rundel-space-game");
      if (raw) json = JSON.parse(raw);
    } catch {}
    if (typeof json === "object" && json != null) {
      if (typeof json.levelIndex === "number") {
        this.levelIndex = json.levelIndex % this.levels.length;
      }
    }
    console.log(this.boundary);
    this.player = new Player(this.boundary);
    this.player.start();
    this.startLevel();
  }

  draw(view: View) {
    this.drawOuter(view);
    this.drawInner(view);
    this.drawEnemies(view);
    this.player.draw(view);
    this.drawProjectiles(view);
    if (this.player.supernovaTimer) this.drawSupernova(view);
  }

  drawOuter(view: View) {
    view.ctx.fillStyle = this.level.color;
    view.ctx.fillRect(0, 0, view.width, view.height);
  }

  drawInner(view: View) {
    const { x, y, radius } = view.resolve(this.boundary.inner);
    view.ctx.beginPath();
    view.ctx.arc(x, y, radius, 0, Math.PI * 2);
    view.ctx.closePath();
    view.ctx.fillStyle = "black";
    view.ctx.fill();
  }

  drawEnemies(view: View) {
    for (const enemy of this.enemies) {
      if (!enemy.free) enemy.draw(view);
    }
  }

  drawProjectiles(view: View) {
    for (const projectile of this.projectiles) {
      if (!projectile.free) projectile.draw(view);
    }
  }

  drawSupernova(view: View) {
    const fontSize = Math.max(24, Math.min(96, (24 * view.scale) / 500));
    view.ctx.font = `small-caps bold ${fontSize}px serif`;
    view.ctx.fillStyle = "black";
    view.ctx.textAlign = "center";
    view.ctx.fillText(
      "You went supernova! A new star will be formed for you.",
      view.half.width,
      view.half.height,
    );
    view.ctx.fillText(
      "Continue [Space]",
      view.half.width,
      view.half.height * 1.2,
    );
  }

  update(delta: DeltaUpdate) {
    this.updateProjectiles(delta);
    this.updateEnemies(delta);
    this.player.update(delta);
  }

  updateEnemies(delta: DeltaUpdate) {
    this.enemies.updatePoolTimer(delta);
    for (const enemy of this.enemies) {
      if (enemy.free) continue;
      enemy.update(delta);

      if (entitiesCollideEh(this.player, enemy)) {
        this.player.drainEnergy(enemy);
        enemy.free = true;
      }
    }
  }

  updateProjectiles(delta: DeltaUpdate) {
    this.projectiles.updatePoolTimer(delta);
    for (const projectile of this.projectiles) {
      if (projectile.free) continue;
      projectile.update(delta);
      for (const enemy of this.enemies) {
        if (!enemy.free && entitiesCollideEh(enemy, projectile)) {
          enemy.free = true;
        }
      }
    }
    if (this.enemies.idle) {
      this.levelIndex = (this.levelIndex + 1) % this.levels.length;
      localStorage.setItem(
        "rundel-space-game",
        JSON.stringify({ levelIndex: this.levelIndex }),
      );
      this.startLevel();
    }
    if (!this.player.target || !delta.shooting) return;
    this.projectiles
      .getFree()
      ?.start(
        this.player.pos,
        Projectile.normalRadius,
        this.player.targetAngle,
        this.boundary,
      );
    this.projectiles
      .getFree()
      ?.start(
        this.player.pos,
        Projectile.normalRadius,
        ((this.player.targetAngle - Math.PI / 4) % Math.PI) * 25,
        this.boundary,
      );
    this.projectiles
      .getFree()
      ?.start(
        this.player.pos,
        Projectile.normalRadius,
        ((this.player.targetAngle + Math.PI / 4) % Math.PI) * 2,
        this.boundary,
      );
  }

  get level() {
    return this.levels[this.levelIndex];
  }

  startLevel() {
    for (const enemy of this.enemies) {
      enemy.start(this.player);
    }
  }
}
