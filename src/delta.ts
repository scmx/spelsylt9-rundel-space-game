import { Entity } from "./types";

export class DeltaUpdate {
  time = 0;
  shooting = false;
  target?: Entity;
}
