import { ISurveyConfiguration } from './ISurveyConfiguration';
import { IQuestionSet } from './survey/IQuestionSet';

export interface ISurveyBranchedConfiguration extends ISurveyConfiguration {
  render_as: 'list' | 'paged';
  question_sets: IQuestionSet[];
  success_button_text: string;
}
