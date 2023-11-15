/* eslint-disable no-console */
import zipcodeCriteria from '../mocks/data/large-criteria';
import LogicEngine from '../../src/logic-engine.ts';
import { OsNameEnum } from '../../src/interfaces/data/IDevice';

jest.useFakeTimers().setSystemTime(new Date('2233-03-22'));
const mockTimeSeconds = 8306409600000;

// Interactions
const navigateToLinkA = {
  type: 'NavigateToLink',
  id: '56b24833c21f96e6700000a8',
  configuration: {
    target: 'new',
    url: 'http://www.apptentive.com',
  },
  version: 1,
};

const survey5 = {
  type: 'Survey',
  id: '55f87fdb22570e6fb9000005',
  configuration: {
    description: 'Would you like to take a survey!?',
    questions: [
      {
        answer_choices: [
          {
            id: '55f87fdb22570e6fb9000003',
            value: '0',
          },
          {
            id: '55f87fdb22570e6fb9000004',
            value: '1',
          },
        ],
        type: 'multichoice',
        id: '55f87fdb22570e6fb9000002',
        instructions: 'select one',
        required: false,
        value: 'How many times would you see a movie with George Wendt eating beans?',
        randomize: false,
      },
    ],
    multiple_responses: true,
    name: 'Survey',
    required: false,
    success_message: 'Thank you!',
    view_period: 86400,
    show_success_message: true,
    title: 'Bean Survey 3',
  },
  version: 1,
};

