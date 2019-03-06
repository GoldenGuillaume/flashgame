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

  onBreak: boolean = false;
  obstacleSpeed: number;
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

  /**
   * @description
   * Setting of the possible actions.
   */
  constructor() {
    this.keysAction = new Map<string, boolean>([['moveLeft', false], ['moveRight', false], ['moveUp', false], ['moveDown', false]]);
  }

  /**
   * @description
   * Load of the game sprites.
   * @param canvas : the canvas where the game is displayed
   */
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

  /**
   * @description
   * Entry point of the game, the game loop is launch here
   */
  startGame(): Promise<number> {
    this.obstacleSpeed = 3;
    this.score = 0;
    this.gameOver = false;
    /* launch the loop every 10 miliseconds */
    return new Promise<number>((resolve) => {
      this.gameLoop = setInterval(() => {
        if (!this.onBreak) {
          this.suffleProperties();
          this.cleanCanvas();
          this.renderBackground();
          this.updateDifficulty();
          this.createObstacles();
          this.moveObstacles();
          this.createPlayer();
          this.updateScore();

          if (this.gameOver) {
            resolve(this.score);
          }
          console.log(this.score);
        }
      }, 10);
    });
    // window.location.reload();
  }

  /**
   * @description
   * update of the score at each loop of the game
   */
  updateScore(): void {
    if (this.animationFrame(10)) {
      this.score += 1;
    }
  }

  /**
   * @description
   * update difficulty every defined time.
   */
  updateDifficulty(): void {
    if (this.animationFrame(1000)) {
      this.obstacleSpeed++;
    }
  }

  /**
   * @description
   * return a boolean who determine if an obstacle will be created
   * @param n : the frequency when an obstacle is created.
   */
  animationFrame(n: number): boolean {
    return (this.frameNumber / n) % 1 === 0;
  }

  /**
   * @description
   * increment the frame number
   */
  suffleProperties(): void {
    this.frameNumber += 1;
  }

  /**
   * @description
   * create obstacle depending on frame.
   */
  createObstacles(): void {
    if (this.frameNumber === 1 || this.animationFrame(100)) {
      if (this.obstacles.length > 20) {
        this.obstacles.splice(0, 5);
      }
      this.getSingleObstacle();
    }
  }

  /**
   * @description
   * add a new obstacle to the array of them with an random position at the top of the canvas.
   */
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

  /**
   * @description
   * Update the obstacles and check if an collision occur
   */
  moveObstacles(): void {
    this.obstacles.forEach((element: Obstacles, index: number) => {
      element.y += this.obstacleSpeed;
      element.update();
      this.checkCollision(element);
      if (element.y > this.height) {
        this.obstacles.splice(index, 1);
      }
    });
  }

  /**
   * @description
   * clean all the canvas
   */
  cleanCanvas(): void {
    this.context.clearRect(0, 0, CONFIG.canvasWidth, CONFIG.canvasHeight);
  }

  /**
   * @description
   * draw the background
   */
  renderBackground(): void {
    this.context.drawImage(this.sprite, CONFIG.background.sX, CONFIG.background.sY,
                           CONFIG.background.sWidth, CONFIG.background.sHeight, 0,
                           0, CONFIG.canvasWidth, CONFIG.canvasHeight);

  }

  /**
   * @description
   * render the player on the canvas and update is
   * position depending on what key events has been reached.
   */
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

  /**
   * @description
   * check if an collision occur between player and obstacles
   * @param obstacle : the obstacle checked.
   */
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
