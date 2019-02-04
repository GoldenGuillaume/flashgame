import { Component, OnInit } from '@angular/core';
import {Score} from '../models/score';
import {ScoreService} from '../services/score.service';

@Component({
  selector: 'app-scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.scss']
})
export class ScoreboardComponent implements OnInit {
  rank: number;
  updateTime: Date;

  constructor(private score: ScoreService) {
    this.rank = 0;
  }

  ngOnInit() {
    this.updateTime = new Date();
  }

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

  onFetchAllByRank(): Array<Score> {
    let listScoreByRank: Array<Score> = new Array<Score>();
    this.score.getAllScores().subscribe( score => {
      listScoreByRank = score;
    });
    return listScoreByRank;
  }

}
