import {EventEmitter, Injectable} from '@angular/core';
import {GameService} from './game.service';
import {KeyEvent} from '../../enums/keyevent';
import {KeyCode} from '../../enums/keycode';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  isAssetsLoaded: EventEmitter<number> = new EventEmitter();

  constructor(private game: GameService) { }

  /**
   * @description
   * load the sprite then emit an event who permit to trigger the game loop.
   * @param canvasElement : the canvas where the game is displayed
   */
  createGameEnvironment(canvasElement): void {
    this.game.loadSpritesAssets(canvasElement).then( () => {
      this.isAssetsLoaded.emit();
    });
  }

  /**
   * @description
   * getter for the EventEmitter
   * @return EventEmitter<number> : return the state of the Event
   */
  getAssetsLoadedEmitter(): EventEmitter<number> {
    return this.isAssetsLoaded;
  }

  /**
   * @description
   * Players keyboard input manager.
   * @param event : the keyboard event reached.
   * @param type : the type of event reached.
   */
  movePlayer(event: KeyboardEvent, type: string): void {
    if (type === KeyEvent.PRESSED) {
      /* to prevent the scrolling of the page */
      event.preventDefault();
      /* check for pausing the game */
      if (event.key === KeyCode.SPACE) {
        this.game.onBreak = !this.game.onBreak;
      } else {
        if (event.key === KeyCode.LEFT_ARROW) {
          this.game.keysAction.set('moveLeft', true);
          this.game.keysAction.set('moveRight', false);
          this.game.keysAction.set('moveUp', false);
          this.game.keysAction.set('moveDown', false);
        } else if (event.key === KeyCode.RIGHT_ARROW) {
          this.game.keysAction.set('moveRight', true);
          this.game.keysAction.set('moveLeft', false);
          this.game.keysAction.set('moveUp', false);
          this.game.keysAction.set('moveDown', false);
        } else if (event.key === KeyCode.UP_ARROW) {
          this.game.keysAction.set('moveUp', true);
          this.game.keysAction.set('moveLeft', false);
          this.game.keysAction.set('moveRight', false);
          this.game.keysAction.set('moveDown', false);
        } else if (event.key === KeyCode.DOWN_ARROW) {
          this.game.keysAction.set('moveDown', true);
          this.game.keysAction.set('moveLeft', false);
          this.game.keysAction.set('moveRight', false);
          this.game.keysAction.set('moveUp', false);
        }
      }

    } else if (type === KeyEvent.RELEASED) {
      this.game.keysAction.set('moveDown', false);
      this.game.keysAction.set('moveLeft', false);
      this.game.keysAction.set('moveRight', false);
      this.game.keysAction.set('moveUp', false);
    }
  }
}


