import { DeltaUpdate } from "./delta";
import { Game } from "./game";
import "./style.css";
import { Pointer } from "./types";
import { View } from "./view";

function initialize() {
  const ctx = canvas1.getContext("2d")!;
  const game = new Game();
  const view = new View(ctx, game);
  console.log(game);
  console.log(view);
  const delta = new DeltaUpdate();
  const pointers = new Map<number, Pointer>();
  const keys = new Set<string>();

  let lastTime = 0;
  function animate(timeStamp: number) {
    game.draw(view);

    delta.time = timeStamp - lastTime;
    lastTime = timeStamp;
    delta.shooting = keys.has("Space") || pointers.size > 1;
    game.player.target = view.pointersToTarget([...pointers.values()]);

    game.update(delta);

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);

  // Moving on Desktop / Mobile + Shooting on Mobile
  ctx.canvas.addEventListener("pointerdown", (event) => {
    const { pressure, x, y } = event;
    pointers.set(event.pointerId, { pressure, x, y, time: Date.now() });
  });
  ctx.canvas.addEventListener("pointermove", (event) => {
    const { pressure, x, y } = event;
    const pointer = pointers.get(event.pointerId);
    if (pointer) {
      pointer.x = x;
      pointer.y = y;
      pointer.pressure = pointer.pressure;
      pointer.time ??= Date.now();
    } else {
      pointers.set(event.pointerId, { pressure, x, y, time: Date.now() });
    }
  });
  ctx.canvas.addEventListener("pointerup", (event) => {
    pointers.delete(event.pointerId);
  });
  ctx.canvas.addEventListener("pointercancel", (event) => {
    pointers.delete(event.pointerId);
  });
  ctx.canvas.addEventListener("pointerleave", (event) => {
    pointers.delete(event.pointerId);
  });

  // Shooting on desktop
  addEventListener("keydown", (event) => {
    if (event.code === "Space") keys.add("Space");
  });
  addEventListener("keyup", (event) => {
    if (event.code === "Space") keys.delete("Space");
  });

  addEventListener("blur", () => {
    keys.clear();
  });

  // Viewport change
  addEventListener("resize", () => {
    view.resize();
  });
  addEventListener("orientationchange", () => {
    view.resize();
  });

  // Disable swipes etc interrupting game on iOS
  addEventListener("touchstart", prevent, { passive: false });
  addEventListener("touchmove", prevent, { passive: false });
  addEventListener("contextmenu", prevent, { passive: false });
  addEventListener("selectstart", prevent, { passive: false });
  addEventListener("selectionchange", prevent, { passive: false });

  function prevent(event: Event) {
    event.preventDefault();
  }
}

addEventListener("load", () => {
  initialize();
});

declare global {
  const wrapper: HTMLDivElement;
  const canvas1: HTMLCanvasElement;
}
