import { IInvokes } from './IInvokes';
import { QuestionType } from './IQuestionType';

export interface IQuestionSet {
  button_text: string;
  id: string;
  invokes: IInvokes[];
  questions: QuestionType[];
}
