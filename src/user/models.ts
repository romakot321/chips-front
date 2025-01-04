export class UserModel {
  public id: number | null = null;
  public score: number;

  constructor(public name: string, score: number | undefined = undefined) {
    this.score = score ?? 0;
  }

  addScore(value: number) {
    this.score += value;
  }
}

export class Vector {
  constructor(public x: number, public y: number) { }

  add(other: Vector): Vector {
    this.x += other.x;
    this.y += other.y;
    return this;
  }
}
