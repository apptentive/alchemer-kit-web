import { IQuestionMultiselect } from "../../../src/interfaces/interactions/survey/IQuestionMultiselect";
import { IQuestionNps } from "../../../src/interfaces/interactions/survey/IQuestionNps";
import { IQuestionRange } from "../../../src/interfaces/interactions/survey/IQuestionRange";
import { IQuestionSingleline } from "../../../src/interfaces/interactions/survey/IQuestionSingleline";

export const multichoiceQuestionConfig: IQuestionMultiselect = {
  id: 'multichoice-question',
  type: 'multichoice',
  value: 'Which would you like to see first?',
  instructions: 'select one',
  min_selections: 1,
  max_selections: 10,
  required: false,
  error_message: 'Error - There was a problem with your multi-choice answer.',
  answer_choices: [
    {
      id: 'multichoice-answer-1',
      value: 'Better user interface',
      type: 'select_option',
    },
    {
      id: 'multichoice-answer-2',
      value: 'Cloud support',
      type: 'select_option',
    },
    {
      id: 'multichoice-answer-3',
      value: 'Login with Facebook / Google / Twitter',
      type: 'select_option',
    },
    {
      id: 'multichoice-answer-other',
      value: 'Other (Please Specify)',
      type: 'select_other',
      hint: 'Enter Other Choice',
    },
  ],
};

export const multiselectQuestionConfig: IQuestionMultiselect = {
  id: 'multiselect-question',
  instructions: 'select up to 2',
  min_selections: 2,
  max_selections: 4,
  value: 'Which two qualities for an app are the most important to you?',
  type: 'multiselect',
  required: true,
  error_message: 'Error - There was a problem with your multi-select answer.',
  answer_choices: [
    {
      id: 'multiselect-answer-1',
      value: 'Speed',
      type: 'select_option',
    },
    {
      id: 'multiselect-answer-2',
      value: 'Easy to use',
      type: 'select_option',
    },
    {
      id: 'multiselect-answer-3',
      value: 'Reliability',
      type: 'select_option',
    },
    {
      id: 'multiselect-answer-4',
      value: 'Works offline',
      type: 'select_option',
    },
    {
      id: 'multiselect-answer-other',
      value: 'Other (Please Specify)',
      type: 'select_other',
      hint: 'Enter Other Choice',
    },
  ],
};

export const singlelineQuestionConfig: IQuestionSingleline = {
  id: 'singleline-question',
  error_message: 'ERROR',
  multiline: false,
  value: "Is there anything you'd like to add?",
  type: 'singleline',
  required: false,
  freeform_hint: 'Enter any feedback you have'
};

export const multilineQuestionConfig: IQuestionSingleline = {
  id: 'multiline-question',
  error_message: 'ERROR',
  multiline: true,
  value: "Is there anything you'd like to add?",
  type: 'singleline',
  required: false,
};

export const npsQuestionConfig: IQuestionNps = {
  id: 'nps-question',
  error_message: 'ERROR',
  type: 'nps',
  value: 'How likely is it that you would recommend this app to a friend or colleague?',
  min: 0,
  max: 10,
  min_label: 'Not at all likely',
  max_label: 'Extremely likely',
  required: false,
};

export const rangeQuestionConfig: IQuestionRange = {
  id: 'range-question',
  error_message: 'ERROR',
  type: 'range',
  required: false,
  value: 'How likely is it that you would recommend this app to a friend or colleague?',
  min: 1,
  max: 10,
  min_label: 'Not at all',
  max_label: 'Completely',
};
