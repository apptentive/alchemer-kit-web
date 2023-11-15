import { IManifest } from "../../../src/interfaces/data/IManifest";

export const manifest: IManifest = {
  interactions: [
    {
      id: 'SURVEY_PAGED_ID',
      type: 'Survey',
      version: 1,
      api_version: 12,
      configuration: {
        question_sets: [
          {
            id: '82cb7537-119f-5546-bc8e-2f7eabda0bd0',
            button_text: 'Continue',
            version: 1,
            invokes: [
              {
                behavior: 'continue',
                next_question_set_id: 'ba26643a-d4e1-507e-8d7a-c4375ef1d170',
                criteria: {},
              },
            ],
            questions: [
              {
                id: '4e32ffff-e858-45d1-b7e9-ba729ef43834',
                type: 'multichoice',
                required: true,
                instructions: 'select one',
                value: 'What sports do you like?',
                error_message: 'Error - There was a problem with your single-select answer.',
                randomize: false,
                answer_choices: [
                  {
                    id: 'cba17a56-8f6b-4cf0-a7f2-ce967a89afef',
                    value: 'Fencing',
                    type: 'select_option',
                  },
                  {
                    id: 'b58de0dc-a2b7-49c6-8787-a6df496699a7',
                    value: 'Quidditch',
                    type: 'select_option',
                  },
                  {
                    id: 'b58de0dc-a2b7-49c6-8787-a6df496699a8',
                    value: 'Other-123',
                    type: 'select_other',
                    hint: 'Please specify',
                  },
                ],
              },
            ],
          },
          {
            id: 'ba26643a-d4e1-507e-8d7a-c4375ef1d170',
            button_text: 'Continue',
            version: 1,
            invokes: [
              {
                behavior: 'continue',
                next_question_set_id: '70545fc4-03f2-59b3-8c41-9d6d824bccad',
                criteria: {},
              },
            ],
            questions: [
              {
                id: 'ad0ca0d0-68a9-4e56-b134-227cdb657366',
                type: 'multichoice',
                required: true,
                instructions: 'select one',
                value: 'What shows do you like?',
                error_message: 'Error - There was a problem with your single-select answer.',
                randomize: false,
                answer_choices: [
                  {
                    id: '1e101567-a722-47ff-95c1-27780c01c113',
                    value: 'Sesame Street',
                    type: 'select_option',
                  },
                ],
              },
            ],
          },
          {
            id: '70545fc4-03f2-59b3-8c41-9d6d824bccad',
            button_text: 'Continue',
            version: 1,
            invokes: [
              {
                behavior: 'continue',
                next_question_set_id: 'a2d7a73e-9492-5b35-b66e-252262198589',
                criteria: {},
              },
            ],
            questions: [
              {
                id: '4e32ffff-e858-45d1-b7e9-ba729ef41000',
                type: 'multiselect',
                required: true,
                instructions: 'select between 2 and 3',
                value: 'Question 3?',
                error_message: 'Error - There was a problem with your multi-select answer.',
                randomize: false,
                min_selections: 2,
                max_selections: 3,
                answer_choices: [
                  {
                    id: 'cba17a56-8f6b-4cf0-a7f2-ce967a89af10',
                    value: 'Fencing2',
                    type: 'select_option',
                  },
                  {
                    id: 'b58de0dc-a2b7-49c6-8787-a6df49669911',
                    value: 'Quidditch2',
                    type: 'select_option',
                  },
                  {
                    id: 'b58de0dc-a2b7-49c6-8787-a6df49669912',
                    value: 'Other-1232',
                    type: 'select_other',
                    hint: 'Please specify',
                  },
                ],
              },
            ],
          },
          {
            id: 'a2d7a73e-9492-5b35-b66e-252262198589',
            button_text: 'Continue',
            version: 1,
            invokes: [
              {
                behavior: 'continue',
                next_question_set_id: '1e2b7d6b-e5b2-5ac3-9e6c-678599919cde',
                criteria: {},
              },
            ],
            questions: [
              {
                id: '4e32ffff-e858-45d1-b7e9-ba729ef41001',
                type: 'singleline',
                required: true,
                instructions: 'select between 2 and 3',
                value: 'Question 4?',
                error_message: 'Error - There was a problem with your text answer.',
                multiline: false,
                freeform_hint: 'Please provide a response',
              },
            ],
          },
          {
            id: '1e2b7d6b-e5b2-5ac3-9e6c-678599919cde',
            button_text: 'Continue',
            version: 1,
            invokes: [
              {
                behavior: 'continue',
                next_question_set_id: '41e081a8-99f5-57d7-9d52-8bfe7ab5f0fc',
                criteria: {},
              },
            ],
            questions: [
              {
                id: '4e32ffff-e858-45d1-b7e9-ba729ef41003',
                type: 'nps',
                required: true,
                value: 'How likely is it that you would recommend Question 6 to a friend or colleague?',
                error_message: 'Error - There was a problem with your NPS answer.',
                min: 1,
                max: 10,
                min_label: 'Not Likely',
                max_label: 'Extremely Likely',
              },
            ],
          },
          {
            id: '41e081a8-99f5-57d7-9d52-8bfe7ab5f0fc',
            button_text: 'Continue',
            version: 1,
            invokes: [
              {
                behavior: 'continue',
                next_question_set_id: 'f46a26d7-5a90-5c21-969e-d6058c0d236e',
                criteria: {},
              },
            ],
            questions: [
              {
                id: '4e32ffff-e858-45d1-b7e9-ba729ef41002',
                type: 'range',
                required: true,
                value: 'Question 5?',
                error_message: 'Error - There was a problem with your range answer.',
                min: 1,
                max: 10,
                min_label: 'Not at all',
                max_label: 'Completely',
              },
            ],
          },
          {
            id: 'f46a26d7-5a90-5c21-969e-d6058c0d236e',
            button_text: 'Continue',
            version: 1,
            invokes: [
              {
                behavior: 'continue',
                next_question_set_id: '7e5bf12e-8ef4-5e56-b500-a0902376f3c4',
                criteria: {},
              },
            ],
            questions: [
              {
                id: '7bccd04a-dc31-4324-a2b2-6ccc2f456d8f',
                type: 'multichoice',
                required: true,
                instructions: 'select one',
                value: 'What movies do you like?',
                error_message: 'Error - There was a problem with your single-select answer.',
                randomize: false,
                answer_choices: [
                  {
                    id: '0f3c81dc-3c63-46b4-b3ed-54311a82068b',
                    value: 'Charlie Chaplin',
                    type: 'select_option',
                  },
                  {
                    id: '91703742-9185-49ac-b6e8-5eb363bae683',
                    value: 'Charlina Chaplinos',
                    type: 'select_option',
                  },
                ],
              },
            ],
          },
          {
            id: '7e5bf12e-8ef4-5e56-b500-a0902376f3c4',
            button_text: 'Submit',
            version: 1,
            invokes: [
              {
                behavior: 'end',
                criteria: {},
              },
            ],
            questions: [
              {
                id: '7e21ed41-b612-49a4-812b-6fcd4781058b',
                type: 'multichoice',
                required: true,
                instructions: 'select one',
                value: 'What books do you like?',
                error_message: 'Error - There was a problem with your single-select answer.',
                randomize: false,
                answer_choices: [
                  {
                    id: '6ab8e198-0cfb-4bb0-81aa-4a351efef4ec',
                    value: 'Animorphs',
                  },
                ],
              },
            ],
          },
        ],
        close_confirm_title: 'Close survey?',
        close_confirm_message: 'You will lose your progress if you close this survey.',
        close_confirm_close_text: 'Close',
        close_confirm_back_text: 'Back to Survey',
        required_text: 'Required',
        validation_error: 'There are issues with your response.',
        title: 'Some Title',
        name: 'Some Name',
        from_template: '',
        template_locked: false,
        multiple_responses: true,
        show_success_message: true,
        view_period: 86400.0,
        resp_max: 12,
        required: false,
        progress_segments_count: 8,
        success_message: 'Thank you!',
        success_button_text: 'Close',
        render_as: 'paged',
        terms_and_conditions: {
          label: 'Terms & Conditions',
          link: 'https://www.example.com/',
        },
      },
    },
  ],
  targets: {
    'local#app#launch_survey_paged': [
      {
        interaction_id: 'SURVEY_PAGED_ID',
        criteria: {},
      },
    ],
    'com.apptentive#Survey#next_question_set_0201d1df-ede6-4d2b-8d54-8651549b4cc1': [
      {
        interaction_id: '04b63835-1877-4cbd-9101-91286f4e8c9f',
        criteria: {
          $and: [
            {
              'interactions/4e32ffff-e858-45d1-b7e9-ba729ef43834/answers/id': {
                $eq: 'cba17a56-8f6b-4cf0-a7f2-ce967a89afef',
              },
            },
            {
              'interactions/ad0ca0d0-68a9-4e56-b134-227cdb657366/answers/id': {
                $eq: '1e101567-a722-47ff-95c1-27780c01c113',
              },
            },
          ],
        },
      },
    ],
  },
};

export default manifest;
