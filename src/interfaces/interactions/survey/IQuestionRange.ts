import { IQuestionBase } from './IQuestionBase';

export interface IQuestionRange extends IQuestionBase {
  instructions?: string;
  min: number;
  max: number;
  min_label: string;
  max_label: string;
  type: 'range';
}
