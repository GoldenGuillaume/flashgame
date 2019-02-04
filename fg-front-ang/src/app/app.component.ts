import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {ScoreService} from './services/score.service';
import {Score} from './models/score';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  // @ts-ignore
  contentScores: {
    highScore: number,
    userScore: Score
  } = {};
  scroll: boolean;
  badgeHidden: boolean;
  private yOffSet: any;

  @ViewChild('navbar') navElement: ElementRef;

  constructor(private score: ScoreService) {
    this.scroll         = false;
    this.badgeHidden    = true;
  }

  ngOnInit(): void {
    this.score.getHighScore().subscribe( score => {
      console.log('Score value: ' + score.score);
      console.log('Object: ' + score);
      this.contentScores.highScore = score.score;
    });
    this.score.getScoreOnIp().subscribe( score => {
      console.log('Score value: ' + score.score);
      console.log('Object: ' + score);
      this.contentScores.userScore = score;
    });
  }

  ngAfterViewInit(): void {
    this.yOffSet = this.navElement.nativeElement.offsetTop;
  }

  onClickReset(): void {
    console.log('----------INFO------------');
    console.log(this.contentScores.highScore);
    console.log(this.contentScores.userScore.score);
    console.log(this.contentScores.userScore._id);
    console.log('--------------------------');
    this.score.deleteScore(this.contentScores.userScore._id);
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(): void {
    const currYOffset = window.pageYOffset;

    if (this.yOffSet < currYOffset) {
      this.scroll = true;
    } else {
      this.scroll = false;
    }
  }
}
