/**
 * @class Score
 * @classdesc The model used to store data recovered from the Rest API.
 */
export class Score {
  _id:     string;
  userIp: string;
  name:   string;
  score:  number;

  /**
   * @description
   * Empty constructor of the Score object class.
   * @constructor
   */
  constructor() { }

  setName (name: string): void {
    this.name = name;
  }

  setScore (score: number): void {
    this.score = score;
  }
}
