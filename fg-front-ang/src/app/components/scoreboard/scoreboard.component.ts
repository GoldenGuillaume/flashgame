import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {Score} from '../../models/score';
import {ScoreService} from '../../services/score.service';

@Component({
  selector: 'app-scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.scss']
})
export class ScoreboardComponent implements OnInit, OnChanges {
  /* value get from the parent component */
  @Input()
  highscore: number;
  lowscore: number;
  avgscore: number;

  showStatus: Array<boolean>;


  rank: number;
  count: number;

  updateTime: Date;

  listScoreDesc: Array<Score>;

  /* inject of the score service */
  constructor(private score: ScoreService) {
  }

  /**
   * @description
   * initialization of all of the values in the beginning of the lifecycle hook and
   * calls to the Rest Api to fetch the scores
   */
  ngOnInit(): void {
    this.showStatus = [true, false];
    this.updateTime = new Date();
    this.score.getAllScoresDesc().subscribe( score => {
      this.listScoreDesc = score;
    });
    this.score.getCount().subscribe( count => {
      this.count = count;
    });
    this.score.getLowScore().subscribe( score => {
      this.lowscore = score.score;
    });
    this.score.getAverageScore().subscribe( avg => {
      this.avgscore = parseInt(avg.toFixed(0), 10);
    });
  }

  /**
   * @description
   * reload of all of the values when changes are made during
   * the lifecycle hook and calls to the Rest Api to fetch
   * back the scores.
   */
  ngOnChanges(): void {
    this.updateTime = new Date();
    this.score.getAllScoresDesc().subscribe( score => {
      this.listScoreDesc = score;
    });
    this.score.getCount().subscribe( count => {
      this.count = count;
    });
    this.score.getLowScore().subscribe( score => {
      this.lowscore = score.score;
    });
    this.score.getAverageScore().subscribe( avg => {
      this.avgscore = parseInt(avg.toFixed(0), 10);
    });
  }

  /**
   * @description
   * handler of the click event into the scoreboard, change status of the DOM element
   * and permit to switch view.
   * @param event : Object associated to event reached.
   * @param navLink : Identifier of the navLink clicked.
   */
  onClickHandler(event: Event, navLink: string): void {
    event.stopPropagation();
    event.preventDefault();

    if (navLink === 'stats') {
      this.showStatus[0] = true;
      this.showStatus[1] = false;
    } else if (navLink === 'scoreboard') {
      this.showStatus[0] = false;
      this.showStatus[1] = true;
    } else {
      this.showStatus[0] = false;
      this.showStatus[1] = false;
    }
  }

  /**
   * @description
   * Setter of the style into the scoreboard table to custom the
   * first three ranks styles.
   * @return Object : an object containing the styles to apply in case when the condition is reached.
   */
  setPodiumStyle(): Object {
    if (this.rank === 0) {
      return {'color': '#ffd700', 'font-weight': 'bold' };
    } else if (this.rank === 1) {
      return {'color': '#c0c0c0', 'font-weight': 'bold' };
    } else if (this.rank === 2) {
      return {'color': '#cd7f32', 'font-weight': 'bold' };
    } else {
      return {};
    }
  }

  /**
   * @description
   * Allows the date of the last data update to be displayed
   * in a readable format.
   * @return String : the readable date.
   */
  getDateUpdateFormatted(): string {
    const monthNames = [
      'January', 'February', 'March',
      'April', 'May', 'June', 'July',
      'August', 'September', 'October',
      'November', 'December'
    ];
    const days = [
      'Sunday', 'Monday', 'Tuesday',
      'Wednesday', 'Thursday', 'Friday',
      'Saturday'
    ];

    return this.updateTime.getHours() + ':' + this.updateTime.getMinutes() + ':' + this.updateTime.getSeconds() + ' - ' +
      days[this.updateTime.getDay()] + '-' + monthNames[this.updateTime.getMonth()] + '-' + this.updateTime.getFullYear();
  }

  /**
   * @description
   * return a list of the scores stored in database from the best score to the latest.
   * @return Array<Score> : the returned array.
   */
  getAllScoresByRank(): Array<Score> {
    this.rank = 0;
    return this.listScoreDesc;
  }

  /**
   * @description
   * return the actual reached rank position.
   * @usageNotes
   * initially set to 0, the rank is incremented before being rendered.
   * @return number : the rank position.
   */
  getRankPosition(): number {
    return ++this.rank;
  }

  /**
   * @description
   * return the highest score value.
   * @return number : the highest score.
   */
  getHighScore(): number {
    return this.highscore;
  }

  /**
   * @description
   * return the lowest score value.
   * @return number : the lowest score.
   */
  getLowestScore(): number {
    return this.lowscore;
  }

  /**
   * @description
   * return the average score value.
   * @return number : the average score.
   */
  getAverageScore(): number {
    return this.avgscore;
  }

  /**
   * @description
   * return the number of entries stored in the database.
   * @return number : the count result.
   */
  getEntriesCount(): number {
    return this.count;
  }
}