const setup = (e2e = false, debug = false) => {
  const logicEngine = new LogicEngine();
  if (debug) {
    // eslint-disable-next-line no-console
    logicEngine.debug = true;
    logicEngine.console = console.log;
  }
  logicEngine.interactions = [
    {
      type: 'UpgradeMessage',
      id: '52aa562668e275e7d00006db',
      configuration: {
        body: '<html><head><style>\nbody {\n  font-family: "Helvetica Neue", Helvetica;\n  color: #4d4d4d;\n  font-size: .875em;\n  line-height: 1.36em;\n  -webkit-text-size-adjust:none;\n}\n\nh1, h2, h3, h4, h5, h6 {\n  color: #000000;\n  line-height: 1.25em;\n  text-align: center;\n}\n\nh1 {font-size: 22px;}\nh2 {font-size: 18px;}\nh3 {font-size: 16px;}\nh4 {font-size: 14px;}\nh5, h6 {font-size: 12px;}\nh6 {font-weight: normal;}\n\nblockquote {\n  margin: 1em 1.75em;\n  font-style: italic;\n}\n\nul, ol {\n  padding-left: 1.75em;\n}\n\ntable {\n  border-collapse: collapse;\n  border-spacing: 0;\n  empty-cells: show;\n}\n\ntable caption {\n  padding: 1em 0;\n  text-align: center;\n}\n\ntable td,\ntable th {\n  border-left: 1px solid #cbcbcb;\n  border-width: 0 0 0 1px;\n  font-size: inherit;\n  margin: 0;\n  padding: .25em .5em;\n\n}\ntable td:first-child,\ntable th:first-child {\n  border-left-width: 0;\n}\ntable th:first-child {\n  border-radius: 4px 0 0 4px;\n}\ntable th:last-child {\n  border-radius: 0 4px 4px 0;\n}\n\ntable thead {\n  background: #E5E5E5;\n  color: #000;\n  text-align: left;\n  vertical-align: bottom;\n}\n\ntable td {\n  background-color: transparent;\n  border-bottom: 1px solid #E5E5E5;\n}\n</style></head><body><p>\n\tThanks for updating!\n</p></body></html>',
        show_app_icon: true,
        show_powered_by: true,
      },
      version: 1,
    },
    {
      type: 'TextModal',
      id: '54d50f69cd68dc00c30001dd',
      configuration: {
        title: 'Message Title',
        body: 'Message content.',
        name: 'Test Note 3',
        actions: [
          {
            id: '54d50f70cd68dc65d400008d',
            action: 'dismiss',
            label: 'Dismiss',
          },
          {
            id: '54d50f70cd68dc65d400008e',
            action: 'interaction',
            label: 'See Apptentive',
            invokes: [
              {
                criteria: {},
                interaction_id: '56b24833c21f96e6700000a8',
              },
            ],
          },
        ],
      },
      version: 1,
    },
    {
      type: 'TextModal',
      id: '54dac421a7e9cd0578000006',
      configuration: {
        title: 'Message Title',
        body: 'Message content.',
        name: 'Button Order Note',
        actions: [
          {
            id: '54dac42ea7e9cd0578000008',
            action: 'dismiss',
            label: 'Dismiss 1',
          },
          {
            id: '54dac42ea7e9cd0578000009',
            action: 'interaction',
            label: 'Survey 2',
            invokes: [
              {
                criteria: {},
                interaction_id: '55f885a722570e5b79000002',
              },
            ],
          },
          {
            id: '54dac42ea7e9cd057800000a',
            action: 'interaction',
            label: 'Call 3',
            invokes: [
              {
                criteria: {},
                interaction_id: '56b24834c21f96e6700000ab',
              },
            ],
          },
          {
            id: '55f8868e273db600f900002c',
            action: 'interaction',
            label: 'Survey',
            invokes: [
              {
                criteria: {},
                interaction_id: '55f885a722570e5b79000002',
              },
            ],
          },
        ],
      },
      version: 1,
    },
    {
      type: 'AppStoreRating',
      id: '55bffcd3e1c388521a000bd2',
      configuration: {
        method: 'app_store',
        store_id: '294047845',
      },
      version: 1,
    },
    {
      type: 'EnjoymentDialog',
      id: '55bffcd3e1c388521a000bce',
      configuration: {
        no_text: 'No',
        title: 'Do you love Apptentive Test App?',
        yes_text: 'Yes',
      },
      version: 1,
    },
    {
      type: 'RatingDialog',
      id: '55bffcd3e1c388521a000bd0',
      configuration: {
        title: 'Thank You',
        body: "We're so happy to hear that you love Apptentive Test App! It'd be really helpful if you rated us. Thanks so much for spending some time with us.",
        decline_text: 'No Thanks',
        rate_text: 'Rate',
        remind_text: 'Remind Me Later',
      },
      version: 1,
    },
    {
      type: 'MessageCenter',
      id: '55bffcd3e1c388521a000bd4',
      configuration: {
        composer: {
          send_button: 'Send',
          close_cancel_button: 'Cancel',
          send_fail: 'Failed',
          send_start: 'Sending...',
          send_ok: 'Sent',
          close_text: 'Close',
          close_confirm_body: 'Are you sure you want to discard this message?',
          hint_text: 'Please leave detailed feedback',
          close_discard_button: 'Discard',
          title: 'New Message',
        },
        profile: {
          request: true,
          initial: {
            title: 'Who are we speaking with?',
            email_hint: 'Email (required)',
            email_explanation: "So we're able to reply",
            skip_button: 'Skip',
            name_hint: 'Name',
            save_button: 'Next',
          },
          require: true,
          edit: {
            title: 'Profile',
            email_hint: 'Email',
            email_explanation: "So we're able to reply",
            skip_button: 'Cancel',
            name_hint: 'Name',
            save_button: 'Save',
          },
        },
        automated_message: {
          body: 'TEST CONTEXT MESSAGE TEXT Save button?????',
        },
        branding: 'Powered by Apptentive',
        greeting: {
          image_url:
            'http://a1.mzstatic.com/us/r30/Purple/v4/fd/11/0d/fd110d92-20d9-fe89-1cd4-1fafebbdb3a3/icon175x175.jpeg',
          title: 'Hello!',
          body: "We'd love to get feedback from you on our app. The more details you can provide, the better.",
        },
        status: {
          body: 'We will respond to your message soon.',
        },
        error_messages: {
          network_error_body:
            "It looks like you aren't connected to the Internet right now. We've saved your message and will try again when we detect a connection.",
          http_error_body:
            "It looks like we're having trouble sending your message. We've saved it and will try sending it again soon.",
        },
        title: 'Message Center',
      },
      version: 2,
    },
    {
      type: 'MessageCenter',
      id: '55c2826335878be4ab000dac',
      configuration: {
        composer: {
          send_button: 'Send',
          close_cancel_button: 'Cancel',
          send_fail: 'Failed',
          send_start: 'Sending...',
          send_ok: 'Sent',
          close_text: 'Close',
          close_confirm_body: 'Are you sure you want to discard this message?',
          hint_text: 'Please leave detailed feedback',
          close_discard_button: 'Discard',
          title: 'New Message',
        },
        profile: {
          request: true,
          initial: {
            title: 'Who are we speaking with?',
            email_hint: 'Email (required)',
            email_explanation: "So we're able to reply",
            skip_button: 'Skip',
            name_hint: 'Name',
            save_button: 'Next',
          },
          require: true,
          edit: {
            title: 'Profile',
            email_hint: 'Email',
            email_explanation: "So we're able to reply",
            skip_button: 'Cancel',
            name_hint: 'Name',
            save_button: 'Save',
          },
        },
        automated_message: {},
        branding: 'Powered by Apptentive',
        greeting: {
          image_url:
            'http://a1.mzstatic.com/us/r30/Purple/v4/fd/11/0d/fd110d92-20d9-fe89-1cd4-1fafebbdb3a3/icon175x175.jpeg',
          title: 'Hello!',
          body: "We'd love to get feedback from you on our app. The more details you can provide, the better.",
        },
        status: {
          body: 'We will respond to your message soon.',
        },
        error_messages: {
          network_error_body:
            "It looks like you aren't connected to the Internet right now. We've saved your message and will try again when we detect a connection.",
          http_error_body:
            "It looks like we're having trouble sending your message. We've saved it and will try sending it again soon.",
        },
        title: 'Message Center',
      },
      version: 2,
    },
    {
      type: 'Survey',
      id: '55ce4915968896cb8b00001c',
      configuration: {
        description: 'Hey there all star gamer! How Important are the following game elements to you?',
        questions: [
          {
            answer_choices: [
              {
                id: '55ce4915968896cb8b00000a',
                value: 'Unimportant',
              },
              {
                id: '55ce4915968896cb8b00000b',
                value: 'Not Important',
              },
              {
                id: '55ce4915968896cb8b00000c',
                value: 'Somewhat Important',
              },
              {
                id: '55ce4915968896cb8b00000d',
                value: 'Important',
              },
              {
                id: '55ce4915968896cb8b00000e',
                value: 'Very Important',
              },
            ],
            type: 'multichoice',
            id: '55ce4915968896cb8b000019',
            instructions: 'select one',
            required: true,
            value: 'The game is well designed and it keeps me motivated',
            randomize: false,
          },
          {
            answer_choices: [
              {
                id: '55ce4915968896cb8b00000f',
                value: 'Unimportant',
              },
              {
                id: '55ce4915968896cb8b000010',
                value: 'Not Important',
              },
              {
                id: '55ce4915968896cb8b000011',
                value: 'Somewhat Important',
              },
              {
                id: '55ce4915968896cb8b000012',
                value: 'Important',
              },
              {
                id: '55ce4915968896cb8b000013',
                value: 'Very Important',
              },
            ],
            type: 'multichoice',
            id: '55ce4915968896cb8b00001a',
            instructions: 'select one',
            required: true,
            value: 'The game runs seamlessly without crashing',
            randomize: false,
          },
          {
            answer_choices: [
              {
                id: '55ce4915968896cb8b000014',
                value: 'Unimportant',
              },
              {
                id: '55ce4915968896cb8b000015',
                value: 'Not Important',
              },
              {
                id: '55ce4915968896cb8b000016',
                value: 'Somewhat Important',
              },
              {
                id: '55ce4915968896cb8b000017',
                value: 'Important',
              },
              {
                id: '55ce4915968896cb8b000018',
                value: 'Very Important',
              },
            ],
            type: 'multichoice',
            id: '55ce4915968896cb8b00001b',
            instructions: 'select one',
            required: true,
            value: 'The game has amazing graphics and animations',
            randomize: false,
          },
        ],
        multiple_responses: true,
        name: 'Survey',
        required: false,
        success_message: 'Thank you!',
        view_period: 86400,
        show_success_message: true,
        title: 'Example Survey: In-Game Elements',
      },
      version: 1,
    },
    {
      type: 'Survey',
      id: '55f87f79273db6574700003b',
      configuration: {
        description: 'Would you like to take a survey!?',
        questions: [
          {
            answer_choices: [
              {
                id: '55f87f79273db65747000038',
                value: 'Yes',
              },
              {
                id: '55f87f79273db65747000039',
                value: 'No',
              },
            ],
            type: 'multichoice',
            id: '55f87f79273db6574700003a',
            instructions: 'select one',
            required: false,
            value: 'Would you see a movie with George Wendt eating beans?',
            randomize: false,
          },
        ],
        multiple_responses: false,
        name: 'Survey',
        required: false,
        success_message: 'Thank you!',
        view_period: 86400,
        show_success_message: true,
        title: 'Bean Survey 2',
      },
      version: 1,
    },
    survey5,
    {
      type: 'Survey',
      id: '55fb3bb9273db67b7200002a',
      configuration: {
        description: 'sdf',
        questions: [
          {
            type: 'singleline',
            id: '55fb3bb9273db67b72000029',
            value: 'sdf',
            randomize: false,
            multiline: false,
            required: false,
          },
        ],
        multiple_responses: false,
        name: 'Survey',
        required: false,
        view_period: 86400,
        show_success_message: false,
        title: 'sdf',
      },
      version: 1,
    },
    {
      type: 'Survey',
      id: '5627db62753934f808000001',
      configuration: {
        description: 'Would you like to take a survey!?',
        questions: [
          {
            answer_choices: [
              {
                id: '5627db63753934f808000003',
                value: 'Yes',
              },
              {
                id: '5627db63753934f808000004',
                value: 'No',
              },
            ],
            type: 'multichoice',
            id: '5627db63753934f808000002',
            instructions: 'select one',
            required: false,
            value: 'Does this work?',
            randomize: false,
          },
        ],
        multiple_responses: false,
        name: 'Survey',
        required: false,
        success_message: 'Thank you!',
        view_period: 86400,
        show_success_message: true,
        title: 'Testing Locale',
      },
      version: 1,
    },
    {
      type: 'Survey',
      id: '565e35545aaa413abc00001c',
      configuration: {
        description: 'Intro',
        questions: [
          {
            answer_choices: [
              {
                id: '565e35545aaa413abc000019',
                value: 'Yes',
              },
              {
                id: '565e35545aaa413abc00001a',
                value: 'No',
              },
            ],
            type: 'multichoice',
            id: '565e35545aaa413abc00001b',
            instructions: 'select one',
            required: false,
            value: 'Is this on?',
            randomize: false,
          },
        ],
        multiple_responses: false,
        name: 'Survey',
        required: false,
        success_message: 'Thank you!',
        view_period: 86400,
        show_success_message: true,
        title: 'Triggered from event_1',
      },
      version: 1,
    },
    {
      type: 'TextModal',
      id: '5668cbee5aaa41283f000005',
      configuration: {
        actions: [
          {
            id: '5668cbee5aaa41283f000004',
            action: 'dismiss',
            label: 'Thanks!',
          },
        ],
        title: "You're awesome!",
        name: 'Targeted note',
      },
      version: 1,
    },
    {
      type: 'Survey',
      id: '56bb9149701b764ba3000007',
      configuration: {
        description: "Please answer all the questions, and we'll use your responses for really good things.",
        questions: [
          {
            type: 'singleline',
            id: '56bb914a701b764ba3000008',
            value: 'Short Text Question',
            randomize: false,
            multiline: false,
            required: true,
          },
          {
            type: 'singleline',
            id: '56bb914a701b764ba3000009',
            value: 'Long Text Question',
            randomize: false,
            multiline: true,
            required: false,
          },
          {
            answer_choices: [
              {
                id: '56bb914a701b764ba300000b',
                value: 'Answer',
              },
              {
                id: '56bb914a701b764ba300000c',
                value: 'Answer',
              },
              {
                id: '56bb914a701b764ba300000d',
                value: 'Answer',
              },
              {
                id: '56bb914a701b764ba300000e',
                value: 'Answer',
              },
            ],
            type: 'multichoice',
            id: '56bb914a701b764ba300000a',
            instructions: 'select one',
            required: true,
            value: 'Single Select',
            randomize: false,
          },
          {
            max_selections: 4,
            answer_choices: [
              {
                id: '56bb914a701b764ba3000010',
                value: 'Answer',
              },
              {
                id: '56bb914a701b764ba3000011',
                value: 'Answer',
              },
              {
                id: '56bb914a701b764ba3000012',
                value:
                  'Our new service will call your favorite rentals to get any missing details and schedule viewings for you.',
              },
              {
                id: '56bb914a701b764ba3000013',
                value: 'Answer',
              },
            ],
            type: 'multiselect',
            id: '56bb914a701b764ba300000f',
            instructions: 'select all that apply',
            required: true,
            value: 'Multi Select',
            randomize: false,
            min_selections: 0,
          },
          {
            max_selections: 3,
            answer_choices: [
              {
                id: '56bb914a701b764ba3000015',
                value: 'Answer',
              },
              {
                id: '56bb914a701b764ba3000016',
                value: 'Answer',
              },
              {
                id: '56bb914a701b764ba3000017',
                value:
                  'Our new service will call your favorite rentals to get any missing details and schedule viewings for you.',
              },
              {
                id: '56bb914a701b764ba3000018',
                value: 'Answer',
              },
            ],
            type: 'multiselect',
            id: '56bb914a701b764ba3000014',
            instructions: 'select between 2 and 3',
            required: true,
            value: 'Multi Select',
            randomize: false,
            min_selections: 2,
          },
        ],
        multiple_responses: true,
        name: 'Survey Title',
        required: false,
        success_message: 'Thank you for your response!',
        view_period: 86400,
        show_success_message: true,
        title: 'Crocker Survey',
      },
      version: 1,
    },
    navigateToLinkA,
    {
      type: 'Survey',
      id: '55f885a722570e5b79000002',
      configuration: {
        description: 'My intro',
        questions: [
          {
            type: 'singleline',
            id: '55f885a722570e5b79000001',
            value: 'Yolo',
            randomize: false,
            multiline: false,
            required: false,
          },
        ],
        multiple_responses: false,
        name: 'Survey',
        required: false,
        success_message: 'Thank you!',
        view_period: 86400,
        show_success_message: true,
        title: '09.15.15',
      },
      version: 1,
    },
    {
      type: 'NavigateToLink',
      id: '56b24834c21f96e6700000ab',
      configuration: {
        target: 'new',
        url: 'tel:123',
      },
      version: 1,
    },
  ];

  logicEngine.targeted_events = {
    'local#app#tracked_exercise': [
      {
        criteria: {
          'interactions/55bffcd3e1c388521a000bd0/invokes/version': {
            $gt: 0,
            $lte: 1,
          },
          $and: [
            {
              $or: [
                {
                  'codePoint/com.apptentive#RatingDialog#remind/invokes/total': {
                    $eq: 0,
                  },
                },
                {
                  'codePoint/com.apptentive#RatingDialog#remind/last_invoked_at/total': {
                    $before: -604800,
                  },
                },
              ],
            },
          ],
          'codePoint/com.apptentive#RatingDialog#rate/invokes/total': {
            $eq: 0,
          },
          'codePoint/com.apptentive#RatingDialog#decline/invokes/total': {
            $eq: 0,
          },
        },
        interaction_id: '55bffcd3e1c388521a000bd0',
      },
      {
        criteria: {
          'codePoint/com.apptentive#app#launch/invokes/version': {
            $gte: 9,
          },
          $or: [
            {
              $and: [
                {
                  'codePoint/com.apptentive#EnjoymentDialog#yes/invokes/total': {
                    $eq: true,
                  },
                },
                {
                  'device/carrier': {
                    $eq: 't-mobile',
                  },
                },
                {
                  'device/os_name': {
                    $eq: 'iOS',
                  },
                },
                {
                  'device/custom_data/device_bool': {
                    $eq: '9',
                  },
                },
                {
                  'person/custom_data/Custom Key': {
                    $eq: '8879',
                  },
                },
              ],
            },
            {
              $and: [
                {
                  'person/custom_data/Custom Person Data': {
                    $eq: '999',
                  },
                },
                {
                  'person/custom_data/Custom Key2': {
                    $eq: 'k',
                  },
                },
              ],
            },
          ],
          'time_at_install/version': {
            $before: -86400,
          },
          $and: [
            {
              $or: [
                {
                  'interactions/55bffcd3e1c388521a000bce/last_invoked_at/total': {
                    $before: -604800,
                  },
                },
                {
                  'interactions/55bffcd3e1c388521a000bce/invokes/total': {
                    $eq: 0,
                  },
                },
              ],
            },
          ],
          'interactions/55bffcd3e1c388521a000bce/invokes/version': {
            $eq: 0,
          },
        },
        interaction_id: '55bffcd3e1c388521a000bce',
      },
    ],
    'local#app#event_5': [
      {
        criteria: {
          current_time: {
            $gte: {
              sec: 0,
              _type: 'datetime',
            },
          },
          $and: [
            {
              $or: [
                {
                  'interactions/55f87fdb22570e6fb9000005/invokes/total': {
                    $eq: 0,
                  },
                },
                {
                  'interactions/55f87fdb22570e6fb9000005/last_invoked_at/total': {
                    $before: -10,
                  },
                },
              ],
            },
          ],
        },
        interaction_id: '55f87fdb22570e6fb9000005',
      },
      {
        criteria: {
          current_time: {
            $gte: {
              sec: 1423623182,
              _type: 'datetime',
            },
          },
          'interactions/54dac421a7e9cd0578000006/invokes/total': {
            $eq: 0,
          },
        },
        interaction_id: '54dac421a7e9cd0578000006',
      },
    ],
    'local#app#init': [
      {
        criteria: {
          'application/version': {
            $eq: {
              version: '1.3',
              _type: 'version',
            },
          },
          'codePoint/com.apptentive#app#launch/invokes/version': {
            $eq: 1,
          },
        },
        interaction_id: '52aa562668e275e7d00006db',
      },
    ],
    'com.apptentive#EnjoymentDialog#yes': [
      {
        criteria: {},
        interaction_id: '55bffcd3e1c388521a000bd0',
      },
    ],
    'com.apptentive#RatingDialog#rate': [
      {
        criteria: {},
        interaction_id: '55bffcd3e1c388521a000bd2',
      },
    ],
    'local#app#event_4': [
      {
        criteria: {
          current_time: {
            $gte: {
              sec: 1442348888,
              _type: 'datetime',
            },
          },
          $and: [
            {
              $or: [
                {
                  'interactions/55f87fdb22570e6fb9000005/invokes/total': {
                    $eq: 0,
                  },
                },
                {
                  'interactions/55f87fdb22570e6fb9000005/last_invoked_at/total': {
                    $before: -10,
                  },
                },
              ],
            },
          ],
        },
        interaction_id: '55f87fdb22570e6fb9000005',
      },
      {
        criteria: {
          current_time: {
            $gte: {
              sec: 1449014578,
              _type: 'datetime',
            },
          },
          'interactions/565e35545aaa413abc00001c/invokes/total': {
            $eq: 0,
          },
        },
        interaction_id: '565e35545aaa413abc00001c',
      },
      {
        criteria: {
          current_time: {
            $gte: {
              sec: 1442348888,
              _type: 'datetime',
            },
          },
          $and: [
            {
              $or: [
                {
                  'interactions/55f87f79273db6574700003b/invokes/total': {
                    $eq: 0,
                  },
                },
                {
                  'interactions/55f87f79273db6574700003b/last_invoked_at/total': {
                    $before: -10,
                  },
                },
              ],
            },
          ],
          'interactions/55f87f79273db6574700003b/invokes/total': {
            $eq: 0,
          },
        },
        interaction_id: '55f87f79273db6574700003b',
      },
      {
        criteria: {
          'interactions/55bffcd3e1c388521a000bd0/invokes/version': {
            $gt: 0,
            $lte: 1,
          },
          $and: [
            {
              $or: [
                {
                  'codePoint/com.apptentive#RatingDialog#remind/invokes/total': {
                    $eq: 0,
                  },
                },
                {
                  'codePoint/com.apptentive#RatingDialog#remind/last_invoked_at/total': {
                    $before: -604800,
                  },
                },
              ],
            },
          ],
          'codePoint/com.apptentive#RatingDialog#rate/invokes/total': {
            $eq: 0,
          },
          'codePoint/com.apptentive#RatingDialog#decline/invokes/total': {
            $eq: 0,
          },
        },
        interaction_id: '55bffcd3e1c388521a000bd0',
      },
      {
        criteria: {
          'codePoint/com.apptentive#app#launch/invokes/version': {
            $gte: 9,
          },
          $or: [
            {
              $and: [
                {
                  'codePoint/com.apptentive#EnjoymentDialog#yes/invokes/total': {
                    $eq: true,
                  },
                },
                {
                  'device/carrier': {
                    $eq: 't-mobile',
                  },
                },
                {
                  'device/os_name': {
                    $eq: 'iOS',
                  },
                },
                {
                  'device/custom_data/device_bool': {
                    $eq: '9',
                  },
                },
                {
                  'person/custom_data/Custom Key': {
                    $eq: '8879',
                  },
                },
              ],
            },
            {
              $and: [
                {
                  'person/custom_data/Custom Person Data': {
                    $eq: '999',
                  },
                },
                {
                  'person/custom_data/Custom Key2': {
                    $eq: 'k',
                  },
                },
              ],
            },
          ],
          'time_at_install/version': {
            $before: -86400,
          },
          $and: [
            {
              $or: [
                {
                  'interactions/55bffcd3e1c388521a000bce/last_invoked_at/total': {
                    $before: -604800,
                  },
                },
                {
                  'interactions/55bffcd3e1c388521a000bce/invokes/total': {
                    $eq: 0,
                  },
                },
              ],
            },
          ],
          'interactions/55bffcd3e1c388521a000bce/invokes/version': {
            $eq: 0,
          },
        },
        interaction_id: '55bffcd3e1c388521a000bce',
      },
    ],
    'com.apptentive#app#show_message_center': [
      {
        criteria: {},
        interaction_id: '55c2826335878be4ab000dac',
      },
    ],
    'local#app#showSurvey': [
      {
        criteria: {
          current_time: {
            $gte: {
              sec: 1455041320,
              _type: 'datetime',
            },
          },
        },
        interaction_id: '56bb9149701b764ba3000007',
      },
    ],
    'local#app#event_3': [
      {
        criteria: {
          $and: [
            {
              'codePoint/local#app#event_1/invokes/total': {
                $gte: 1,
              },
            },
            {
              'codePoint/local#app#event_2/invokes/total': {
                $gte: 1,
              },
            },
            {
              'codePoint/local#app#event_3/invokes/total': {
                $gte: 1,
              },
            },
            {
              $or: [
                {
                  'interactions/55ce4915968896cb8b00001c/invokes/total': {
                    $eq: 0,
                  },
                },
                {
                  'interactions/55ce4915968896cb8b00001c/last_invoked_at/total': {
                    $before: -864,
                  },
                },
              ],
            },
          ],
          current_time: {
            $gte: {
              sec: 1439582065,
              _type: 'datetime',
            },
          },
        },
        interaction_id: '55ce4915968896cb8b00001c',
      },
      {
        criteria: {
          current_time: {
            $gte: {
              sec: 1423249242,
              _type: 'datetime',
            },
          },
          'interactions/54d50f69cd68dc00c30001dd/invokes/total': {
            $eq: 0,
          },
        },
        interaction_id: '54d50f69cd68dc00c30001dd',
      },
    ],
    'local#app#event_1': [
      {
        criteria: {
          current_time: {
            $gte: {
              sec: 1442528176,
              _type: 'datetime',
            },
          },
          'interactions/55fb3bb9273db67b7200002a/invokes/total': {
            $eq: 0,
          },
        },
        interaction_id: '55fb3bb9273db67b7200002a',
      },
    ],
    'local#app#test_event_1': [
      {
        criteria: {},
        interaction_id: '55fb3bb9273db67b7200002a',
      },
    ],
  };

  logicEngine.random = {
    '🔑': 0.1,
    '③': 33.3,
    '🌗': 50,
    '⑨': 99.9,
  };

  if (e2e) {
    logicEngine.application = {
      version: {
        _type: 'version',
        version: '1.2.3',
      },
    };
    logicEngine.device = {
      custom_data: {
        number_5: 5,
        key_with_null_value: null,
        string_qwerty: 'qwerty',
        'string with spaces': 'string with spaces',
        empty_string: '',
      },
    };
    logicEngine.person = {
      custom_data: {
        zipcode: '37214',
      },
    };
    logicEngine.time_at_install = {
      total: new Date(),
    };
    logicEngine.interaction_counts = {
      QUESTION_ID_1: {
        answers: [
          {
            value: 1,
          },
          {
            value: 2,
          },
          {
            value: '3',
          },
          {
            value: 'rabbit',
          },
        ],
        current_answer: [
          {
            value: 'rabbit',
          },
        ],
        invokes: {
          build: 1,
          total: 1,
          version: 1,
        },
        last_invoked_at: 0,
      },
      QUESTION_ID_1_BROKEN: {
        answers: [
          {
            noop: 1,
          },
        ],
        current_answer: [
          {
            noop: 1,
          },
        ],
        invokes: {
          build: 1,
          total: 1,
          version: 1,
        },
        last_invoked_at: 0,
      },
      QUESTION_ID_2: {
        answers: [
          {
            id: 'QUESTION_ID_2_ANSWER_ID_1',
          },
          {
            id: 'QUESTION_ID_2_ANSWER_ID_3',
          },
        ],
        current_answer: [
          {
            id: 'QUESTION_ID_2_ANSWER_ID_3',
          },
        ],
        invokes: {
          build: 1,
          total: 1,
          version: 1,
        },
        last_invoked_at: 0,
      },
      QUESTION_ID_2_BROKEN: {
        answers: [
          {
            noop: 'QUESTION_ID_2_ANSWER_ID_1',
          },
        ],
        current_answer: [
          {
            noop: 'QUESTION_ID_2_ANSWER_ID_1',
          },
        ],
        invokes: {
          build: 1,
          total: 1,
          version: 1,
        },
        last_invoked_at: 0,
      },
      QUESTION_ID_3: {
        answers: [
          {
            id: 'QUESTION_ID_3_ANSWER_ID_OTHER',
            value: 'other text answer',
          },
        ],
        current_answer: [
          {
            id: 'QUESTION_ID_3_ANSWER_ID_OTHER',
            value: 'other text answer',
          },
        ],
        invokes: {
          build: 1,
          total: 1,
          version: 1,
        },
        last_invoked_at: 0,
      },
      QUESTION_ID_4: {
        answers: [
          {
            value: 'single line text answer one',
          },
          {
            value: 'single line text answer two',
          },
        ],
        current_answer: [
          {
            value: 'single line text answer two',
          },
        ],
        invokes: {
          build: 1,
          total: 1,
          version: 1,
        },
        last_invoked_at: 0,
      },
      QUESTION_ID_5: {
        answers: [
          {
            value: 'multi\nline\ntext answer',
          },
          {
            value: 'multi\nline\ntext answer\n\rtwo',
          },
        ],
        current_answer: [
          {
            value: 'multi\nline\ntext answer\n\rtwo',
          },
        ],
        invokes: {
          build: 1,
          total: 1,
          version: 1,
        },
        last_invoked_at: 0,
      },
      SURVEY_ID: {
        last_submission_at: 0,
      },
    };
  }

  return logicEngine;
};

