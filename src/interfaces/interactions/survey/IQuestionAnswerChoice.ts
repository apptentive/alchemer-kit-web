export interface IQuestionAnswerChoice {
  id: string;
  value: string;
  type: 'select_option' | 'select_other';
  hint?: string;
}
