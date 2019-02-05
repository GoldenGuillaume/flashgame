/**
 * @interface The model used to store data recovered from the Rest API
 */
export interface Score {
  _id:     number;
  userIp: string;
  name:   string;
  score:  number;
}
