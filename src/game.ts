import { Boundary } from "./boundary";
import { DeltaUpdate } from "./delta";
import { Enemy } from "./enemy";
import { Level } from "./level";
import { Player } from "./player";
import { Pool } from "./pool";
import { Projectile } from "./projectile";
import { entitiesCollideEh, teleportOutside } from "./utils";
import { View } from "./view";

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
    this.drawProjectiles(view);
    this.player.draw(view);
    if (this.player.radius >= this.boundary.inner.radius)
      this.drawSupernova(view);
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
    if (this.player.radius < this.boundary.nova.radius) return;
    view.ctx.fillText(
      "Continue [Space]",
      view.half.width,
      view.half.height * 1.2,
    );
  }

  update(delta: DeltaUpdate) {
    this.updateProjectiles(delta);
    this.updateEnemies(delta);
    this.updatePlayer(delta);
  }

  updateEnemies(delta: DeltaUpdate) {
    this.enemies.updatePoolTimer(delta);
    for (const enemy of this.enemies) {
      if (enemy.free) {
        if (
          this.player.radius > this.boundary.inner.radius &&
          this.player.radius < this.boundary.outer.radius
        ) {
          enemy.start(this.player);
        }
        continue;
      }
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
          enemy.damage += 0.001;
          if (this.player.energy < 0) this.player.energy = 0;
          if (enemy.damage < enemy.radius) continue;
          enemy.free = true;
          this.player.releaseEnergy(enemy);
          this.player.energy = Math.max(0, this.player.energy - enemy.radius);
        }
      }
    }
    if (this.enemies.idle) {
      this.levelIndex = (this.levelIndex + 1) % this.levels.length;
      this.player.energy = -0.2;
      localStorage.setItem(
        "rundel-space-game",
        JSON.stringify({ levelIndex: this.levelIndex }),
      );
      this.startLevel();
    }
    if (!this.player.target || !delta.shooting) return;
    if (this.player.radius > this.boundary.inner.radius) return;
    for (const angle of this.player.shootAngles()) {
      const projectile = this.projectiles.getFree();
      if (!projectile) break;
      const pos = teleportOutside(this.player, angle);
      projectile.start(pos, Projectile.normalRadius, angle, this.boundary);
    }
  }

  updatePlayer(delta: DeltaUpdate) {
    this.player.update(delta);
    if (this.player.supernovaTimer) {
      if (this.player.supernovaTimer > this.player.supernovaInterval) {
        if (this.player.hasInteracted) {
          if (this.player.radius >= this.boundary.outer.radius) {
            this.player.start();
          }
        }
      }
    }
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
