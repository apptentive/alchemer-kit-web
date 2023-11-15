import { IQuestionBase } from './IQuestionBase';

export interface IQuestionNps extends IQuestionBase {
  min: number;
  max: number;
  min_label: string;
  max_label: string;
}
