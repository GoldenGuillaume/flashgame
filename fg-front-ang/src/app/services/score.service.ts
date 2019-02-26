import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';
import {Score} from '../models/score';

@Injectable({
  providedIn: 'root'
})
export class ScoreService {

  constructor(private http: HttpClient) { }

  static handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('Error occuring:', error.error.message);
    } else {
      console.error('API returned code ${error.status}\n' + 'error core is: ${error.error}');
    }
    return throwError('An error occured');
  }

  getScore(id: number): Observable<Score> {
    return this.http.get<Score>('http://localhost:3000/api/score/' + id).pipe(retry(1), catchError(ScoreService.handleError));
  }

  getScoreOnIp(): Observable<Score> {
    return this.http.get<Score>('http://localhost:3000/api/scores/ip').pipe(retry(1), catchError(ScoreService.handleError));
  }

  getHighScore(): Observable<Score> {
    return this.http.get<Score>('http://localhost:3000/api/scores/highscore').pipe(retry(1), catchError(ScoreService.handleError));
  }

  getLowScore(): Observable<Score> {
    return this.http.get<Score>('http://localhost:3000/api/scores/lowscore').pipe(retry(1), catchError(ScoreService.handleError));
  }

  getAllScores(): Observable<Score[]> {
    return this.http.get<Score[]>('http://localhost:3000/api/scores').pipe(retry(1), catchError(ScoreService.handleError));
  }

  getAllScoresDesc(): Observable<Score[]> {
    return this.http.get<Score[]>('http://localhost:3000/api/scores/desc').pipe(retry(1), catchError(ScoreService.handleError));
  }

  getCount(): Observable<number> {
    return this.http.get<number>('http://localhost:3000/api/scores/count').pipe(retry(1), catchError(ScoreService.handleError));
  }

  getAverageScore(): Observable<number> {
    return this.http.get<number>('http://localhost:3000/api/scores/avg').pipe(retry(1), catchError(ScoreService.handleError));
  }

  insertScore(score: Score): Observable<Score> {
    return this.http.post<Score>('http://localhost:3000/api/scores/', score).pipe(retry(1), catchError(ScoreService.handleError));
  }

  updateScore(score: Score): Observable<void> {
    return this.http.put<void>('http://localhost:3000/api/scores/' + score._id, score).pipe(retry(1), catchError(ScoreService.handleError));
  }

  deleteScore(id: string) {
    return this.http.delete('http://localhost:3000/api/scores/' + id).pipe(retry(1), catchError(ScoreService.handleError));
  }
}
