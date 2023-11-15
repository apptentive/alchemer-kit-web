export interface ISurveyConfiguration {
  close_confirm_back_text: string;
  close_confirm_close_text: string;
  close_confirm_message: string;
  close_confirm_title: string;
  contact_url_text?: string;
  contact_url?: string;
  description: string;
  disclaimer_text?: string;
  from_template: string;
  intro_button_text: string;
  multiple_responses: boolean;
  name: string;
  position?: string;
  required_text: string;
  show_success_message: boolean;
  submit_text: string;
  success_message: string;
  template_locked: boolean;
  terms_and_conditions: {
    label: string;
    link: string;
  };
  title: string;
  validation_error: string;
  view_period: number;
}
