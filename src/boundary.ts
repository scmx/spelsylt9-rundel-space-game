export class Boundary {
  outer = { pos: { x: 0, y: 0 }, radius: 3 };
  nova = { pos: { x: 0, y: 0 }, radius: 2 };
  inner = { pos: { x: 0, y: 0 }, radius: 1 };
  mid = { pos: { x: 0, y: 0 }, radius: 0 };

  static placeholder = new Boundary();
}
