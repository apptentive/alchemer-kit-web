export interface IQuestionBase {
  id: string;
  error_message: string;
  required: boolean;
  type: 'range' | 'multiselect' | 'singleline' | 'nps' | 'multichoice';
  value: string;
}
