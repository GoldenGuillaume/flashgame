import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {ScoreService} from './services/score.service';
import {Score} from './models/score';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {

  highscore: number;
  userScore: Score;

  scroll: boolean;
  badgeHidden: boolean;
  private yOffSet: any;

  @ViewChild('navbar') navElement: ElementRef;

  constructor(private score: ScoreService) {
    this.scroll         = false;
    this.badgeHidden    = true;
    this.userScore = new Score();
  }

  /**
   * @description
   * initialization of all of the values in the beginning of the lifecycle hook and
   * calls to the Rest Api to fetch the user score and highscore.
   */
  ngOnInit(): void {
    this.score.getHighScore().subscribe( score => {
      this.highscore = score.score;
    });
    this.score.getScoreOnIp().subscribe( score => {
      if (score !== null) {
        this.userScore = score;
      }

    });
  }

  /**
   * @description
   * setting of the vertical offset after the view being initiated
   * in the lifecycle hook.
   */
  ngAfterViewInit(): void {
    this.yOffSet = this.navElement.nativeElement.offsetTop;
  }

  /**
   * @description
   * click event who start the API call to reset the current user score.
   * @param event : Object associated to event reached.
   */
  onClickHandlerReset(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.score.deleteScore(this.userScore._id);
  }

  /**
   * @description
   * event reached on windows scroll detection.
   */
  @HostListener('window:scroll', ['$event'])
  onWindowScroll(): void {
    const currYOffset = window.pageYOffset;

    this.scroll = this.yOffSet < currYOffset;
  }
}