test('#constructor: should contruct without issue', () => {
  const logicEngine = setup();
  expect(logicEngine instanceof LogicEngine).toBe(true);
});

test('#constructor: can pass in options', () => {
  expect(() => {
    const _ = new LogicEngine({
      codePoint: {},
      interaction_counts: {},
      interactions: [],
      targeted_events: {},
      console: () => {},
    });
  }).not.toThrow();
});

test('#constructor: should not be able to be called as a function', () => {
  expect(() => {
    LogicEngine();
  }).toThrowError({ message: "Class constructor LogicEngine cannot be invoked without 'new'" });
});

test('#toVersion: should not throw error', () => {
  expect(() => {
    LogicEngine.toVersion('1.0');
    LogicEngine.toVersion('1.0.1');
  }).not.toThrow();
});

test('#toVersion: should support large versions', () => {
  const newVersion = LogicEngine.toVersion('1024');
  const newerVersion = LogicEngine.toVersion('1024.1024');
  const newestVersion = LogicEngine.toVersion('1024.1024.1024');
  const badVersion = LogicEngine.toVersion('9007199254740991'); // Number.MAX_VALUE, Number.MIN_VALUE

  expect(newVersion).toBe(1073741824);
  expect(newerVersion).toBe(1074790400);
  expect(newestVersion).toBe(1074791424);
  expect(badVersion).toBe(-1048576);
});

test('#toVersion: should be able to compare the same values in different formats', () => {
  const sameA = LogicEngine.toVersion('1');
  const sameB = LogicEngine.toVersion('1.0');
  const sameC = LogicEngine.toVersion('1.0.0');

  expect(sameA).toBe(sameB);
  expect(sameA).toBe(sameC);
  expect(sameB).toBe(sameA);
  expect(sameB).toBe(sameC);
  expect(sameC).toBe(sameA);
  expect(sameC).toBe(sameB);
});

test('#toVersion: should be able to compare the different values as numbers', () => {
  const sameA = LogicEngine.toVersion('1');
  const sameB = LogicEngine.toVersion('1.0.1');

  expect(sameB > sameA).toBe(true);
  expect(sameA < sameB).toBe(true);
});

test('LogicEngine.createOrUpdate(store, key): should create and update values in the store', () => {
  const store = {};
  LogicEngine.createOrUpdate(store, 'key');
  expect(store).toEqual({
    key: {
      invokes: {
        build: 1,
        total: 1,
        version: 1,
      },
      last_invoked_at: mockTimeSeconds,
    },
  });

  LogicEngine.createOrUpdate(store, 'key');
  expect(store).toEqual({
    key: {
      invokes: {
        build: 2,
        total: 2,
        version: 2,
      },
      last_invoked_at: mockTimeSeconds,
    },
  });
});

test('LogicEngine.augmentSurvey(store, key, data): should create and update values in the store', () => {
  const data = {
    id: 'SURVEY_ID',
    answers: {
      QUESTION_ID_1: [
        {
          value: 1,
        },
      ],
      QUESTION_ID_2: [
        {
          id: 'QUESTION_ID_2_ANSWER_ID_1',
        },
      ],
      QUESTION_ID_3: [
        {
          id: 'QUESTION_ID_3_ANSWER_ID_1',
        },
        {
          id: 'QUESTION_ID_3_ANSWER_ID_OTHER',
          value: 'other text answer',
        },
      ],
      QUESTION_ID_4: [
        {
          value: 'single line text answer',
        },
      ],
      QUESTION_ID_5: [
        {
          value: 'multi\nline\ntext answer',
        },
      ],
    },
  };
  const store = {};
  LogicEngine.augmentSurvey(store, 'SURVEY_ID', data);
  expect(store).toEqual({
    QUESTION_ID_1: {
      answers: [
        {
          value: 1,
        },
      ],
      current_answer: [
        {
          value: 1,
        },
      ],
      invokes: {
        build: 1,
        total: 1,
        version: 1,
      },
      last_invoked_at: mockTimeSeconds,
    },
    QUESTION_ID_2: {
      answers: [
        {
          id: 'QUESTION_ID_2_ANSWER_ID_1',
        },
      ],
      current_answer: [
        {
          id: 'QUESTION_ID_2_ANSWER_ID_1',
        },
      ],
      invokes: {
        build: 1,
        total: 1,
        version: 1,
      },
      last_invoked_at: mockTimeSeconds,
    },
    QUESTION_ID_3: {
      answers: [
        {
          id: 'QUESTION_ID_3_ANSWER_ID_1',
        },
        {
          id: 'QUESTION_ID_3_ANSWER_ID_OTHER',
          value: 'other text answer',
        },
      ],
      current_answer: [
        {
          id: 'QUESTION_ID_3_ANSWER_ID_1',
        },
        {
          id: 'QUESTION_ID_3_ANSWER_ID_OTHER',
          value: 'other text answer',
        },
      ],
      invokes: {
        build: 1,
        total: 1,
        version: 1,
      },
      last_invoked_at: mockTimeSeconds,
    },
    QUESTION_ID_4: {
      answers: [
        {
          value: 'single line text answer',
        },
      ],
      current_answer: [
        {
          value: 'single line text answer',
        },
      ],
      invokes: {
        build: 1,
        total: 1,
        version: 1,
      },
      last_invoked_at: mockTimeSeconds,
    },
    QUESTION_ID_5: {
      answers: [
        {
          value: 'multi\nline\ntext answer',
        },
      ],
      current_answer: [
        {
          value: 'multi\nline\ntext answer',
        },
      ],
      invokes: {
        build: 1,
        total: 1,
        version: 1,
      },
      last_invoked_at: mockTimeSeconds,
    },
    SURVEY_ID: {
      last_submission_at: mockTimeSeconds,
    },
  });

  const data2 = {
    id: 'SURVEY_ID',
    answers: {
      QUESTION_ID_3: [
        {
          id: 'ROUND_2',
        },
        {
          id: 'QUESTION_ID_3_ANSWER_ID_OTHER',
          value: 'other text answer',
        },
      ],
      QUESTION_ID_5: [
        {
          value: 'round 2',
        },
      ],
    },
  };
  LogicEngine.augmentSurvey(store, 'SURVEY_ID', data2);
  expect(store).toEqual({
    QUESTION_ID_1: {
      answers: [
        {
          value: 1,
        },
      ],
      current_answer: [
        {
          value: 1,
        },
      ],
      invokes: {
        build: 1,
        total: 1,
        version: 1,
      },
      last_invoked_at: mockTimeSeconds,
    },
    QUESTION_ID_2: {
      answers: [
        {
          id: 'QUESTION_ID_2_ANSWER_ID_1',
        },
      ],
      current_answer: [
        {
          id: 'QUESTION_ID_2_ANSWER_ID_1',
        },
      ],
      invokes: {
        build: 1,
        total: 1,
        version: 1,
      },
      last_invoked_at: mockTimeSeconds,
    },
    QUESTION_ID_3: {
      answers: [
        {
          id: 'QUESTION_ID_3_ANSWER_ID_1',
        },
        {
          id: 'QUESTION_ID_3_ANSWER_ID_OTHER',
          value: 'other text answer',
        },
        {
          id: 'ROUND_2',
        },
        {
          id: 'QUESTION_ID_3_ANSWER_ID_OTHER',
          value: 'other text answer',
        },
      ],
      current_answer: [
        {
          id: 'ROUND_2',
        },
        {
          id: 'QUESTION_ID_3_ANSWER_ID_OTHER',
          value: 'other text answer',
        },
      ],
      invokes: {
        build: 2,
        total: 2,
        version: 2,
      },
      last_invoked_at: mockTimeSeconds,
    },
    QUESTION_ID_4: {
      answers: [
        {
          value: 'single line text answer',
        },
      ],
      current_answer: [
        {
          value: 'single line text answer',
        },
      ],
      invokes: {
        build: 1,
        total: 1,
        version: 1,
      },
      last_invoked_at: mockTimeSeconds,
    },
    QUESTION_ID_5: {
      answers: [
        {
          value: 'multi\nline\ntext answer',
        },
        {
          value: 'round 2',
        },
      ],
      current_answer: [
        {
          value: 'round 2',
        },
      ],
      invokes: {
        build: 2,
        total: 2,
        version: 2,
      },
      last_invoked_at: mockTimeSeconds,
    },
    SURVEY_ID: {
      last_submission_at: mockTimeSeconds,
    },
  });
});

test('LogicEngine.augmentNote(store, key, data): should create and update values in the store', () => {
  const store = {};
  const data = {
    action_id: 'DISMISS_ACTION_ID',
    id: 'NOTE_ID',
    label: 'Dismiss',
    position: 0,
  };
  LogicEngine.augmentNote(store, 'NOTE_ID', data);
  expect(store).toEqual({
    NOTE_ID: {
      answers: [
        {
          id: 'DISMISS_ACTION_ID',
          value: 'Dismiss',
        },
      ],
      last_submission_at: mockTimeSeconds,
    },
  });

  LogicEngine.augmentNote(store, 'NOTE_ID', null);
  expect(store).toEqual({
    NOTE_ID: {
      answers: [
        {
          id: 'DISMISS_ACTION_ID',
          value: 'Dismiss',
        },
      ],
      last_submission_at: mockTimeSeconds,
    },
  });

  const data2 = {
    action_id: 'INTERACTION_ACTION_ID',
    id: 'NOTE_ID',
    position: 0,
  };
  LogicEngine.augmentNote(store, 'NOTE_ID', data2);
  expect(store).toEqual({
    NOTE_ID: {
      answers: [
        {
          id: 'DISMISS_ACTION_ID',
          value: 'Dismiss',
        },
        {
          id: 'INTERACTION_ACTION_ID',
          value: '',
        },
      ],
      last_submission_at: mockTimeSeconds,
    },
  });
});

