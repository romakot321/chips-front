export class UserModel {
  public id: number | null = null;
  public position: Vector;

  constructor(public name: string, x: number | undefined = undefined, y: number | undefined = undefined) {
    this.position = new Vector(x ?? 0, y ?? 0);
  }

  move(bias: Vector): void {
    this.position.add(bias);
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
