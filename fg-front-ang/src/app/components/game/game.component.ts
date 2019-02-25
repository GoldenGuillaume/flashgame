import {AfterViewInit, Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {AppService} from '../../services/lib/app.service';
import {GameService} from '../../services/lib/game.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements AfterViewInit {

  subscribed: any;

  @ViewChild('gameCanvas') canvas: ElementRef;
  @HostListener('document:keydown', ['$event']) onKeyDownHandler(event: KeyboardEvent) {
    this.loader.movePlayer(event, 'keydown');
  }

  @HostListener('document:keyup', ['$event']) onKeyUpHandler(event: KeyboardEvent) {
    this.loader.movePlayer(event, 'keyup');
  }

  constructor(private loader: AppService, private game: GameService) {}

  ngAfterViewInit(): void {
    this.loader.createGameEnvironment(this.canvas.nativeElement);
    this.subscribed = this.loader.getAssetsLoadedEmitter().subscribe(() => {
      this.game.startGame();
    });
  }

}