test('#evaluateConditionalTest: should prepare datetime types', () => {
  const logicEngine = setup();
  const value = new Date();
  const operator = '$before';
  const parameter = {
    _type: 'datetime',
    sec: Date.now() / 1000,
  };
  const output = logicEngine.evaluateConditionalTest(value, operator, parameter);

  expect(output).toBe(true);
});

test('#evaluateConditionalTest: should prepare version types', () => {
  const logicEngine = setup();
  const value = {
    _type: 'version',
    version: '1.0',
  };
  const operator = '$lt';
  const parameter = {
    _type: 'version',
    version: '1.1',
  };
  const output = logicEngine.evaluateConditionalTest(value, operator, parameter);

  expect(output).toBe(true);
});

test('#evaluateConditionalTest: should return false for unknown special types', () => {
  const logicEngine = setup();
  const value = {
    _type: 'character',
    level: 1,
  };
  const operator = '$lt';
  const parameter = {
    _type: 'character',
    level: 20,
  };
  const output = logicEngine.evaluateConditionalTest(value, operator, parameter);

  expect(output).toBe(false);
});

test('#evaluateConditionalTest: should return false if attempting to match an array value to a scalar param', () => {
  const logicEngine = setup();
  const output = logicEngine.evaluateConditionalTest(['fans'], '$contains', 1);
  expect(output).toBe(false);
});

test('#evaluateConditionalTest: should return false if attempting to test $exists against a non-boolean', () => {
  const logicEngine = setup();
  const output = logicEngine.evaluateConditionalTest(10, '$exists', 1);
  expect(output).toBe(false);
});

test('#evaluateConditionalTest: should return false if attempting to test datetime against a non-object', () => {
  const logicEngine = setup();
  const dateTimeParameter = {
    _type: 'datetime',
    sec: 462609785343,
  };
  const nonObjectValue = logicEngine.evaluateConditionalTest(42, '$before', dateTimeParameter);
  const nullValue = logicEngine.evaluateConditionalTest(null, '$before', dateTimeParameter);

  expect(nonObjectValue).toBe(false);
  expect(nullValue).toBe(false);
});

test('#evaluateConditionalTest: should return false if attempting to test version against a non-version object', () => {
  const logicEngine = setup();
  const versionParameter = {
    _type: 'version',
    version: '1.1.42',
  };
  const nonObjectValue = logicEngine.evaluateConditionalTest(42, '$before', versionParameter);
  const nullValue = logicEngine.evaluateConditionalTest(null, '$before', versionParameter);
  const nonVersionObject = logicEngine.evaluateConditionalTest(null, '$before', { _type: 'datetime' });

  expect(nonObjectValue).toBe(false);
  expect(nullValue).toBe(false);
  expect(nonVersionObject).toBe(false);
});

test('#evaluateConditionalTest: should return false if attempting to test time based operators against a non-number parameter', () => {
  const logicEngine = setup();
  const beforeNonNumber = logicEngine.evaluateConditionalTest(42, '$before', '42');
  const afterNonNumber = logicEngine.evaluateConditionalTest(42, '$after', '42');
  const beforeNullvalue = logicEngine.evaluateConditionalTest(null, '$before', 42);
  const afterNullvalue = logicEngine.evaluateConditionalTest(null, '$after', 42);

  expect(beforeNonNumber).toBe(false);
  expect(afterNonNumber).toBe(false);
  expect(beforeNullvalue).toBe(false);
  expect(afterNullvalue).toBe(false);
});

test('#evaluateConditionalTest: should return false if attempting to test string based operators against a non-string parameter or value', () => {
  const logicEngine = setup();

  const containsWrongType = logicEngine.evaluateConditionalTest(42, '$contains', 42);
  const startsWithWrongType = logicEngine.evaluateConditionalTest(42, '$starts_with', 42);
  const endsWithWrongType = logicEngine.evaluateConditionalTest(42, '$ends_with', 42);

  expect(containsWrongType).toBe(false);
  expect(startsWithWrongType).toBe(false);
  expect(endsWithWrongType).toBe(false);
});

test('#compare: $eq', () => {
  const logicEngine = setup();
  expect(logicEngine.compare('$eq', 1, 1)).toBe(true);
  expect(logicEngine.compare('$eq', 1, 1)).toBe(true);
  expect(logicEngine.compare('$eq', 1, 2)).toBe(false);

  expect(logicEngine.compare('$eq', 'a', 'a')).toBe(true);
  expect(logicEngine.compare('$eq', 'a', 'b')).toBe(false);
});

test('#compare: $ne', () => {
  const logicEngine = setup();
  expect(logicEngine.compare('$ne', 1, 2)).toBe(true);
  expect(logicEngine.compare('$ne', 1, 1)).toBe(false);
  expect(logicEngine.compare('$ne', 1, 1)).toBe(false);

  expect(logicEngine.compare('$ne', 'a', 'b')).toBe(true);
  expect(logicEngine.compare('$ne', 'a', 'a')).toBe(false);
});

test('#compare: $gt', () => {
  const logicEngine = setup();
  expect(logicEngine.compare('$gt', 2, 1)).toBe(true);
  expect(logicEngine.compare('$gt', 1, 1)).toBe(false);
  expect(logicEngine.compare('$gt', 1, 2)).toBe(false);
});

test('#compare: $after', () => {
  const logicEngine = setup();
  expect(logicEngine.compare('$after', 2, 1)).toBe(true);
  expect(logicEngine.compare('$after', 1, 1)).toBe(true);
  expect(logicEngine.compare('$after', 1, 2)).toBe(false);
});

test('#compare: $gte', () => {
  const logicEngine = setup();
  expect(logicEngine.compare('$gte', 2, 1)).toBe(true);
  expect(logicEngine.compare('$gte', 1, 1)).toBe(true);
  expect(logicEngine.compare('$gte', 1, 2)).toBe(false);
});

test('#compare: $lt', () => {
  const logicEngine = setup();
  expect(logicEngine.compare('$lt', 1, 2)).toBe(true);
  expect(logicEngine.compare('$lt', 2, 2)).toBe(false);
  expect(logicEngine.compare('$lt', 2, 1)).toBe(false);
});

test('#compare: $before', () => {
  const logicEngine = setup();
  expect(logicEngine.compare('$before', 1, 2)).toBe(true);
  expect(logicEngine.compare('$before', 2, 2)).toBe(true);
  expect(logicEngine.compare('$before', 2, 1)).toBe(false);
});

test('#compare: $lte', () => {
  const logicEngine = setup();
  expect(logicEngine.compare('$lte', 1, 2)).toBe(true);
  expect(logicEngine.compare('$lte', 2, 2)).toBe(true);
  expect(logicEngine.compare('$lte', 2, 1)).toBe(false);
});

test('#compare: $contains', () => {
  const logicEngine = setup();
  expect(logicEngine.compare('$contains', '😹😻😼', '😹')).toBe(true);
  expect(logicEngine.compare('$contains', '😹😻😼', '😻')).toBe(true);
  expect(logicEngine.compare('$contains', '😹😻😼', '😼')).toBe(true);

  expect(logicEngine.compare('$contains', 'abc', 'a')).toBe(true);
  expect(logicEngine.compare('$contains', 'abc', 'ab')).toBe(true);
  expect(logicEngine.compare('$contains', 'abc', 'bc')).toBe(true);
  expect(logicEngine.compare('$contains', 'abc', 'c')).toBe(true);

  expect(logicEngine.compare('$contains', '水曜日のカンパネラ', '水曜')).toBe(true);
  expect(logicEngine.compare('$contains', '水曜日のカンパネラ', 'パネラ')).toBe(true);

  expect(logicEngine.compare('$contains', 'abc', 'A')).toBe(false);
  expect(logicEngine.compare('$contains', 'abc', '')).toBe(false);
});

test('#compare: $array_contains', () => {
  const logicEngine = setup();
  expect(logicEngine.compare('$array_contains', ['😹', '😻', '😼'], '😹')).toBe(true);
  expect(logicEngine.compare('$array_contains', ['😹', '😻', '😼'], '😻')).toBe(true);
  expect(logicEngine.compare('$array_contains', ['😹', '😻', '😼'], '😼')).toBe(true);

  expect(logicEngine.compare('$array_contains', ['fans', 'critic'], 'fans')).toBe(true);
  expect(logicEngine.compare('$array_contains', ['fans', 'critic'], 'shifted')).toBe(false);

  // Not an array.
  expect(logicEngine.compare('$array_contains', 'shifted', 'shifted')).toBe(false);
});

test('#compare: $array_not_contains', () => {
  const logicEngine = setup();
  expect(logicEngine.compare('$array_not_contains', ['😹', '😻', '😼'], '😹')).toBe(false);
  expect(logicEngine.compare('$array_not_contains', ['😹', '😻', '😼'], '😻')).toBe(false);
  expect(logicEngine.compare('$array_not_contains', ['😹', '😻', '😼'], '😼')).toBe(false);

  expect(logicEngine.compare('$array_not_contains', ['fans', 'critic'], 'fans')).toBe(false);
  expect(logicEngine.compare('$array_not_contains', ['fans', 'critic'], 'shifted')).toBe(true);

  // Not an array.
  expect(logicEngine.compare('$array_not_contains', 'shifted', 'shifted')).toBe(false);
});

test('#compare: $starts_with', () => {
  const logicEngine = setup();
  expect(logicEngine.compare('$starts_with', '😹😻😼', '😹')).toBe(true);
  expect(logicEngine.compare('$starts_with', '😹😻😼', '😻')).toBe(false);
  expect(logicEngine.compare('$starts_with', '😹😻😼', '😼')).toBe(false);

  expect(logicEngine.compare('$starts_with', 'abc', 'a')).toBe(true);
  expect(logicEngine.compare('$starts_with', 'abc', 'ab')).toBe(true);
  expect(logicEngine.compare('$starts_with', 'abc', 'bc')).toBe(false);
  expect(logicEngine.compare('$starts_with', 'abc', 'c')).toBe(false);

  expect(logicEngine.compare('$starts_with', '水曜日のカンパネラ', '水曜')).toBe(true);
  expect(logicEngine.compare('$starts_with', '水曜日のカンパネラ', 'パネラ')).toBe(false);

  expect(logicEngine.compare('$starts_with', 'abc', 'A')).toBe(false);
  expect(logicEngine.compare('$starts_with', 'abc', '')).toBe(false);
});

test('#compare: $ends_with', () => {
  const logicEngine = setup();
  expect(logicEngine.compare('$ends_with', '😹😻😼', '😹')).toBe(false);
  expect(logicEngine.compare('$ends_with', '😹😻😼', '😻')).toBe(false);
  expect(logicEngine.compare('$ends_with', '😹😻😼', '😼')).toBe(true);

  expect(logicEngine.compare('$ends_with', 'abc', 'a')).toBe(false);
  expect(logicEngine.compare('$ends_with', 'abc', 'ab')).toBe(false);
  expect(logicEngine.compare('$ends_with', 'abc', 'bc')).toBe(true);
  expect(logicEngine.compare('$ends_with', 'abc', 'c')).toBe(true);

  expect(logicEngine.compare('$ends_with', '水曜日のカンパネラ', '水曜')).toBe(false);
  expect(logicEngine.compare('$ends_with', '水曜日のカンパネラ', 'パネラ')).toBe(true);

  expect(logicEngine.compare('$ends_with', 'abc', 'C')).toBe(false);
  expect(logicEngine.compare('$ends_with', 'abc', 'ç')).toBe(false);
  expect(logicEngine.compare('$ends_with', 'abc', '')).toBe(false);
});

test('#compare: $exists', () => {
  const logicEngine = setup();
  expect(logicEngine.compare('$exists', '😹😻😼', '😹')).toBe(true);
  expect(logicEngine.compare('$exists', ['anything'], '😼')).toBe(true);
  expect(logicEngine.compare('$exists', 1, '😼')).toBe(true);
  expect(logicEngine.compare('$exists', true, '😼')).toBe(true);
  expect(logicEngine.compare('$exists', false, '😼')).toBe(true);

  expect(logicEngine.compare('$exists', null, '😻')).toBe(false);
  expect(logicEngine.compare('$exists', undefined, '😻')).toBe(false);
  expect(logicEngine.compare('$exists', '', '😻')).toBe(false);
  expect(logicEngine.compare('$exists', [], '😼')).toBe(false);
});

test('#compare: unknown / default', () => {
  const logicEngine = setup();
  expect(logicEngine.compare('unknown', '😹😻😼', '😹')).toBe(false);
  expect(logicEngine.compare('unknown', '😹😻😼', '😻')).toBe(false);
  expect(logicEngine.compare('unknown', '😹😻😼', '😼')).toBe(false);

  expect(logicEngine.compare('unknown', 'abc', 'a')).toBe(false);
  expect(logicEngine.compare('unknown', 'abc', 'ab')).toBe(false);
  expect(logicEngine.compare('unknown', 'abc', 'bc')).toBe(false);
  expect(logicEngine.compare('unknown', 'abc', 'c')).toBe(false);

  expect(logicEngine.compare('unknown', '水曜日のカンパネラ', '水曜')).toBe(false);
  expect(logicEngine.compare('unknown', '水曜日のカンパネラ', 'パネラ')).toBe(false);

  expect(logicEngine.compare('unknown', 'abc', 'C')).toBe(false);
  expect(logicEngine.compare('unknown', 'abc', 'ç')).toBe(false);
});

