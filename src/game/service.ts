import { Coin } from './models';
import { UserService } from "../user";

const backgroundImage = new Image();
backgroundImage.src = 'resources/background.jpg';


export class GameService {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private cursorX: number = 0;
  private cursorY: number = 0;
  private coinModels: Coin[];
  private userCoins: number;
  private isBetting: boolean = false;

  constructor(private userService: UserService, private username: string) {
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;

    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    if (this.canvas.height / this.canvas.width > 1.25) {
      this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
      this.ctx.rotate(Math.PI / 2);
    }

    this.coinModels = [];
    this.userCoins = 0;
  }

  private onMouseMove(event: MouseEvent): void {
    this.cursorX = event.clientX;
    this.cursorY = event.clientY;
  }

  private onTouchMove(event: TouchEvent): void {
    const touch = event.touches[event.touches.length - 1];
    this.cursorX = touch.pageX;
    this.cursorY = touch.pageY;
  }

  private onMouseDown(event: TouchEvent | MouseEvent): void {
    if (window.TouchEvent && event instanceof TouchEvent)
      this.onTouchMove(event as TouchEvent);
    else if (event instanceof MouseEvent)
      this.onMouseMove(event as MouseEvent);
    for (const coin of this.coinModels.reverse()) {
      if (coin.tryGrab(this.cursorX, this.cursorY)) {
        break;
      }
    }
  }

  private onMouseUp(event: TouchEvent | MouseEvent): void {
    for (const coin of this.coinModels)
      coin.stopGrab();
    this.cursorX = 0;
    this.cursorY = 0;
  }

  private initHandlers() {
    this.canvas.addEventListener("mousemove", (e: MouseEvent) => { this.onMouseMove(e) });
    this.canvas.addEventListener("mousedown", (e: MouseEvent) => { this.onMouseDown(e) });
    this.canvas.addEventListener("mouseup", (e: MouseEvent) => { this.onMouseUp(e) });
    this.canvas.addEventListener('touchmove', (e: TouchEvent) => { this.onTouchMove(e) });
    this.canvas.addEventListener("touchstart", (e: TouchEvent) => { this.onMouseDown(e) });
    this.canvas.addEventListener("touchend", (e: TouchEvent) => { this.onMouseUp(e) });

    // Prevent default touch behavior to avoid scrolling
    this.canvas.addEventListener('touchmove', (event) => {
        event.preventDefault();
    }, { passive: false });
  }

  private drawBetBox() {
    this.ctx.fillStyle = "black";

    this.ctx.beginPath();
    this.ctx.globalAlpha = 0.5
    this.ctx.fillRect(this.canvas.width / 3, 0, this.canvas.width / 3, this.canvas.height / 2.5);
    this.ctx.globalAlpha = 1.0
    this.ctx.closePath();
  }

  private drawScore() {
    this.ctx.fillStyle = 'white';
    this.ctx.fillText("Total: " + this.userCoins, this.canvas.width - this.canvas.width / 10 - 30, 40);
  }

  private drawBackground() {
    this.ctx.drawImage(backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
  }

  private countGrabbedCoins(): number {
    let price: number = 0;
    for (const coin of this.coinModels) {
      if (coin.initX !== coin.x && coin.initY !== coin.y)
        price += coin.price;
    }
    return price;
  }

  private spawnCoins(): void {
    if (this.isBetting)
      return;
    const onTableCoinsPrice = this.coinModels.reduce((sum, coin) => sum + coin.price, 0);
    if (onTableCoinsPrice >= this.userCoins)
      return;

    var temp = this.userCoins - onTableCoinsPrice;
    while (temp > 0) {
      if (temp > 50) {
        temp -= 50;
        this.coinModels.push(new Coin(50, "orange", this.canvas.width - Coin.size * 7, this.canvas.height / 2));
      }
      else if (temp > 10) {
        temp -= 10;
        this.coinModels.push(new Coin(10, "blue", Coin.size * 7, this.canvas.height / 2));
      }
      else if (temp > 5) {
        temp -= 5;
        this.coinModels.push(new Coin(5, "red", this.canvas.width - Coin.size * 3.5, this.canvas.height / 2));
      } else {
        temp -= 1;
        this.coinModels.push(new Coin(1, "gray", Coin.size * 3.5, this.canvas.height / 2));
      }
    }
  }

  private tick() {
    var user = this.userService.get(this.username);
    this.userCoins = (user?.score ?? 0) - this.countGrabbedCoins();
    this.spawnCoins();

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawBackground();
    this.drawBetBox();
    this.drawScore();

    for (const coin of this.coinModels) {
      coin.update(this.cursorX, this.cursorY);
      coin.draw(this.ctx);
    }

    requestAnimationFrame(this.tick.bind(this));
  }

  start() {
    Coin.size = Math.round(Math.max(this.canvas.width, this.canvas.height) / 30);

    this.initHandlers();
    this.tick();
  }

  bet(): number {
    this.isBetting = true;
    let price = 0;
    for (const coin of this.coinModels.slice()) {
      if (coin.isCollideBox(this.canvas.width / 3, this.canvas.width / 3 * 2, this.canvas.height / 2.5, 0)) {
        price += coin.price;
        this.coinModels.splice(this.coinModels.indexOf(coin), 1);
      }
    }
    this.isBetting = false;
    return price;
  }
}
