import { IStoreAnswer } from './IStoreAnswer';

export interface IStoreSurveyResponse {
  id: string; // Survey ID
  answers: {
    [key: string]: IStoreAnswer[];
  };
}