test('#defaultValueForKey: interactions and codePoint /invokes', () => {
  const logicEngine = setup();
  expect(logicEngine.defaultValueForKey('interactions/QUESTION_ID_1/answers')).toBe(null);
  expect(logicEngine.defaultValueForKey('interactions/55bffcd3e1c388521a000bd0/invokes/version')).toBe(0);
  expect(logicEngine.defaultValueForKey('code_point/com.apptentive#RatingDialog#remind/invokes/total')).toBe(0);
});

test('#defaultValueForKey: current_time', () => {
  const logicEngine = setup();
  expect(logicEngine.defaultValueForKey('current_time') instanceof Date).toBe(true);
});

test('#defaultValueForKey: is_update/version', () => {
  const logicEngine = setup();
  expect(logicEngine.defaultValueForKey('is_update/version')).toBe(false);
});

test('#defaultValueForKey: unknown', () => {
  const logicEngine = setup();
  expect(logicEngine.defaultValueForKey('unknown')).toBe(null);
});

test('#valueForKey: default value keys: current_time', () => {
  const logicEngine = setup();
  expect(logicEngine.valueForKey('current_time')).toEqual(new Date());
});

test('#valueForKey: default value keys: is_update/version', () => {
  const logicEngine = setup();
  expect(logicEngine.valueForKey('is_update/version')).toBe(false);
});

test('#valueForKey: returns the value for a given key with no data: application/version', () => {
  const logicEngine = setup();
  expect(logicEngine.valueForKey('application/version')).toBe(null);
});

test('#valueForKey: returns the value for a given key with no data: device/custom_data/number_5', () => {
  const logicEngine = setup();
  expect(logicEngine.valueForKey('device/custom_data/number_5')).toBe(null);
});

test('#valueForKey: returns the value for a given key with no data: device/custom_data/key_with_null_value', () => {
  const logicEngine = setup();
  expect(logicEngine.valueForKey('device/custom_data/key_with_null_value')).toBe(null);
});

test('#valueForKey: returns the value for a given key with no data: device/custom_data/non_existent_key', () => {
  const logicEngine = setup();
  expect(logicEngine.valueForKey('device/custom_data/non_existent_key')).toBe(null);
});

test('#valueForKey: returns the value for a given key with no data: device/custom_data/string with spaces', () => {
  const logicEngine = setup();
  expect(logicEngine.valueForKey('device/custom_data/string with spaces')).toBe(null);
});

test('#valueForKey: returns the value for a given key with no data: device/custom_data/string_qwerty ', () => {
  const logicEngine = setup();
  expect(logicEngine.valueForKey('device/custom_data/string_qwerty ')).toBe(null);
});

test('#valueForKey: returns the value for a given key with no data: device/custom_data/ string_qwerty', () => {
  const logicEngine = setup();
  expect(logicEngine.valueForKey('device/custom_data/ string_qwerty')).toBe(null);
});

test('#valueForKey: returns the value for a given key with no data: device/custom_data /string_qwerty', () => {
  const logicEngine = setup();
  expect(logicEngine.valueForKey('device/custom_data /string_qwerty')).toBe(null);
});

test('#valueForKey: returns the value for a given key with no data: device/ custom_data/string_qwerty', () => {
  const logicEngine = setup();
  expect(logicEngine.valueForKey('device/ custom_data/string_qwerty')).toBe(null);
});

test('#valueForKey: returns the value for a given key with no data: device /custom_data/string_qwerty', () => {
  const logicEngine = setup();
  expect(logicEngine.valueForKey('device /custom_data/string_qwerty')).toBe(null);
});

test('#valueForKey: returns the value for a given key with no data: person/custom_data/key_with_null_value', () => {
  const logicEngine = setup();
  expect(logicEngine.valueForKey('person/custom_data/key_with_null_value')).toBe(null);
});

test('#valueForKey: returns the value for a given key with no data: person/custom_data/foo', () => {
  const logicEngine = setup();
  expect(logicEngine.valueForKey('person/custom_data/foo')).toBe(null);
});

test('#valueForKey: returns the value for a given key with no data: time_at_install/total', () => {
  const logicEngine = setup();
  expect(logicEngine.valueForKey('time_at_install/total')).toBe(null);
});

test('#valueForKey: returns the value for a given key with no data: interactions/55bffcd3e1c388521a000bd0/invokes/version', () => {
  const logicEngine = setup();
  expect(logicEngine.valueForKey('interactions/55bffcd3e1c388521a000bd0/invokes/version')).toBe(0);
});

test('#valueForKey: returns the value for a given key with no data: codePoint/com.apptentive#RatingDialog#remind/invokes/total', () => {
  const logicEngine = setup();
  expect(logicEngine.valueForKey('code_point/com.apptentive#RatingDialog#remind/invokes/total')).toBe(0);
});

test('#valueForKey: returns the value for a given key with data: application/version', () => {
  const logicEngine = setup();
  logicEngine.application = {
    version: '1.2.3',
  };
  expect(logicEngine.valueForKey('application/version')).toBe('1.2.3');
});

test('#valueForKey: returns the value for a given key with data: device/custom_data/number_5', () => {
  const logicEngine = setup();
  logicEngine.device = {
    custom_data: {
      number_5: 5,
    },
  };
  expect(logicEngine.valueForKey('device/custom_data/number_5')).toBe(5);
});

test('#valueForKey: returns the value for a given key with data: device/custom_data/key_with_null_value', () => {
  const logicEngine = setup();
  logicEngine.device = {
    custom_data: {
      key_with_null_value: null,
    },
  };
  expect(logicEngine.valueForKey('device/custom_data/key_with_null_value')).toBe(null);
});

test('#valueForKey: returns the value for a given key with data: device/custom_data/non_existent_key', () => {
  const logicEngine = setup();
  logicEngine.device = {
    custom_data: {},
  };
  expect(logicEngine.valueForKey('device/custom_data/non_existent_key')).toBe(null);
});

test('#valueForKey: returns the value for a given key with data: device/custom_data/string with spaces', () => {
  const logicEngine = setup();
  logicEngine.device = {
    custom_data: {
      'string with spaces': 'test',
    },
  };
  expect(logicEngine.valueForKey('device/custom_data/string with spaces')).toBe('test');
});

test('#valueForKey: returns the value for a given key with data: device/custom_data/string_qwerty ', () => {
  const logicEngine = setup();
  logicEngine.device = {
    custom_data: {
      string_qwerty: 'qwerty',
    },
  };
  expect(logicEngine.valueForKey('device/custom_data/string_qwerty ')).toBe('qwerty');
});

test('#valueForKey: returns the value for a given key with data: device/custom_data/ string_qwerty', () => {
  const logicEngine = setup();
  logicEngine.device = {
    custom_data: {
      string_qwerty: 'qwerty',
    },
  };
  expect(logicEngine.valueForKey('device/custom_data/ string_qwerty')).toBe('qwerty');
});

test('#valueForKey: returns the value for a given key with data: device/custom_data /string_qwerty', () => {
  const logicEngine = setup();
  logicEngine.device = {
    custom_data: {
      string_qwerty: 'qwerty',
    },
  };
  expect(logicEngine.valueForKey('device/custom_data /string_qwerty')).toBe('qwerty');
});

test('#valueForKey: returns the value for a given key with data: device/ custom_data/string_qwerty', () => {
  const logicEngine = setup();
  logicEngine.device = {
    custom_data: {
      string_qwerty: 'qwerty',
    },
  };
  expect(logicEngine.valueForKey('device/ custom_data/string_qwerty')).toBe('qwerty');
});

test('#valueForKey: returns the value for a given key with data: device /custom_data/string_qwerty', () => {
  const logicEngine = setup();
  logicEngine.device = {
    custom_data: {
      string_qwerty: 'qwerty',
    },
  };
  expect(logicEngine.valueForKey('device /custom_data/string_qwerty')).toBe('qwerty');
});

test('#valueForKey: returns the value for a given key with data: person/custom_data/key_with_null_value', () => {
  const logicEngine = setup();
  logicEngine.device = {
    custom_data: {
      string_qwerty: 'qwerty',
    },
  };
  expect(logicEngine.valueForKey('person/custom_data/key_with_null_value')).toBe(null);
});

test('#valueForKey: returns the value for a given key with data: person/custom_data/foo', () => {
  const logicEngine = setup();
  logicEngine.person = {
    custom_data: {
      foo: 'bar',
    },
  };
  expect(logicEngine.valueForKey('person/custom_data/foo')).toBe('bar');
});

test('#valueForKey: returns the value for a given key with data: time_at_install/total', () => {
  const logicEngine = setup();
  logicEngine.time_at_install = {
    total: 1234567890,
  };
  expect(logicEngine.valueForKey('time_at_install/total')).toBe(1234567890);
});

test('#valueForKey: returns the value for a given key with data: interactions/55bffcd3e1c388521a000bd0/invokes/version', () => {
  const logicEngine = setup();
  logicEngine.interaction_counts = {
    '55bffcd3e1c388521a000bd0': {
      invokes: {
        total: 1,
        version: 1,
        build: 1,
      },
      last_invoked_at: new Date(),
    },
  };
  expect(logicEngine.valueForKey('interactions/55bffcd3e1c388521a000bd0/invokes/version')).toBe(1);
});

test('#valueForKey: returns the value for a given key with data: codePoint/com.apptentive#RatingDialog#remind/invokes/total', () => {
  const logicEngine = setup();
  logicEngine.codePoint = {
    'com.apptentive#RatingDialog#remind': {
      invokes: {
        total: 2,
        version: 2,
        build: 2,
      },
      last_invoked_at: new Date(),
    },
  };
  expect(logicEngine.valueForKey('codePoint/com.apptentive#RatingDialog#remind/invokes/total')).toBe(2);
});

test('#valueForKey: returns the value for a given key with data: codePoint/com.apptentive#RatingDialog#remind/last_invoked_at/total', () => {
  const logicEngine = setup();
  logicEngine.codePoint = {
    'com.apptentive#RatingDialog#remind': {
      invokes: {
        total: 2,
        version: 2,
        build: 2,
      },
      last_invoked_at: 1591981562169,
    },
  };
  expect(logicEngine.valueForKey('codePoint/com.apptentive#RatingDialog#remind/last_invoked_at/total')).toBe(
    1591981562169
  );
});

test('#valueForKey: returns the value for a given key with data: random/🔑/percent', () => {
  const logicEngine = setup(false);
  logicEngine.random = {
    '🔑': 50,
  };
  expect(logicEngine.valueForKey('random/🔑/percent')).toBe(50);
});

test('#valueForKey: returns the value for a given key with data: device/os_name/MacOS', () => {
  const logicEngine = setup();
  logicEngine.device = {
    os_name: OsNameEnum.MAC_OS,
  };
  expect(logicEngine.valueForKey('device/os_name')).toBe(OsNameEnum.MAC_OS);
});

// evaluateCriteriaKeyValue

test('#targetedInteractionId: should return the first interaction for a given event if the criteria is met', () => {
  const logicEngine = setup();
  logicEngine.targeted_events = {
    'local#app#tracked_exercise': [
      {
        criteria: {},
        interaction_id: '55bffcd3e1c388521a000bd0',
      },
    ],
  };
  const target = logicEngine.targetedInteractionId('local#app#tracked_exercise');

  expect(target).not.toBe(null);
  expect(target).toBe('55bffcd3e1c388521a000bd0');
});

test('#targetedInteractionId: should return null if there are no interactions for an event', () => {
  const logicEngine = setup();
  logicEngine.targeted_events = {
    'local#app#tracked_exercise': [
      {
        criteria: {},
        interaction_id: '55bffcd3e1c388521a000bd0',
      },
    ],
  };
  const target = logicEngine.targetedInteractionId('local#app#not_defined');

  expect(target).toBe(null);
});

test('#interactionIdForInvocations: should return the first target ID for a given event if the criteria is met', () => {
  const logicEngine = setup();
  logicEngine.targeted_events = {
    'local#app#tracked_exercise': [
      {
        criteria: {},
        interaction_id: '55bffcd3e1c388521a000bd0',
      },
    ],
  };
  const target = logicEngine.interactionIdForInvocations(logicEngine.targeted_events['local#app#tracked_exercise']);

  expect(target).not.toBe(null);
  expect(target).toBe('55bffcd3e1c388521a000bd0');
});

test('#interactionIdForInvocations: should return null if there are no interactions for an event', () => {
  const logicEngine = setup();
  logicEngine.targeted_events = {
    'local#app#tracked_exercise': [
      {
        criteria: {},
        interaction_id: '55bffcd3e1c388521a000bd0',
      },
    ],
  };
  const target = logicEngine.interactionIdForInvocations(logicEngine.targeted_events['local#app#missing']);

  expect(target).toBe(null);
});

test('#interactionIdForInvocations: should return null if the target is not an Array', () => {
  const logicEngine = setup();
  const target = logicEngine.interactionIdForInvocations(true);

  expect(target).toBe(null);
});

test('#interactionFromId: should return an interaction with the given ID', () => {
  const logicEngine = setup();
  const interaction = logicEngine.interactionFromId('55bffcd3e1c388521a000bd0');

  expect(interaction).not.toBe(null);
  expect(interaction.type).toBe('RatingDialog');
});

test('#interactionFromId: should return null when there is no interaction for the given ID', () => {
  const logicEngine = setup();
  const interaction = logicEngine.interactionFromId('not_found');

  expect(interaction).toBe(null);
});

test('#interactionFromId: should return null when there is no ID provided', () => {
  const logicEngine = setup();
  const interaction = logicEngine.interactionFromId();

  expect(interaction).toBe(null);
});

test('#interactionFromType: should return interactions with the given type', () => {
  const logicEngine = setup();
  const interactions = logicEngine.interactionFromType('MessageCenter');

  expect(interactions.length).toBe(2);
});

