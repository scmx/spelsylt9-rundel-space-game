export class Level {
  constructor(public color: string) {}

  static initArray() {
    return [
      new Level("#fdd"),
      new Level("#ddf"),
      new Level("#dfd"),
      new Level("#fdf"),
      new Level("#ffd"),
      new Level("#dff"),
    ];
  }
}
