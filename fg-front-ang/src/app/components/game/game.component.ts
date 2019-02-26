import {AfterViewInit, Component, ElementRef, HostListener, Input, ViewChild} from '@angular/core';
import {AppService} from '../../services/lib/app.service';
import {GameService} from '../../services/lib/game.service';
import {Score} from '../../models/score';
import {ScoreService} from '../../services/score.service';
import {NgForm} from '@angular/forms';

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
  @HostListener('document:keydown', ['$event']) onKeyDownHandler(event: KeyboardEvent) {
    this.loader.movePlayer(event, 'keydown');
  }

  @HostListener('document:keyup', ['$event']) onKeyUpHandler(event: KeyboardEvent) {
    this.loader.movePlayer(event, 'keyup');
  }

  constructor(private loader: AppService, private game: GameService, private score: ScoreService) {}

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


  onSubmit(form: NgForm): void {
    this.showModal = false;
    this.userScore.setName(form.value['pseudo']);
    this.score.insertScore(this.userScore).subscribe(score => {
      this.userScore = score;
    });
    console.log('in the submit method!');
  }

}