test('#interactionFromType: should return an empty array when there is no interaction for the given type', () => {
  const logicEngine = setup();
  const interactions = logicEngine.interactionFromType('not_found');

  expect(interactions.length).toBe(0);
});

test('#interactionFromType: should return an empty array when there is no type provided', () => {
  const logicEngine = setup();
  const interactions = logicEngine.interactionFromType();

  expect(interactions.length).toBe(0);
});

test('#interactionForInvocations: should return the first interaction for a given set of invocations', () => {
  const logicEngine = setup(false);
  const interaction = logicEngine.interactionForInvocations([
    { criteria: {}, interaction_id: '56b24833c21f96e6700000a8' },
  ]);

  expect(interaction).toEqual(navigateToLinkA);
});

test('#canShowInteractionForEvent: should return the first interaction for an event', () => {
  const logicEngine = setup(false);
  let interaction = logicEngine.canShowInteractionForEvent('local#app#tracked_exercise');
  expect(interaction).toBe(null);

  interaction = logicEngine.canShowInteractionForEvent('local#app#event_5');
  expect(interaction).toEqual(survey5);
});

test('#engageEvent: should call engageCodePoint', () => {
  const logicEngine = setup();
  const spy = jest.spyOn(logicEngine, 'engageCodePoint');
  logicEngine.engageEvent('local#app#test_event_1');

  expect(spy).toHaveBeenCalledTimes(1);

  logicEngine.engageCodePoint.mockRestore();
});

test('#engageEvent: should search for an interaction', () => {
  const logicEngine = setup();
  const spy = jest.spyOn(logicEngine, 'targetedInteractionId');
  logicEngine.engageEvent('local#app#test_event_1');

  expect(spy).toHaveBeenCalledTimes(1);

  logicEngine.targetedInteractionId.mockRestore();
});

test('#engageEvent: should return an interaction', () => {
  const logicEngine = setup();
  const interaction = logicEngine.engageEvent('local#app#test_event_1');

  expect(interaction).not.toBe(null);
});

test('#engageEvent: should engage an interaction', () => {
  const logicEngine = setup();
  logicEngine.targeted_events = {
    'local#app#tracked_exercise': [
      {
        criteria: {},
        interaction_id: '55bffcd3e1c388521a000bd0',
      },
    ],
  };

  const interaction = logicEngine.engageEvent('local#app#tracked_exercise');
  expect(interaction).not.toBe(null);
});

test('#engageEvent: should not fail with no returned interaction', () => {
  const logicEngine = setup();
  logicEngine.targeted_events = {};

  const interaction = logicEngine.engageEvent('local#app#tracked_exercise');

  expect(interaction).toBe(null);
});

test('#createOrUpdate: should create the code point in the internal code_point object', () => {
  const logicEngine = setup();
  const codePoint = 'local#app#new_test_event_1';
  LogicEngine.createOrUpdate(logicEngine.code_point, codePoint);

  expect(logicEngine.code_point[codePoint].invokes).toEqual({
    build: 1,
    total: 1,
    version: 1,
  });
});

test('#createOrUpdate: should update the internal code_point object', () => {
  const logicEngine = setup();
  const codePoint = 'local#app#test_event_1';
  LogicEngine.createOrUpdate(logicEngine.code_point, codePoint);
  LogicEngine.createOrUpdate(logicEngine.code_point, codePoint);

  expect(logicEngine.code_point[codePoint].invokes).toEqual({
    build: 2,
    total: 2,
    version: 2,
  });
});

test('#createOrUpdate: does not update last_invoke_at timestamp if turned off', () => {
  const logicEngine = setup();
  const codePoint = 'local#app#test_event_1';
  LogicEngine.createOrUpdate(logicEngine.code_point, codePoint, false);

  expect(logicEngine.code_point[codePoint].invokes).toEqual({
    build: 1,
    total: 1,
    version: 1,
  });

  expect(logicEngine.code_point[codePoint].last_invoked_at).toBe(undefined);
});

test('#engageCodePoint: properly updates the timestamp of a code point', () => {
  const logicEngine = setup();
  const codePoint = 'local#app#test_event_1';

  LogicEngine.createOrUpdate(logicEngine.code_point, codePoint, false);
  logicEngine.engageCodePoint(codePoint);

  expect(logicEngine.code_point[codePoint].invokes).toEqual({
    build: 1,
    total: 1,
    version: 1,
  });

  expect(logicEngine.code_point[codePoint].last_invoked_at).not.toBe(undefined);
});

test('#engageCodePoint: should handle Survey events and update the internal codePoint object', () => {
  const logicEngine = setup();
  const spy = jest.spyOn(LogicEngine, 'augmentSurvey');
  const codePoint = 'com.apptentive#Survey#submit';

  logicEngine.engageCodePoint(codePoint);
  expect(spy).not.toHaveBeenCalled();

  logicEngine.engageCodePoint(codePoint, { id: 'survey-id' });
  expect(spy.mock.calls[0]).toEqual([
    {
      'survey-id': {
        last_submission_at: mockTimeSeconds,
      },
    },
    'survey-id',
    {
      id: 'survey-id',
    },
  ]);

  LogicEngine.augmentSurvey.mockRestore();
});

test('#engageCodePoint: should handle Note events and update the internal codePoint object', () => {
  const logicEngine = setup();
  const spy = jest.spyOn(LogicEngine, 'augmentNote');

  logicEngine.engageCodePoint('com.apptentive#TextModal#dismiss');
  expect(spy).not.toHaveBeenCalled();

  logicEngine.engageCodePoint('com.apptentive#TextModal#dismiss', { id: 'note-id', label: 'Take Survey' });
  expect(spy.mock.calls[0]).toEqual([
    {
      'note-id': {
        last_submission_at: mockTimeSeconds,
      },
    },
    'note-id',
    {
      id: 'note-id',
      label: 'Take Survey',
    },
  ]);

  spy.mockReset();

  logicEngine.engageCodePoint('com.apptentive#TextModal#interaction');
  expect(spy).not.toHaveBeenCalled();

  logicEngine.engageCodePoint('com.apptentive#TextModal#interaction', { id: 'note-id', label: 'Dismiss' });
  expect(spy.mock.calls[0]).toEqual([
    {
      'note-id': {
        last_submission_at: mockTimeSeconds,
      },
    },
    'note-id',
    {
      id: 'note-id',
      label: 'Dismiss',
    },
  ]);

  LogicEngine.augmentNote.mockRestore();
});

test('#engageInteraction: should create the interaction in the interactions array if it is new', () => {
  const logicEngine = setup();
  const interaction = { id: '55bffcd3e1c388521a000bd0' };
  logicEngine.engageInteraction(interaction);

  expect(logicEngine.interaction_counts[interaction.id].invokes).toEqual({
    build: 1,
    total: 1,
    version: 1,
  });
});

test('#engageInteraction: should update the internal interactions array', () => {
  const logicEngine = setup();
  const interaction = { id: '55bffcd3e1c388521a000bd0' };
  logicEngine.engageInteraction(interaction);
  logicEngine.engageInteraction(interaction);

  expect(logicEngine.interaction_counts[interaction.id].invokes).toEqual({
    build: 2,
    total: 2,
    version: 2,
  });
});

test('#reset: should reset back to the inital state', () => {
  const logicEngine = setup();
  jest.useFakeTimers();
  logicEngine.engageEvent('local#app#test_event_1');

  expect(logicEngine.code_point).toEqual({
    'local#app#test_event_1': {
      invokes: {
        build: 1,
        total: 1,
        version: 1,
      },
      last_invoked_at: Date.now(),
    },
  });

  expect(logicEngine.interaction_counts).toEqual({
    '55fb3bb9273db67b7200002a': {
      invokes: {
        build: 1,
        total: 1,
        version: 1,
      },
      last_invoked_at: Date.now(),
    },
  });

  logicEngine.reset();

  expect(logicEngine.code_point).toEqual({});
  expect(logicEngine.interaction_counts).toEqual({});
  expect(logicEngine.random).toEqual({});
  expect(logicEngine.device).toEqual({});
  expect(logicEngine.person).toEqual({});

  jest.useRealTimers();
});

// E2E is evaluateCriteria

test('E2E: Survey Question Targeting', () => {
  const logicEngine = setup(true);
  const criteria = {
    $and: [
      {
        'interactions/QUESTION_ID_1/answers/value': 1,
      },
      {
        'interactions/QUESTION_ID_1/answers/value': {
          $ne: 4,
        },
      },
      {
        'interactions/QUESTION_ID_2/answers/id': 'QUESTION_ID_2_ANSWER_ID_1',
      },
      {
        $or: [
          {
            'interactions/QUESTION_ID_3/answers/id': 'QUESTION_ID_3_ANSWER_ID_1',
          },
          {
            'interactions/QUESTION_ID_3/answers/id': {
              $ne: 'QUESTION_ID_3_ANSWER_ID_2',
            },
          },
          {
            'interactions/QUESTION_ID_3/answers/value': {
              $contains: 'text answer',
            },
          },
        ],
      },
      {
        'interactions/QUESTION_ID_4/answers/value': {
          $starts_with: 'single',
        },
      },
      {
        'interactions/QUESTION_ID_5/answers/value': {
          $ends_with: 'text answer',
        },
      },
      {
        'interactions/QUESTION_ID_5/answers/value': {
          $exists: true,
        },
      },
    ],
  };
  expect(logicEngine.evaluateCriteria(criteria)).toBe(true);
});

test('E2E: Survey Question Targeting (current_answer)', () => {
  const logicEngine = setup(true);
  const criteria = {
    $and: [
      {
        'interactions/QUESTION_ID_1/current_answer/value': 'rabbit',
      },
      {
        'interactions/QUESTION_ID_1/current_answer/value': {
          $ne: 4,
        },
      },
      {
        'interactions/QUESTION_ID_2/current_answer/id': 'QUESTION_ID_2_ANSWER_ID_3',
      },
      {
        $or: [
          {
            'interactions/QUESTION_ID_3/current_answer/id': 'QUESTION_ID_3_ANSWER_ID_1',
          },
          {
            'interactions/QUESTION_ID_3/current_answer/id': {
              $ne: 'QUESTION_ID_3_ANSWER_ID_2',
            },
          },
          {
            'interactions/QUESTION_ID_3/current_answer/value': {
              $contains: 'text answer',
            },
          },
        ],
      },
      {
        'interactions/QUESTION_ID_4/current_answer/value': {
          $starts_with: 'single',
        },
      },
      {
        'interactions/QUESTION_ID_5/current_answer/value': {
          $ends_with: 'two',
        },
      },
      {
        'interactions/QUESTION_ID_5/current_answer/value': {
          $exists: true,
        },
      },
    ],
  };
  expect(logicEngine.evaluateCriteria(criteria)).toBe(true);
});

test('E2E: Survey Question Targeting - Value: Equal', () => {
  const logicEngine = setup(true);
  const criteria = {
    $and: [
      {
        'interactions/QUESTION_ID_1/answers/value': '3',
      },
      {
        'interactions/QUESTION_ID_1/answers/value': {
          $eq: '3',
        },
      },
      {
        'interactions/QUESTION_ID_1/current_answer/value': 'rabbit',
      },
      {
        'interactions/QUESTION_ID_1/current_answer/value': {
          $eq: 'rabbit',
        },
      },
    ],
  };
  expect(logicEngine.evaluateCriteria(criteria)).toBe(true);
});

test('E2E: Survey Question Targeting - Value: Not Equal', () => {
  const logicEngine = setup(true);
  const criteria = {
    $and: [
      {
        'interactions/QUESTION_ID_1/answers/value': {
          $ne: 4,
        },
      },
      {
        'interactions/QUESTION_ID_1/current_answer/value': {
          $ne: 4,
        },
      },
    ],
  };
  expect(logicEngine.evaluateCriteria(criteria)).toBe(true);
});

test('E2E: Survey Question Targeting - Value: Starts With', () => {
  const logicEngine = setup(true);
  const criteria = {
    $and: [
      {
        'interactions/QUESTION_ID_1/answers/value': {
          $starts_with: 'rab',
        },
      },
      {
        'interactions/QUESTION_ID_1/current_answer/value': {
          $starts_with: 'rab',
        },
      },
    ],
  };
  expect(logicEngine.evaluateCriteria(criteria)).toBe(true);
});

test('E2E: Survey Question Targeting - Value: Ends With', () => {
  const logicEngine = setup(true);
  const criteria = {
    $and: [
      {
        'interactions/QUESTION_ID_1/answers/value': {
          $ends_with: 'bit',
        },
      },
      {
        'interactions/QUESTION_ID_1/current_answer/value': {
          $ends_with: 'bit',
        },
      },
    ],
  };
  expect(logicEngine.evaluateCriteria(criteria)).toBe(true);
});

test('E2E: Survey Question Targeting - Value: Contains', () => {
  const logicEngine = setup(true);
  const criteria = {
    $and: [
      {
        'interactions/QUESTION_ID_1/answers/value': {
          $contains: 'abbi',
        },
      },
      {
        'interactions/QUESTION_ID_1/current_answer/value': {
          $contains: 'abbi',
        },
      },
    ],
  };
  expect(logicEngine.evaluateCriteria(criteria)).toBe(true);
});

test('E2E: Survey Question Targeting - Value: Exists', () => {
  const logicEngine = setup(true);
  const criteria = {
    $and: [
      {
        'interactions/QUESTION_ID_1/answers/value': {
          $exists: true,
        },
      },
      {
        'interactions/QUESTION_ID_1/current_answer/value': {
          $exists: true,
        },
      },
    ],
  };
  expect(logicEngine.evaluateCriteria(criteria)).toBe(true);
});

