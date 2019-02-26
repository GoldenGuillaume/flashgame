import {Injectable, Input} from '@angular/core';

import * as CONFIG from '../../configs/gameConfig';
import {Obstacles} from '../../interfaces/obstacles';
import {SingleObstacles} from '../../interfaces/singleObstacles';
import {PlayerPosition} from '../../interfaces/playerPosition';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  @Input() width: number = CONFIG.canvasWidth;
  @Input() height: number = CONFIG.canvasHeight;

  frameNumber: number = CONFIG.frameNumber;
  obstacles: Array<Obstacles> = [];

  player: PlayerPosition = {
    x: CONFIG.canvasWidth / 2 - CONFIG.playerCar.width + 15,
    y: CONFIG.canvasHeight - (CONFIG.playerCar.height + CONFIG.playerCar.height / 2)
  };

  context: CanvasRenderingContext2D;
  sprite: HTMLImageElement = null;

  gameLoop = null;
  keysAction: Map<string, boolean>;

  gameOver: boolean;
  score: number;

  constructor() {
    this.keysAction = new Map<string, boolean>([['moveLeft', false], ['moveRight', false], ['moveUp', false], ['moveDown', false]]);
  }

  loadSpritesAssets(canvas: HTMLCanvasElement): Promise<void> {
    this.context = canvas.getContext('2d');
    canvas.width = this.width;
    canvas.height = this.height;

    return new Promise((resolve) => {
      this.sprite = new Image();
      this.sprite.src = CONFIG.spritePath;
      this.sprite.width = 58;
      this.sprite.height = 128;
      resolve();
    });
  }

  startGame(): Promise<number> {
    this.score = 0;
    this.gameOver = false;
    /* launch the loop every 10 miliseconds */
    return new Promise<number>((resolve) => {
      this.gameLoop = setInterval(() => {
        this.suffleProperties();
        this.cleanCanvas();
        this.renderBackground();
        this.createObstacles();
        this.moveObstacles();
        this.createPlayer();
        this.updateScore();
        if (this.gameOver) {
          resolve(this.score);
        }
        console.log(this.score);
      }, 10);
    });
    // window.location.reload();
  }

  updateScore(): void {
    if (this.animationFrame(10)) {
      this.score += 1;
    }
  }

  animationFrame(n: number): boolean {
    return (this.frameNumber / n) % 1 === 0;
  }

  suffleProperties(): void {
    this.frameNumber += 1;
  }

  createObstacles(): void {
    if (this.frameNumber === 1 || this.animationFrame(100)) {
      if (this.obstacles.length > 20) {
        this.obstacles.splice(0, 5);
      }
      this.getSingleObstacle();
    }
  }

  getSingleObstacle(): void {
    const context: CanvasRenderingContext2D = this.context;
    const image: HTMLImageElement = this.sprite;
    const randomVehicle: SingleObstacles = CONFIG.vehicles[Math.floor(Math.random() * CONFIG.vehicles.length)];

    this.obstacles.push(new function () {
      this.x = Math.floor(Math.random() * CONFIG.canvasWidth - 50);
      this.y = Math.floor(Math.random() * -15);
      this.width = randomVehicle.width;
      this.height = randomVehicle.height;
      this.update = () => {
        context.drawImage(image, randomVehicle.sX, randomVehicle.sY,
                          randomVehicle.sWidth, randomVehicle.sHeight, this.x,
                          this.y, randomVehicle.width, randomVehicle.height);
      };
    });
  }

  moveObstacles(): void {
    this.obstacles.forEach((element: Obstacles, index: number) => {
      element.y += 3;
      element.update();
      this.checkCollision(element);
      if (element.y > this.height) {
        this.obstacles.splice(index, 1);
      }
    });
  }


  cleanCanvas(): void {
    this.context.clearRect(0, 0, CONFIG.canvasWidth, CONFIG.canvasHeight);
  }

  renderBackground(): void {
    this.context.drawImage(this.sprite, CONFIG.background.sX, CONFIG.background.sY,
                           CONFIG.background.sWidth, CONFIG.background.sHeight, 0,
                           0, CONFIG.canvasWidth, CONFIG.canvasHeight);

  }

  createPlayer(): void {
    if (this.keysAction.get('moveUp')) {
      if (this.player.y !== 0) {
        this.player.y -= CONFIG.playerCarSpeed;
      }
    } else if (this.keysAction.get('moveDown')) {
      if (this.player.y + CONFIG.playerCar.height !== CONFIG.canvasHeight ||
          this.player.y + CONFIG.playerCar.height < CONFIG.canvasHeight) {
        this.player.y += CONFIG.playerCarSpeed;
      }
    } else if (this.keysAction.get('moveLeft')) {
      if (this.player.x !== 0 || this.player.x > 0) {
        this.player.x -= CONFIG.playerCarSpeed;
      }
    } else if (this.keysAction.get('moveRight')) {
      if (this.player.x + CONFIG.playerCar.width !== CONFIG.canvasWidth ||
          this.player.x + CONFIG.playerCar.width < CONFIG.canvasWidth) {
        this.player.x += CONFIG.playerCarSpeed;
      }
    }

    this.context.drawImage(this.sprite, CONFIG.playerCar.sX, CONFIG.playerCar.sY,
                           CONFIG.playerCar.sWidth, CONFIG.playerCar.sHeight,
                           this.player.x, this.player.y,
                           CONFIG.playerCar.width, CONFIG.playerCar.height);
  }

  checkCollision(obstacle: Obstacles): void {
    if (((this.player.x + CONFIG.playerCar.width > obstacle.x) && (this.player.y < obstacle.y + obstacle.height)) &&
        ((this.player.x < obstacle.x + obstacle.width) && (this.player.y < obstacle.y + obstacle.height)) &&
        ((this.player.x + CONFIG.playerCar.width > obstacle.x) && (this.player.y + CONFIG.playerCar.height > obstacle.y)) &&
        ((this.player.x < obstacle.x + obstacle.width) && (this.player.y + CONFIG.playerCar.height > obstacle.y))) {
      clearInterval(this.gameLoop);
      this.gameOver = true;
    }
  }
}
