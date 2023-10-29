export interface Entity extends Circle {
  pos: Position;
}

export interface Poolable {
  free: boolean;
  start(...args: any[]): void;
}

export interface Circle {
  radius: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface Pointer {
  x: number;
  y: number;
  pressure: number;
  time: number;
}