test('E2E: Survey Question Targeting - Value: Not Exists', () => {
  const logicEngine = setup(true);
  const criteria = {
    $and: [
      {
        'interactions/QUESTION_ID_6/answers/value': {
          $exists: false,
        },
      },
      {
        'interactions/QUESTION_ID_6/current_answer/value': {
          $exists: false,
        },
      },
    ],
  };
  expect(logicEngine.evaluateCriteria(criteria)).toBe(true);
});

test('E2E: Survey Question Targeting - ID: Equal', () => {
  const logicEngine = setup(true);
  const criteria = {
    $and: [
      {
        'interactions/QUESTION_ID_2/answers/id': {
          $eq: 'QUESTION_ID_2_ANSWER_ID_3',
        },
      },
      {
        'interactions/QUESTION_ID_2/current_answer/id': {
          $eq: 'QUESTION_ID_2_ANSWER_ID_3',
        },
      },
    ],
  };
  expect(logicEngine.evaluateCriteria(criteria)).toBe(true);
});

test('E2E: Survey Question Targeting - ID: Not Equal', () => {
  const logicEngine = setup(true);
  const criteria = {
    $and: [
      {
        'interactions/QUESTION_ID_2/answers/id': {
          $ne: 'QUESTION_ID_2_ANSWER_ID_2',
        },
      },
      {
        'interactions/QUESTION_ID_2/current_answer/id': {
          $ne: 'QUESTION_ID_2_ANSWER_ID_2',
        },
      },
    ],
  };
  expect(logicEngine.evaluateCriteria(criteria)).toBe(true);
});

test('E2E: Survey Question Targeting - ID: Not Equal & Unseen Interaction', () => {
  const logicEngine = setup(true);
  const criteria = {
    $and: [
      {
        'interactions/QUESTION_ID_UNSEEN/answers/id': {
          $ne: 'QUESTION_ID_UNSEEN_ANSWER_ID_2',
        },
      },
      {
        'interactions/QUESTION_ID_UNSEEN/current_answer/id': {
          $ne: 'QUESTION_ID_UNSEEN_ANSWER_ID_2',
        },
      },
    ],
  };
  expect(logicEngine.evaluateCriteria(criteria)).toBe(false);
});

test('E2E: Survey Question Targeting - ID: Exists', () => {
  const logicEngine = setup(true);
  const criteria = {
    $and: [
      {
        'interactions/QUESTION_ID_2/answers/id': {
          $exists: true,
        },
      },
      {
        'interactions/QUESTION_ID_2/current_answer/id': {
          $exists: true,
        },
      },
    ],
  };
  expect(logicEngine.evaluateCriteria(criteria)).toBe(true);
});

test('E2E: Survey Question Targeting - ID: Not Exists', () => {
  const logicEngine = setup(true);
  const criteria = {
    $and: [
      {
        'interactions/QUESTION_ID_2/answers/id': {
          $exists: false,
        },
      },
      {
        'interactions/QUESTION_ID_2/current_answer/id': {
          $exists: false,
        },
      },
    ],
  };
  expect(logicEngine.evaluateCriteria(criteria)).toBe(false);
});

test('E2E: Survey Question Targeting - Edge Case: Malformed Storage for answers/value', () => {
  const logicEngine = setup(true);
  const criteria = {
    $and: [
      {
        'interactions/QUESTION_ID_1_BROKEN/answers/value': 1,
      },
      {
        'interactions/QUESTION_ID_1_BROKEN/current_answer/value': 1,
      },
    ],
  };
  expect(logicEngine.evaluateCriteria(criteria)).toBe(false);
});

test('E2E: Survey Question Targeting - Edge Case: Malformed Storage for answers/id', () => {
  const logicEngine = setup(true);
  const criteria = {
    $and: [
      {
        'interactions/QUESTION_ID_2_BROKEN/answers/id': 'QUESTION_ID_2_ANSWER_ID_1',
      },
      {
        'interactions/QUESTION_ID_2_BROKEN/current_answer/id': 'QUESTION_ID_2_ANSWER_ID_1',
      },
    ],
  };
  expect(logicEngine.evaluateCriteria(criteria)).toBe(false);
});

test('E2E: Operator Equal', () => {
  const logicEngine = setup(true);
  const criteria = {
    $and: [
      {
        'device/custom_data/number_5': 5,
      },
      {
        'device/custom_data/number_5': {
          $eq: 5,
        },
      },
      {
        $not: [
          {
            'device/custom_data/number_5': 4,
          },
        ],
      },
      {
        'device/custom_data/number_5': {
          $ne: 4,
        },
      },
      {
        $not: [
          {
            'device/custom_data/number_5': {
              $ne: 5,
            },
          },
        ],
      },
    ],
  };
  expect(logicEngine.evaluateCriteria(criteria)).toBe(true);
});

test('E2E: Operator Not', () => {
  const logicEngine = setup(true);
  const criteria = {
    $and: [
      {
        'application/version': {
          $exists: true,
        },
      },
      // Legacy Format
      {
        $not: {
          'application/version': {
            $exists: false,
          },
        },
      },
      {
        $not: [
          {
            'application/version': {
              $exists: false,
            },
          },
        ],
      },
      {
        $not: [
          {
            $not: [
              {
                'application/version': {
                  $exists: true,
                },
              },
            ],
          },
        ],
      },
    ],
  };
  expect(logicEngine.evaluateCriteria(criteria)).toBe(true);
});

test('E2E: Operator Exists', () => {
  const logicEngine = setup(true);
  const criteria = {
    $and: [
      {
        'device/custom_data/number_5': {
          $exists: true,
        },
      },
      {
        $not: [
          {
            'device/custom_data/number_5': {
              $exists: false,
            },
          },
        ],
      },
      {
        $not: [
          {
            'device/custom_data/number_5': {
              $exists: 5,
            },
          },
        ],
      },
      {
        $not: [
          {
            'device/custom_data/number_5': {
              $exists: null,
            },
          },
        ],
      },
      {
        $not: [
          {
            'device/custom_data/key_with_null_value': {
              $exists: true,
            },
          },
        ],
      },
      {
        $not: [
          {
            'device/custom_data/non_existent_key': {
              $exists: true,
            },
          },
        ],
      },
      {
        'device/custom_data/non_existent_key': {
          $exists: false,
        },
      },
      {
        'device/custom_data/empty_string': {
          $exists: false,
        },
      },
    ],
  };
  expect(logicEngine.evaluateCriteria(criteria)).toBe(true);
});

test('E2E: Operator Less Than', () => {
  const logicEngine = setup(true);
  const criteria = {
    $and: [
      {
        'device/custom_data/number_5': {
          $lt: 10,
        },
      },
      {
        $not: [
          {
            'device/custom_data/number_5': {
              $lt: 5,
            },
          },
        ],
      },
      {
        $not: [
          {
            'device/custom_data/number_5': {
              $lt: 0,
            },
          },
        ],
      },
      {
        $not: [
          {
            'device/custom_data/number_5': {
              $lt: -5,
            },
          },
        ],
      },
      {
        $not: [
          {
            'device/custom_data/number_5': {
              $lt: null,
            },
          },
        ],
      },
      {
        $not: [
          {
            'device/custom_data/number_5': {
              $lt: 'string',
            },
          },
        ],
      },
      {
        $not: [
          {
            'device/custom_data/number_5': {
              $lt: true,
            },
          },
        ],
      },
      {
        $not: [
          {
            'device/custom_data/number_5': {
              $lt: {
                _type: 'datetime',
                sec: 100000,
              },
            },
          },
        ],
      },
      {
        $not: [
          {
            'device/custom_data/key_with_null_value': {
              $lt: 0,
            },
          },
        ],
      },
      {
        $not: [
          {
            'device/custom_data/non_existent_key': {
              $lt: 0,
            },
          },
        ],
      },
    ],
  };
  expect(logicEngine.evaluateCriteria(criteria)).toBe(true);
});

test('E2E: Operator Less Than Or Equal', () => {
  const logicEngine = setup(true);
  const criteria = {
    $and: [
      {
        'device/custom_data/number_5': {
          $lte: 6,
        },
      },
      {
        'device/custom_data/number_5': {
          $lte: 7,
        },
      },
      {
        'device/custom_data/number_5': {
          $lte: 5,
        },
      },
      {
        $not: [
          {
            'device/custom_data/number_5': {
              $lte: 4,
            },
          },
        ],
      },
      {
        $not: [
          {
            'device/custom_data/number_5': {
              $lte: 3,
            },
          },
        ],
      },
      {
        $not: [
          {
            'device/custom_data/number_5': {
              $lte: null,
            },
          },
        ],
      },
      {
        $not: [
          {
            'device/custom_data/number_5': {
              $lte: 'string',
            },
          },
        ],
      },
      {
        $not: [
          {
            'device/custom_data/number_5': {
              $lte: true,
            },
          },
        ],
      },
      {
        $not: [
          {
            'device/custom_data/number_5': {
              $lte: {
                _type: 'datetime',
                sec: 100000,
              },
            },
          },
        ],
      },
      {
        $not: [
          {
            'device/custom_data/key_with_null_value': {
              $lte: 0,
            },
          },
        ],
      },
      {
        $not: [
          {
            'device/custom_data/non_existent_key': {
              $lte: 0,
            },
          },
        ],
      },
    ],
  };
  expect(logicEngine.evaluateCriteria(criteria)).toBe(true);
});

test('E2E: Operator Greater Than', () => {
  const logicEngine = setup(true);
  const criteria = {
    $and: [
      {
        'device/custom_data/number_5': {
          $gt: -5,
        },
      },
      {
        'device/custom_data/number_5': {
          $gt: 0,
        },
      },
      {
        $not: [
          {
            'device/custom_data/number_5': {
              $gt: 5,
            },
          },
        ],
      },
      {
        $not: [
          {
            'device/custom_data/number_5': {
              $gt: 6,
            },
          },
        ],
      },
      {
        $not: [
          {
            'device/custom_data/number_5': {
              $gt: 10,
            },
          },
        ],
      },
      {
        $not: [
          {
            'device/custom_data/number_5': {
              $gt: null,
            },
          },
        ],
      },
      {
        $not: [
          {
            'device/custom_data/number_5': {
              $gt: 'string',
            },
          },
        ],
      },
      {
        $not: [
          {
            'device/custom_data/number_5': {
              $gt: true,
            },
          },
        ],
      },
      {
        $not: [
          {
            'device/custom_data/number_5': {
              $gt: {
                _type: 'datetime',
                sec: 100000,
              },
            },
          },
        ],
      },
      {
        $not: [
          {
            'device/custom_data/key_with_null_value': {
              $gt: 0,
            },
          },
        ],
      },
      {
        $not: [
          {
            'device/custom_data/non_existent_key': {
              $gt: 0,
            },
          },
        ],
      },
    ],
  };
  expect(logicEngine.evaluateCriteria(criteria)).toBe(true);
});

test('E2E: Operator Greater Than Or Equal', () => {
  const logicEngine = setup(true);
  const criteria = {
    $and: [
      {
        'device/custom_data/number_5': {
          $gte: -5,
        },
      },
      {
        'device/custom_data/number_5': {
          $gte: 0,
        },
      },
      {
        'device/custom_data/number_5': {
          $gte: 5,
        },
      },
      {
        $not: [
          {
            'device/custom_data/number_5': {
              $gte: 6,
            },
          },
        ],
      },
      {
        $not: [
          {
            'device/custom_data/number_5': {
              $gte: 10,
            },
          },
        ],
      },
      {
        $not: [
          {
            'device/custom_data/number_5': {
              $gte: null,
            },
          },
        ],
      },
      {
        $not: [
          {
            'device/custom_data/number_5': {
              $gte: 'string',
            },
          },
        ],
      },
      {
        $not: [
          {
            'device/custom_data/number_5': {
              $gte: true,
            },
          },
        ],
      },
      {
        $not: [
          {
            'device/custom_data/number_5': {
              $gte: {
                _type: 'datetime',
                sec: 100000,
              },
            },
          },
        ],
      },
      {
        $not: [
          {
            'device/custom_data/key_with_null_value': {
              $gte: 0,
            },
          },
        ],
      },
      {
        $not: [
          {
            'device/custom_data/non_existent_key': {
              $gte: 0,
            },
          },
        ],
      },
    ],
  };
  expect(logicEngine.evaluateCriteria(criteria)).toBe(true);
});

test('E2E: Operator Contains', () => {
  const logicEngine = setup(true);
  const criteria = {
    $and: [
      {
        'device/custom_data/string_qwerty': {
          $contains: 'qwert',
        },
      },
      {
        'device/custom_data/string_qwerty': {
          $contains: 'QWERT',
        },
      },
      {
        'device/custom_data/string_qwerty': {
          $contains: 'wert',
        },
      },
      {
        'device/custom_data/string_qwerty': {
          $contains: 'WERT',
        },
      },
      {
        'device/custom_data/string_qwerty': {
          $contains: 'werty',
        },
      },
      {
        'device/custom_data/string_qwerty': {
          $contains: 'WERTY',
        },
      },
      {
        'device/custom_data/string_qwerty': {
          $contains: 'qwerty',
        },
      },
      {
        'device/custom_data/string_qwerty': {
          $contains: 'QWERTY',
        },
      },
      {
        $not: [
          {
            'device/custom_data/string_qwerty': {
              $contains: 'foo',
            },
          },
        ],
      },
      {
        $not: [
          {
            'device/custom_data/string_qwerty': {
              $contains: null,
            },
          },
        ],
      },
      {
        $not: [
          {
            'device/custom_data/string_qwerty': {
              $contains: 5,
            },
          },
        ],
      },
      {
        $not: [
          {
            'device/custom_data/string_qwerty': {
              $contains: {
                _type: 'version',
                version: '1.0.0',
              },
            },
          },
        ],
      },
      {
        $not: [
          {
            'device/custom_data/number_5': {
              $contains: 'five',
            },
          },
        ],
      },
      {
        $not: [
          {
            'device/custom_data/number_5': {
              $contains: 5,
            },
          },
        ],
      },
      {
        $not: [
          {
            'device/custom_data/key_with_null_value': {
              $contains: null,
            },
          },
        ],
      },
      {
        $not: [
          {
            'device/custom_data/key_with_null_value': {
              $contains: '',
            },
          },
        ],
      },
      {
        $not: [
          {
            'device/custom_data/key_with_null_value': {
              $contains: 5,
            },
          },
        ],
      },
      {
        $not: [
          {
            'device/custom_data/non_existent_key': {
              $contains: 5,
            },
          },
        ],
      },
      {
        $not: [
          {
            'device/custom_data/non_existent_key': {
              $contains: '',
            },
          },
        ],
      },
    ],
  };
  expect(logicEngine.evaluateCriteria(criteria)).toBe(true);
});

