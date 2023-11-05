import { Boundary } from "./boundary";
import { DeltaUpdate } from "./delta";
import { Enemy } from "./enemy";
import { Level } from "./level";
import { Player } from "./player";
import { Pool } from "./pool";
import { Projectile } from "./projectile";
import { Position } from "./types";
import { entitiesCollideEh, teleportOutside } from "./utils";
import { View } from "./view";

export class Game {
  boundary = new Boundary();
  levels = Level.initArray();
  player: Player;
  enemies: Pool<Enemy>;
  projectiles = new Pool(120, Projectile, 50);
  private levelIndex = 0;
  waveSize: number;

  constructor() {
    this.waveSize = new URLSearchParams(location.search).has("easy") ? 4 : 40;
    this.enemies = new Pool(this.waveSize, Enemy, 100);
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
    this.drawStats(view);
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
    view.ctx.font = `small-caps bold ${view.fontSize * 2}px sans-serif`;
    view.ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    view.ctx.textAlign = "center";
    const x = view.half.width;
    let y = view.half.height;
    view.ctx.fillText("YOU WENT SUPERNOVA!", x, y);
    y += view.fontSize * 2.5;
    view.ctx.fillText("GAME OVER", x, y);
    y += view.fontSize * 2.5;
    if (!this.player.supernovaTimer) return;
    if (this.player.supernovaTimer < this.player.supernovaInterval) return;
    view.ctx.fillText("SPAWN A NEW STAR [Space]", x, y);
  }

  drawStats(view: View) {
    view.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    view.ctx.textBaseline = "top";
    view.ctx.textAlign = "left";
    view.ctx.font = `small-caps bold ${view.fontSize}px sans-serif`;
    const x = view.fontSize * 0.5;
    let y = view.fontSize * 0.5;
    view.ctx.fillText(`${this.deathFormatted}`, x, y);
    y += view.fontSize * 1.2;
    view.ctx.fillText(`LEVEL ${this.levelIndex}`, x, y);
    if (this.player.supernovaTimer) return;
    y += view.fontSize * 1.2;
    view.ctx.fillText(`TARGETS ${this.enemies.used}`, x, y);
    y += view.fontSize * 1.2;
    view.ctx.fillText(`HITS ${this.player.kills}`, x, y);
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
        this.player.kills++;
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
          enemy.damage += 0.0005;
          if (this.player.energy < 0) this.player.energy = 0;
          if (enemy.damage < enemy.radius) continue;
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
    if (this.player.radius > this.boundary.inner.radius) return;
    const angles = this.player.shootAngles(5);
    const projs: Projectile[] = [];
    const poss: Position[] = [];
    const free = this.projectiles.getFree(5);
    for (let i = 0; i < free.length; i++) {
      const projectile = free[i];
      if (!projectile) break;
      projs.push(projectile);
      const angle = angles[i];
      const pos = teleportOutside(this.player, angle);
      poss.push(pos);
      projectile.start(pos, Projectile.normalRadius, angle, this.boundary);
    }
  }

  updatePlayer(delta: DeltaUpdate) {
    this.player.update(delta);
    if (this.player.supernovaTimer) {
      if (this.player.supernovaTimer > this.player.supernovaInterval) {
        if (this.player.hasInteracted) {
          if (this.player.radius >= this.boundary.nova.radius) {
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
    this.enemies.updateSize(this.waveSize * (this.levelIndex + 1));
    for (const enemy of this.enemies) {
      enemy.start(this.player);
    }
  }

  get death() {
    return 500000 / (this.player.radius / this.boundary.inner.radius);
  }

  get deathFormatted() {
    const formats = [
      { value: 1e12, symbol: "TRILLION" },
      { value: 1e9, symbol: "BILLION" },
      { value: 1e6, symbol: "MILLION" },
    ];
    const death = this.death;
    for (const format of formats) {
      if (death >= format.value) {
        return `${Math.floor(death / format.value).toLocaleString()} ${
          format.symbol
        } YEARS LEFT`;
      }
    }
    return `${Math.floor(death).toLocaleString()} YEARS LEFT`;
  }
}
