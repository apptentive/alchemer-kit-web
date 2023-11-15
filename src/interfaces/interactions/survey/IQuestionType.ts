import { IQuestionMultiselect } from './IQuestionMultiselect';
import { IQuestionNps } from './IQuestionNps';
import { IQuestionRange } from './IQuestionRange';
import { IQuestionSingleline } from './IQuestionSingleline';

export type QuestionType = IQuestionRange | IQuestionMultiselect | IQuestionSingleline | IQuestionNps;
