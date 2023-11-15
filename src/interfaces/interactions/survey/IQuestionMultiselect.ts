import { IQuestionAnswerChoice } from './IQuestionAnswerChoice';
import { IQuestionBase } from './IQuestionBase';

export interface IQuestionMultiselect extends IQuestionBase {
  answer_choices: IQuestionAnswerChoice[];
  instructions: string;
  max_selections: number;
  min_selections: number;
  type: 'multiselect' | 'multichoice';
}
