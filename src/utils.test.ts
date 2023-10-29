import { describe, expect, test } from "vitest";
import { entitiesAngle } from "./utils";

describe("entitiesAngle", () => {
  test("finds correct angle", () => {
    const a = { pos: { x: 0, y: 0 }, radius: 0 };
    const b = { pos: { x: 1, y: 0 }, radius: 0 };
    expect(entitiesAngle(a, b)).toEqual(0);
  });
});