test('E2E: Operator Starts With', () => {
  const logicEngine = setup(true);
  const criteria = {
    $and: [
      {
        'device/custom_data/string_qwerty': {
          $starts_with: 'qwert',
        },
      },
      {
        'device/custom_data/string_qwerty': {
          $starts_with: 'QWERT',
        },
      },
      {
        'device/custom_data/string_qwerty': {
          $starts_with: 'qwerty',
        },
      },
      {
        'device/custom_data/string_qwerty': {
          $starts_with: 'QWERTY',
        },
      },
      {
        $not: [
          {
            'device/custom_data/string_qwerty': {
              $starts_with: 'werty',
            },
          },
        ],
      },
      {
        $not: [
          {
            'device/custom_data/string_qwerty': {
              $starts_with: 'WERTY',
            },
          },
        ],
      },
      {
        $not: [
          {
            'device/custom_data/string_qwerty': {
              $starts_with: 'foo',
            },
          },
        ],
      },
      {
        $not: [
          {
            'device/custom_data/string_qwerty': {
              $starts_with: null,
            },
          },
        ],
      },
      {
        $not: [
          {
            'device/custom_data/string_qwerty': {
              $starts_with: 5,
            },
          },
        ],
      },
      {
        $not: [
          {
            'device/custom_data/string_qwerty': {
              $starts_with: {
                _type: 'version',
                version: '1.0.0',
              },
            },
          },
        ],
      },
      {
        $not: [
          {
            'device/custom_data/number_5': {
              $starts_with: 'five',
            },
          },
        ],
      },
      {
        $not: [
          {
            'device/custom_data/number_5': {
              $starts_with: 5,
            },
          },
        ],
      },
      {
        $not: [
          {
            'device/custom_data/key_with_null_value': {
              $starts_with: null,
            },
          },
        ],
      },
      {
        $not: [
          {
            'device/custom_data/key_with_null_value': {
              $starts_with: '',
            },
          },
        ],
      },
      {
        $not: [
          {
            'device/custom_data/key_with_null_value': {
              $starts_with: 5,
            },
          },
        ],
      },
      {
        $not: [
          {
            'device/custom_data/non_existent_key': {
              $starts_with: 5,
            },
          },
        ],
      },
      {
        $not: [
          {
            'device/custom_data/non_existent_key': {
              $starts_with: '',
            },
          },
        ],
      },
    ],
  };
  expect(logicEngine.evaluateCriteria(criteria)).toBe(true);
});

test('E2E: Operator Ends With', () => {
  const logicEngine = setup(true);
  const criteria = {
    $and: [
      {
        'device/custom_data/string_qwerty': {
          $ends_with: 'werty',
        },
      },
      {
        'device/custom_data/string_qwerty': {
          $ends_with: 'WERTY',
        },
      },
      {
        'device/custom_data/string_qwerty': {
          $ends_with: 'qwerty',
        },
      },
      {
        'device/custom_data/string_qwerty': {
          $ends_with: 'QWERTY',
        },
      },
      {
        $not: [
          {
            'device/custom_data/string_qwerty': {
              $ends_with: 'qwert',
            },
          },
        ],
      },
      {
        $not: [
          {
            'device/custom_data/string_qwerty': {
              $ends_with: 'QWERT',
            },
          },
        ],
      },
      {
        $not: [
          {
            'device/custom_data/string_qwerty': {
              $ends_with: 'foo',
            },
          },
        ],
      },
      {
        $not: [
          {
            'device/custom_data/string_qwerty': {
              $ends_with: null,
            },
          },
        ],
      },
      {
        $not: [
          {
            'device/custom_data/string_qwerty': {
              $ends_with: 5,
            },
          },
        ],
      },
      {
        $not: [
          {
            'device/custom_data/string_qwerty': {
              $ends_with: {
                _type: 'version',
                version: '1.0.0',
              },
            },
          },
        ],
      },
      {
        $not: [
          {
            'device/custom_data/number_5': {
              $ends_with: 'five',
            },
          },
        ],
      },
      {
        $not: [
          {
            'device/custom_data/number_5': {
              $ends_with: 5,
            },
          },
        ],
      },
      {
        $not: [
          {
            'device/custom_data/key_with_null_value': {
              $ends_with: null,
            },
          },
        ],
      },
      {
        $not: [
          {
            'device/custom_data/key_with_null_value': {
              $ends_with: '',
            },
          },
        ],
      },
      {
        $not: [
          {
            'device/custom_data/key_with_null_value': {
              $ends_with: 5,
            },
          },
        ],
      },
      {
        $not: [
          {
            'device/custom_data/non_existent_key': {
              $ends_with: 5,
            },
          },
        ],
      },
      {
        $not: [
          {
            'device/custom_data/non_existent_key': {
              $ends_with: '',
            },
          },
        ],
      },
    ],
  };
  expect(logicEngine.evaluateCriteria(criteria)).toBe(true);
});

test('E2E: Operator Before', () => {
  const logicEngine = setup(true);
  const criteria = {
    $and: [
      {
        'time_at_install/total': {
          $before: 1,
        },
      },
      {
        $not: [
          {
            'time_at_install/total': {
              $before: -1,
            },
          },
        ],
      },
      {
        $not: [
          {
            'time_at_install/total': {
              $before: null,
            },
          },
        ],
      },
      {
        $not: [
          {
            'time_at_install/total': {
              $before: '',
            },
          },
        ],
      },
      {
        $not: [
          {
            'time_at_install/total': {
              $before: {
                _type: 'version',
                version: '5.0.0',
              },
            },
          },
        ],
      },
      {
        $not: [
          {
            'device/custom_data/key_with_null_value': {
              $before: null,
            },
          },
        ],
      },
      {
        $not: [
          {
            'device/custom_data/key_with_null_value': {
              $before: '',
            },
          },
        ],
      },
      {
        $not: [
          {
            'device/custom_data/key_with_null_value': {
              $before: 5,
            },
          },
        ],
      },
      {
        $not: [
          {
            'device/custom_data/non_existent_key': {
              $before: 5,
            },
          },
        ],
      },
      {
        $not: [
          {
            'device/custom_data/non_existent_key': {
              $before: '',
            },
          },
        ],
      },
    ],
  };
  expect(logicEngine.evaluateCriteria(criteria)).toBe(true);
});

test('E2E: Operator After', () => {
  const logicEngine = setup(true);
  const criteria = {
    $and: [
      {
        'time_at_install/total': {
          $after: -1,
        },
      },
      {
        $not: [
          {
            'time_at_install/total': {
              $after: 1,
            },
          },
        ],
      },
      {
        $not: [
          {
            'time_at_install/total': {
              $after: null,
            },
          },
        ],
      },
      {
        $not: [
          {
            'time_at_install/total': {
              $after: '',
            },
          },
        ],
      },
      {
        $not: [
          {
            'time_at_install/total': {
              $after: {
                _type: 'version',
                version: '5.0.0',
              },
            },
          },
        ],
      },
      {
        $not: [
          {
            'device/custom_data/key_with_null_value': {
              $after: null,
            },
          },
        ],
      },
      {
        $not: [
          {
            'device/custom_data/key_with_null_value': {
              $after: '',
            },
          },
        ],
      },
      {
        $not: [
          {
            'device/custom_data/key_with_null_value': {
              $after: 5,
            },
          },
        ],
      },
      {
        $not: [
          {
            'device/custom_data/non_existent_key': {
              $after: 5,
            },
          },
        ],
      },
      {
        $not: [
          {
            'device/custom_data/non_existent_key': {
              $after: '',
            },
          },
        ],
      },
    ],
  };
  expect(logicEngine.evaluateCriteria(criteria)).toBe(true);
});

test('E2E: Corner Cases That Should Be False', () => {
  const logicEngine = setup(true);
  const criteria = {
    $not: [
      {
        $or: [
          {
            'person/custom_data/foo': {
              $exists: null,
            },
          },
          {
            'person/custom_data/key_with_null_value': {
              $exists: true,
            },
          },
        ],
      },
    ],
  };
  expect(logicEngine.evaluateCriteria(criteria)).toBe(true);
});

test('E2E: Corner Cases That Should Be True', () => {
  const logicEngine = setup(true);
  const criteria = {
    $and: [
      {
        'application/version': {},
      },
      {
        'person/custom_data/key_with_null_value': {
          $exists: false,
        },
      },
    ],
  };
  expect(logicEngine.evaluateCriteria(criteria)).toBe(true);
});

test('E2E: Whitespace Trimming', () => {
  const logicEngine = setup(true);
  const criteria = {
    $and: [
      {
        'device/custom_data/string_qwerty': {
          $exists: true,
        },
      },
      {
        ' device/custom_data/string_qwerty': {
          $exists: true,
        },
      },
      {
        'device/custom_data/string_qwerty ': {
          $exists: true,
        },
      },
      {
        'device /custom_data/string_qwerty': {
          $exists: true,
        },
      },
      {
        'device/ custom_data/string_qwerty': {
          $exists: true,
        },
      },
      {
        'device/custom_data /string_qwerty': {
          $exists: true,
        },
      },
      {
        'device/custom_data/ string_qwerty': {
          $exists: true,
        },
      },
      {
        'device/custom_data/string_qwerty ': {
          $exists: true,
        },
      },
      {
        'device/custom_data/string with spaces': {
          $exists: true,
        },
      },
      {
        'device/custom_data/ string with spaces': {
          $exists: true,
        },
      },
      {
        'device/custom_data/string with spaces ': {
          $exists: true,
        },
      },
      {
        'device/custom_data/string with spaces': {
          $eq: 'string with spaces',
        },
      },
      {
        'device/custom_data/string with spaces': {
          $eq: ' string with spaces ',
        },
      },
      {
        'device/custom_data/string with spaces': {
          $contains: ' with ',
        },
      },
      {
        'device/custom_data/string with spaces': {
          $starts_with: ' string',
        },
      },
      {
        'device/custom_data/string with spaces': {
          $starts_with: 'string ',
        },
      },
      {
        'device/custom_data/string with spaces': {
          $ends_with: ' spaces',
        },
      },
      {
        'device/custom_data/string with spaces': {
          $ends_with: 'spaces ',
        },
      },
    ],
  };
  expect(logicEngine.evaluateCriteria(criteria)).toBe(true);
});

test('E2E: Default Values', () => {
  const logicEngine = setup(true);
  const criteria = {
    $and: [
      {
        current_time: {
          $before: 1,
        },
      },
      {
        'is_update/version': false,
      },
    ],
  };
  expect(logicEngine.evaluateCriteria(criteria)).toBe(true);
});

test('E2E: Random Sampling Percent - Known Keys', () => {
  const logicEngine = setup(true);
  let criteria = {
    $and: [
      {
        'random/🔑/percent': {
          $lte: 33.3,
        },
      },
      {
        'random/③/percent': {
          $lte: 33.3,
        },
      },
      {
        'random/🌗/percent': {
          $lte: 50.0,
        },
      },
      {
        'random/⑨/percent': {
          $lte: 100,
        },
      },
    ],
  };
  expect(logicEngine.evaluateCriteria(criteria)).toBe(true);

  criteria = {
    $and: [
      {
        'random/⑨/percent': {
          $lte: 99.8,
        },
      },
    ],
  };
  expect(logicEngine.evaluateCriteria(criteria)).toBe(false);
});

test('E2E: Random Sampling Percent - Unknown Keys', () => {
  const logicEngine = setup(true);
  jest.spyOn(Math, 'random').mockReturnValue(0.1);
  let criteria = {
    $and: [
      {
        'random/😭/percent': {
          $lte: 33.3,
        },
      },
      {
        'random/percent': {
          $lte: 33.3,
        },
      },
    ],
  };
  expect(logicEngine.evaluateCriteria(criteria)).toBe(true);
  expect(logicEngine.random).toEqual({
    '③': 33.3,
    '⑨': 99.9,
    '🌗': 50,
    '🔑': 0.1,
    '😭': 10,
  });

  criteria = {
    $and: [
      {
        'random/😵/percent': {
          $lte: 1,
        },
      },
    ],
  };
  expect(logicEngine.evaluateCriteria(criteria)).toBe(false);
  expect(logicEngine.random).toEqual({
    '③': 33.3,
    '⑨': 99.9,
    '🌗': 50,
    '🔑': 0.1,
    '😭': 10,
    '😵': 10,
  });
  Math.random.mockRestore();
});

test('E2E: Unknown Rules', () => {
  const logicEngine = setup(true);
  const criteria = {
    $and: [
      {
        'wacky/🔑/tacky': {
          $lt: 33.3,
        },
      },
    ],
  };
  expect(logicEngine.evaluateCriteria(criteria)).toBe(false);
});

test('E2E: Large Criteria', () => {
  const logicEngine = setup(true);
  expect(logicEngine.evaluateCriteria(zipcodeCriteria)).toBe(true);

  logicEngine.person.custom_data.zipcode = 'MISSING';
  expect(logicEngine.evaluateCriteria(zipcodeCriteria)).toBe(false);
});
