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

  createGameEnvironment(canvasElement): void {
    this.game.loadSpritesAssets(canvasElement).then( () => {
      this.isAssetsLoaded.emit();
    });
  }

  getAssetsLoadedEmitter(): EventEmitter<number> {
    return this.isAssetsLoaded;
  }

  movePlayer(event: KeyboardEvent, type: string): void {
    if (type === KeyEvent.PRESSED) {
      /* to prevent the scrolling of the page */
      event.preventDefault();
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
    } else if (type === KeyEvent.RELEASED) {
      this.game.keysAction.set('moveDown', false);
      this.game.keysAction.set('moveLeft', false);
      this.game.keysAction.set('moveRight', false);
      this.game.keysAction.set('moveUp', false);
    }
  }
}


