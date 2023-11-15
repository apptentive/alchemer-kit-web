import { IQuestionBase } from './IQuestionBase';

export interface IQuestionSingleline extends IQuestionBase {
  multiline: boolean;
  freeform_hint?: string;
}
