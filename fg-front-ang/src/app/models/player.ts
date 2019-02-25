import {Score} from './score';

/**
 * @class Player
 * @classdesc The model used to store user data recovered from the Rest API.
 */
export class Player {
  _id:     number;
  ip:      string;
  name:    string;
  avatar:  any;
  score:   Score;

  /**
   * @description
   * Empty constructor of the Player object class.
   * @constructor
   */
  constructor() { }
}
