var images = new Map<number, HTMLImageElement>;

export class Coin {
  static size: number = 50;

  private isGrabbed: boolean = false;
  public x: number;
  public y: number;

  constructor(public price: number, private color: string, public initX: number, public initY: number) {
    this.x = this.initX;
    this.y = this.initY;
  }

  get centerX(): number { return this.x - Coin.size; }
  get centerY(): number { return this.y - Coin.size; }

  update(cursorX: number, cursorY: number) {
    if (!this.isGrabbed)
      return;
    this.x = cursorX;
    this.y = cursorY;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(images.get(this.price) as CanvasImageSource, this.centerX, this.centerY);

    ctx.font = Coin.size / 1.5 + 'px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = this.color;
    ctx.fillText(this.price.toString(), this.x - Coin.size / 6, this.y - Coin.size / 6);
  }

  tryGrab(cursorX: number, cursorY: number): boolean {
    if ((Math.sqrt(Math.pow(this.x - cursorX, 2) + Math.pow(this.y - cursorY, 2))) <= Coin.size * 1.5) {
      this.isGrabbed = true;
      return true;
    }
    return false;
  }

  stopGrab(): void {
    this.isGrabbed = false;
  }

  isCollideBox(left: number, right: number, bottom: number, top: number): boolean {
    return (
      left < this.x &&
      this.x < right &&
      top < this.y &&
      this.y < bottom
    );
  }

  copy(): Coin {
    return new Coin(this.price, this.color, this.initX, this.initY);
  }
}


const chip1 = new Image();
chip1.src = "resources/chip1.png";
chip1.width = Coin.size;
chip1.height = Coin.size;
images.set(1, chip1);

const chip5 = new Image();
chip5.src = "resources/chip5.png";
chip5.width = Coin.size;
chip5.height = Coin.size;
images.set(5, chip5);

const chip10 = new Image();
chip10.src = "resources/chip10.png";
chip10.width = Coin.size;
chip10.height = Coin.size;
images.set(10, chip10);

const chip50 = new Image();
chip50.src = "resources/chip50.png";
chip50.width = Coin.size;
chip50.height = Coin.size;
images.set(50, chip50);
