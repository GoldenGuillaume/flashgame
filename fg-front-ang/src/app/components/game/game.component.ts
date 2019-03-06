import {AfterViewInit, Component, ElementRef, HostListener, Input, ViewChild} from '@angular/core';
import {AppService} from '../../services/lib/app.service';
import {GameService} from '../../services/lib/game.service';
import {Score} from '../../models/score';
import {ScoreService} from '../../services/score.service';
import {NgForm} from '@angular/forms';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements AfterViewInit {

  subscribed: any;
  showModal: boolean = false;

  @Input()
  userScore: Score;

  @ViewChild('gameCanvas') canvas: ElementRef;

  /**
   * Keyboards events handlers for game interaction
   */
  @HostListener('document:keydown', ['$event']) onKeyDownHandler(event: KeyboardEvent) {
    this.loader.movePlayer(event, 'keydown');
  }

  @HostListener('document:keyup', ['$event']) onKeyUpHandler(event: KeyboardEvent) {
    this.loader.movePlayer(event, 'keyup');
  }

  constructor(private loader: AppService, private game: GameService, private score: ScoreService, private sanitizer: DomSanitizer) {}

  /**
   * @description
   * Subscription to the loader for the game assets who finalize with the
   * launch of the game loop and the retrieving of score.
   */
  ngAfterViewInit(): void {
    this.loader.createGameEnvironment(this.canvas.nativeElement);
    this.subscribed = this.loader.getAssetsLoadedEmitter().subscribe(() => {
      this.game.startGame().then((score) => {
        if (this.userScore._id !== undefined) {
          if (score > this.userScore.score) {
            this.userScore.score = score;
            this.score.updateScore(this.userScore).subscribe(() => {
              console.log('score updated successfully: ' + this.userScore.score);
            });
          }
        } else {
          this.userScore = new Score();
          this.userScore.setScore(score);
          this.showModal = true;
        }
      });
    });
  }


  /**
   * @description
   * Submit of the form to register score for new players after the game end
   * @param form : the form content
   */
  onSubmit(form: NgForm): void {
    this.showModal = false;
    this.userScore.setName(form.value['pseudo']);
    this.score.insertScore(this.userScore).subscribe(score => {
      this.userScore = score;
    });
    console.log('in the submit method!');
  }

  /**
   * @description
   * change the visibility of the modal when the game is finish.
   */
  modalState() {
    let style;
    if (this.showModal) {
      style = 'display: block;';
    } else {
      style = 'display: none';
    }

    return this.sanitizer.bypassSecurityTrustStyle(style);
  }
}
