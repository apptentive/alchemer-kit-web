import ApptentiveApi from '../../../src/api.ts';
import ApptentiveBase from '../../../src/base.ts';
import ApptentiveSurveyList from '../../../src/interactions/survey-list.ts';

import removeErrors from '../../../src/interactions/helpers/removeErrors.ts';
import browserEvents from '../../../src/constants/browser-events.ts';
import focusOtherInput from '../../../src/interactions/helpers/focusOtherInput.ts';
import scrollToError from '../../../src/interactions/helpers/scrollToError.ts';
import selectPreviousInput from '../../../src/interactions/helpers/selectPreviousInput.ts';

import { _apiToken, _appId, _domNode, _domNodeId, _host, _interactionOptions } from '../../mocks/data/shared-constants';
import { domFireEvent, domSetChecked, domSetValue, domSelectors } from '../../utils/dom.js';
import {
  multichoiceQuestionConfig,
  multiselectQuestionConfig,
  singlelineQuestionConfig,
  multilineQuestionConfig,
  npsQuestionConfig,
} from '../../mocks/data/survey-questions.ts';

// Configurations
// =============================================================================
const surveyConfig = {
  id: 'survey-id-1',
  configuration: {
    name: 'test survey',
    title: 'Test Survey',
    render_as: 'list',
    question_sets: [
      {
        id: 'question_1',
        invokes: [
          {
            interaction_id: 'question_2',
            criteria: {},
          },
        ],
        questions: [multichoiceQuestionConfig],
      },
      {
        id: 'question_2',
        invokes: [
          {
            interaction_id: 'question_3',
            criteria: {},
          },
        ],
        questions: [multiselectQuestionConfig],
      },
      {
        id: 'question_3',
        invokes: [
          {
            interaction_id: 'question_4',
            criteria: {},
          },
        ],
        questions: [singlelineQuestionConfig],
      },
      {
        id: 'question_4',
        invokes: [
          {
            interaction_id: 'question_5',
            criteria: {},
          },
        ],
        questions: [multilineQuestionConfig],
      },
      {
        id: 'question_5',
        invokes: [
          {
            interaction_id: 'question_6',
            criteria: {},
          },
        ],
        questions: [npsQuestionConfig],
      },
      {
        id: 'question_6',
        invokes: [],
        questions: [
          {
            type: 'bogus',
          },
        ],
      },
    ],
    show_success_message: true,
    success_message: 'Thank you!',
    contact_url: 'Contact Us!',
    contact_url_text: 'http://www.apptentive.com/',
  },
};

Object.freeze(surveyConfig);

const manifest = {
  interactions: [
    surveyConfig,
    multichoiceQuestionConfig,
    multiselectQuestionConfig,
    singlelineQuestionConfig,
    multilineQuestionConfig,
    npsQuestionConfig,
  ],
  targets: {
    'com.apptentive#app#show_message_center': [
      {
        interaction_id: '55c10dd573faf92eb3000140',
        criteria: {},
      },
    ],
  },
};

Object.freeze(manifest);

const setup = (build = true, config = surveyConfig, debug = false, settings = {}) => {
  const div = document.createElement('div');
  div.id = _domNodeId;
  div.innerHTML = '';

  document.body.append(div);

  if (build) {
    const apptentiveSdk = new ApptentiveBase({
      id: _appId,
      debug,
      host: _host,
      token: _apiToken,
      settings,
      ...manifest,
    });
    apptentiveSdk.conversation.id = 'conversation-id';

    const apptentiveSurvey = new ApptentiveSurveyList(config, apptentiveSdk, _interactionOptions);
    apptentiveSurvey.render();

    return apptentiveSurvey;
  }

  return null;
};

afterEach(() => {
  document.body.innerHTML = '';
});

test('#constructor: has no side effect if no config is passed', () => {
  setup(false);

  const apptentiveSDK = new ApptentiveBase({ id: _appId, host: _host, token: _apiToken, ...manifest });
  const apptentiveSurvey = new ApptentiveSurveyList(undefined, apptentiveSDK);
  apptentiveSurvey.render();

  expect(document.querySelector(_domNode).innerHTML).toBe('');
});

test('#render: should render a DOM element on the page', () => {
  setup();
  expect(document.querySelector(_domNode).innerHTML).toMatchSnapshot();
});

test('#render: should render a DOM element on the page without branding', () => {
  setup(true, surveyConfig, false, { hide_branding: true, styles: {} });
  expect(document.querySelector(_domNode).innerHTML).toMatchSnapshot();
});

test('#render: can be built as a static method', () => {
  setup(false);
  const apptentiveSDK = new ApptentiveBase({ id: _appId, host: _host, token: _apiToken, ...manifest });
  const noName = {
    ...surveyConfig,
    configuration: {
      ...surveyConfig.configuration,
      name: '',
    },
  };
  ApptentiveSurveyList.display(noName, apptentiveSDK, _interactionOptions);
  expect(document.querySelector(_domNode).innerHTML).toMatchSnapshot();
});

test('#render: properly catches error if no parameters are passed', () => {
  expect(() => ApptentiveSurveyList.display()).not.toThrow();
});

test('#render: renders only once', () => {
  const apptentiveSurvey = setup();
  const surveys = document.querySelectorAll('apptentive-survey');
  apptentiveSurvey.render();
  apptentiveSurvey.render();
  expect(surveys.length).toBe(1);
});

test('#apiCall: when the survey is submitted, triggers a `submitted` event', (done) => {
  setup();
  const submitSurveySpy = jest
    .spyOn(ApptentiveApi.prototype, 'submitSurvey')
    .mockImplementation(() => Promise.resolve({}));

  const eventListener = () => {
    document.removeEventListener(browserEvents.APPTENTIVE_SURVEY_SUBMIT, eventListener);
    expect(submitSurveySpy.mock.calls[0][1]).toBe('survey-id-1');
    submitSurveySpy.mockRestore();

    done();
  };

  document.addEventListener(browserEvents.APPTENTIVE_SURVEY_SUBMIT, eventListener);

  domSetChecked(
    `input[name="${multichoiceQuestionConfig.id}"][value="${multichoiceQuestionConfig.answer_choices[0].id}"]`
  );
  domSetChecked(
    `input[name="${multiselectQuestionConfig.id}"][value="${multiselectQuestionConfig.answer_choices[1].id}"]`
  );
  domSetChecked(
    `input[name="${multiselectQuestionConfig.id}"][value="${multiselectQuestionConfig.answer_choices[2].id}"]`
  );
  domSetValue(`input[name="${singlelineQuestionConfig.id}"]`, 'nope');
  domSetValue(`textarea[name="${multilineQuestionConfig.id}"]`, 'I said, "nope!"');
  domSetChecked(`input[id="choice-input-${npsQuestionConfig.id}-5"]`);

  document.querySelector(domSelectors.apptentiveSurveyButton).click();
});

test('#apiCall: when the survey is submitted, attaches serialized survey answers in the proper shape', () => {
  const apptentiveSurvey = setup();
  const submitSurveySpy = jest
    .spyOn(ApptentiveApi.prototype, 'submitSurvey')
    .mockImplementation(() => Promise.resolve({}));

  domSetChecked(
    `input[name="${multichoiceQuestionConfig.id}"][value="${multichoiceQuestionConfig.answer_choices[3].id}"]`
  );
  domSetValue(`input[name="${multichoiceQuestionConfig.id}-other"]`, 'something');
  domSetChecked(
    `input[name="${multiselectQuestionConfig.id}"][value="${multiselectQuestionConfig.answer_choices[1].id}"]`
  );
  domSetChecked(
    `input[name="${multiselectQuestionConfig.id}"][value="${multiselectQuestionConfig.answer_choices[4].id}"]`
  );
  domSetValue(`input[name="${multiselectQuestionConfig.id}-other"]`, 'something');
  domSetValue(`input[name="${singlelineQuestionConfig.id}"]`, 'nope');
  domSetValue(`textarea[name="${multilineQuestionConfig.id}"]`, 'I said, "nope!"');
  domSetChecked(`input[id="choice-input-${npsQuestionConfig.id}-5"]`);

  domFireEvent(domSelectors.apptentiveSurveyButton);

  const expectedSerializedFormAnswers = {
    [multichoiceQuestionConfig.id]: {
      state: 'answered',
      value: [
        {
          id: multichoiceQuestionConfig.answer_choices[3].id,
          value: 'something',
        },
      ],
    },
    [multiselectQuestionConfig.id]: {
      state: 'answered',
      value: [
        {
          id: multiselectQuestionConfig.answer_choices[1].id,
        },
        {
          id: multiselectQuestionConfig.answer_choices[4].id,
          value: 'something',
        },
      ],
    },
    [singlelineQuestionConfig.id]: {
      state: 'answered',
      value: [
        {
          value: 'nope',
        },
      ],
    },
    [multilineQuestionConfig.id]: {
      state: 'answered',
      value: [
        {
          value: 'I said, "nope!"',
        },
      ],
    },
    [npsQuestionConfig.id]: {
      state: 'answered',
      value: [
        {
          value: 5,
        },
      ],
    },
  };
  expect(submitSurveySpy).toHaveBeenCalledTimes(1);
  expect(submitSurveySpy.mock.calls[0][0].json.response.answers).toEqual(expectedSerializedFormAnswers);
  expect(submitSurveySpy.mock.calls[0][0].json.response.nonce).not.toBe(undefined);
  expect(submitSurveySpy.mock.calls[0][0].json.response.client_created_at).not.toBe(undefined);
  expect(submitSurveySpy.mock.calls[0][0].json.response.client_created_at_utc_offset).not.toBe(undefined);
  expect(submitSurveySpy.mock.calls[0][0].json.session_id).toBe(apptentiveSurvey.sdk.session_id);

  submitSurveySpy.mockRestore();
});

test("#apiCall: when the survey is submitted, omits questions that weren't answered from the response", () => {
  const apptentiveSurvey = setup();
  const submitSurveySpy = jest
    .spyOn(ApptentiveApi.prototype, 'submitSurvey')
    .mockImplementation(() => Promise.resolve({}));

  domSetChecked(
    `input[name="${multichoiceQuestionConfig.id}"][value="${multichoiceQuestionConfig.answer_choices[0].id}"]`
  );
  domSetChecked(
    `input[name="${multiselectQuestionConfig.id}"][value="${multiselectQuestionConfig.answer_choices[1].id}"]`
  );
  domSetChecked(
    `input[name="${multiselectQuestionConfig.id}"][value="${multiselectQuestionConfig.answer_choices[4].id}"]`
  );
  domSetValue(`input[name="${multiselectQuestionConfig.id}-other"]`, 'something');
  domSetChecked(`input[id="choice-input-${npsQuestionConfig.id}-5"]`);

  domFireEvent(domSelectors.apptentiveSurveyButton);

  const expectedSerializedFormAnswers = {
    [multichoiceQuestionConfig.id]: {
      state: 'answered',
      value: [
        {
          id: multichoiceQuestionConfig.answer_choices[0].id,
        },
      ],
    },
    [multiselectQuestionConfig.id]: {
      state: 'answered',
      value: [
        {
          id: multiselectQuestionConfig.answer_choices[1].id,
        },
        {
          id: multiselectQuestionConfig.answer_choices[4].id,
          value: 'something',
        },
      ],
    },
    [npsQuestionConfig.id]: {
      state: 'answered',
      value: [
        {
          value: 5,
        },
      ],
    },
    [multilineQuestionConfig.id]: {
      state: 'empty',
    },

    [singlelineQuestionConfig.id]: {
      state: 'empty',
    },
  };

  expect(submitSurveySpy).toHaveBeenCalledTimes(1);
  expect(submitSurveySpy.mock.calls[0][0].json.response.answers).toEqual(expectedSerializedFormAnswers);
  expect(submitSurveySpy.mock.calls[0][0].json.response.nonce).not.toBe(undefined);
  expect(submitSurveySpy.mock.calls[0][0].json.response.client_created_at).not.toBe(undefined);
  expect(submitSurveySpy.mock.calls[0][0].json.response.client_created_at_utc_offset).not.toBe(undefined);
  expect(submitSurveySpy.mock.calls[0][0].json.session_id).toBe(apptentiveSurvey.sdk.session_id);

  submitSurveySpy.mockRestore();
});

test('#apiCall: when the survey is submitted, displays a thank you message with custom text', () => {
  setup();
  const submitSurveySpy = jest
    .spyOn(ApptentiveApi.prototype, 'submitSurvey')
    .mockImplementation(() => Promise.resolve({}));

  domSetChecked(
    `input[name="${multichoiceQuestionConfig.id}"][value="${multichoiceQuestionConfig.answer_choices[0].id}"]`
  );
  domSetChecked(
    `input[name="${multiselectQuestionConfig.id}"][value="${multiselectQuestionConfig.answer_choices[1].id}"]`
  );
  domSetChecked(
    `input[name="${multiselectQuestionConfig.id}"][value="${multiselectQuestionConfig.answer_choices[3].id}"]`
  );
  domSetValue(`input[name="${singlelineQuestionConfig.id}"]`, 'nope');
  domSetValue(`textarea[name="${multilineQuestionConfig.id}"]`, 'I said, "nope!"');
  domSetChecked(`input[id="choice-input-${npsQuestionConfig.id}-5"]`);

  domFireEvent(domSelectors.apptentiveSurveyButton);

  const thankYouElement = document.querySelector('apptentive-survey-thank-you');
  const thankYouText = document.querySelector('apptentive-survey-thank-you .apptentive-message__content');

  expect(thankYouElement.style.display).toBe('none');
  expect(thankYouText.innerHTML).toBe('Thank you!');

  submitSurveySpy.mockRestore();
});

test("#apiCall: when the survey is submitted, when a question is invalid, doesn't submit an apiCall", () => {
  setup();
  const submitSurveySpy = jest.spyOn(ApptentiveApi.prototype, 'submitSurvey').mockImplementation();

  domFireEvent(domSelectors.apptentiveSurveyButton);

  expect(submitSurveySpy).toHaveBeenCalledTimes(0);
  submitSurveySpy.mockRestore();
});

test('#apiCall: when survey is created prior to a conversation, generates the correct endpoint on submit', () => {
  setup(false);

  const apptentiveSdk = new ApptentiveBase({
    id: _appId,
    debug: false,
    host: _host,
    token: _apiToken,
    settings: {},
    ...manifest,
  });
  const apptentiveSurvey = new ApptentiveSurveyList(surveyConfig, apptentiveSdk, _interactionOptions);
  apptentiveSurvey.render();

  apptentiveSdk.ajax.conversation = { id: 'conversation-id', token: '424f81fe-af8c-550b-aac7-6427612ab201' };

  // Not ideal, but I want to validate that the request is actually made instead of mocking out the api function
  const executeRequestSpy = jest
    .spyOn(ApptentiveApi.prototype, '_executeRequest')
    .mockImplementation(() => Promise.resolve({}));

  domSetChecked(
    `input[name="${multichoiceQuestionConfig.id}"][value="${multichoiceQuestionConfig.answer_choices[0].id}"]`
  );
  domSetChecked(
    `input[name="${multiselectQuestionConfig.id}"][value="${multiselectQuestionConfig.answer_choices[1].id}"]`
  );
  domSetChecked(
    `input[name="${multiselectQuestionConfig.id}"][value="${multiselectQuestionConfig.answer_choices[3].id}"]`
  );
  domSetValue(`input[name="${singlelineQuestionConfig.id}"]`, 'nope');
  domSetValue(`textarea[name="${multilineQuestionConfig.id}"]`, 'I said, "nope!"');
  domSetChecked(`input[id="choice-input-${npsQuestionConfig.id}-5"]`);

  domFireEvent(domSelectors.apptentiveSurveyButton);

  expect(executeRequestSpy).toHaveBeenCalledTimes(1);
  expect(executeRequestSpy.mock.calls[0][0]).toBe('conversations/conversation-id/surveys/survey-id-1/responses');

  executeRequestSpy.mockRestore();
});

test('#submitSurvey: when a survey is submitted without an interaction id, prevent an api call being made', () => {
  const apptentiveSurvey = setup(true, { ...surveyConfig });
  const submitSurveySpy = jest.spyOn(ApptentiveApi.prototype, 'submitSurvey').mockImplementation();

  apptentiveSurvey.interaction.id = '';

  domSetChecked(
    `input[name="${multichoiceQuestionConfig.id}"][value="${multichoiceQuestionConfig.answer_choices[0].id}"]`
  );
  domSetChecked(
    `input[name="${multiselectQuestionConfig.id}"][value="${multiselectQuestionConfig.answer_choices[1].id}"]`
  );
  domSetChecked(
    `input[name="${multiselectQuestionConfig.id}"][value="${multiselectQuestionConfig.answer_choices[2].id}"]`
  );
  domSetValue(`input[name="${singlelineQuestionConfig.id}"]`, 'nope');
  domSetValue(`textarea[name="${multilineQuestionConfig.id}"]`, 'I said, "nope!"');
  domSetChecked(`input[id="choice-input-${npsQuestionConfig.id}-5"]`);

  domFireEvent(domSelectors.apptentiveSurveyButton);

  expect(submitSurveySpy).not.toHaveBeenCalled();

  submitSurveySpy.mockRestore();
});

test('#surveySubmitted: with show_success_message being true should hide the survey questions', () => {
  const apptentiveSurvey = setup();
  apptentiveSurvey.interaction.configuration.show_success_message = true;
  apptentiveSurvey.surveySubmitted({});
  expect(apptentiveSurvey.surveyContainer.querySelector('form.apptentive-survey-questions').style.display).toBe('none');
});

test('#surveySubmitted: with show_success_message being true should show the thank you message', () => {
  const apptentiveSurvey = setup();
  apptentiveSurvey.interaction.configuration.show_success_message = true;
  apptentiveSurvey.surveySubmitted({});
  expect(apptentiveSurvey.surveyContainer.querySelector('apptentive-survey-thank-you').style.display).toBe('');
});

test('#surveySubmitted: with show_success_message being false should call dismiss', () => {
  const apptentiveSurvey = setup();
  apptentiveSurvey.interaction.configuration.show_success_message = false;
  const close = jest.spyOn(apptentiveSurvey, 'handleClose').mockImplementation();
  apptentiveSurvey.surveySubmitted({});
  expect(close).toHaveBeenCalledTimes(1);
  apptentiveSurvey.handleClose.mockRestore();
});

test('#surveySubmitted: should fire an event containing the answers', () => {
  setup(false);

  const apptentiveSdk = new ApptentiveBase({
    id: _appId,
    debug: false,
    host: _host,
    token: _apiToken,
    settings: {},
    ...manifest,
  });

  const apptentiveSurvey = new ApptentiveSurveyList(surveyConfig, apptentiveSdk, _interactionOptions);
  apptentiveSurvey.interaction.configuration.show_success_message = false;
  apptentiveSurvey.render();

  const createEventSpy = jest.spyOn(apptentiveSdk, 'engage').mockImplementation(() => true);

  const dismiss = jest.spyOn(apptentiveSurvey, 'dismiss').mockImplementation();
  const answers = {
    [multichoiceQuestionConfig.id]: {
      state: 'answered',
      value: [
        {
          id: multichoiceQuestionConfig.answer_choices[3].id,
          value: 'something',
        },
      ],
    },
    [multiselectQuestionConfig.id]: {
      state: 'answered',
      value: [
        {
          id: multiselectQuestionConfig.answer_choices[1].id,
        },
        {
          id: multiselectQuestionConfig.answer_choices[4].id,
          value: 'something',
        },
      ],
    },
    [singlelineQuestionConfig.id]: {
      state: 'answered',
      value: [
        {
          value: 'nope',
        },
      ],
    },
    [multilineQuestionConfig.id]: {
      state: 'answered',
      value: [
        {
          value: 'I said, "nope!"',
        },
      ],
    },
    [npsQuestionConfig.id]: {
      state: 'answered',
      value: [
        {
          value: 5,
        },
      ],
    },
  };

  const translatedAnswers = {
    [multichoiceQuestionConfig.id]: [
      {
        id: multichoiceQuestionConfig.answer_choices[3].id,
        value: 'something',
      },
    ],
    [multiselectQuestionConfig.id]: [
      {
        id: multiselectQuestionConfig.answer_choices[1].id,
      },
      {
        id: multiselectQuestionConfig.answer_choices[4].id,
        value: 'something',
      },
    ],
    [singlelineQuestionConfig.id]: [
      {
        value: 'nope',
      },
    ],
    [multilineQuestionConfig.id]: [
      {
        value: 'I said, "nope!"',
      },
    ],
    [npsQuestionConfig.id]: [
      {
        value: 5,
      },
    ],
  };

  apptentiveSurvey.surveySubmitted(answers);

  expect(createEventSpy).toHaveBeenCalledTimes(1);
  expect(createEventSpy.mock.calls[0][1]).toEqual({
    answers: translatedAnswers,
    id: 'survey-id-1',
    interaction_id: 'survey-id-1',
  });

  dismiss.mockRestore();
  createEventSpy.mockRestore();
});

test('#dismiss: should not throw an error', () => {
  const apptentiveSurvey = setup();
  expect(() => {
    apptentiveSurvey.dismiss();
  }).not.toThrow();
});

test('#dismiss: should remove the interaction from the DOM', () => {
  const apptentiveSurvey = setup();
  expect(document.querySelectorAll('apptentive-survey').length).toBe(1);
  apptentiveSurvey.dismiss();
  expect(document.querySelectorAll('apptentive-survey').length).toBe(0);
});

test('#dismiss: should engage cancel event', () => {
  const apptentiveSurvey = setup();
  const apiSpy = jest.spyOn(apptentiveSurvey.sdk, 'engage');

  apptentiveSurvey.dismiss('com.apptentive#Survey#cancel');
  expect(apiSpy.mock.calls[0][0]).toBe('com.apptentive#Survey#cancel');
});

test('#handleClose: should show/hide confirm block', () => {
  setup(true, { ...surveyConfig });

  domSetChecked(
    `input[name="${multichoiceQuestionConfig.id}"][value="${multichoiceQuestionConfig.answer_choices[0].id}"]`
  );

  domFireEvent('.apptentive-appbar__action--close');

  let confirmWrapper = document.querySelector('.apptentive-interaction__confirm-wrapper');

  const okBtn = confirmWrapper.childNodes[1];
  const cancelBtn = confirmWrapper.childNodes[2];

  expect(confirmWrapper.childElementCount).toEqual(3);
  expect(confirmWrapper.firstChild.textContent).toEqual('Progress will be lost. Would you like to exit?');
  expect(okBtn.textContent).toEqual('OK');
  expect(cancelBtn.textContent).toEqual('CANCEL');

  cancelBtn.click();
  confirmWrapper = document.querySelector('.apptentive-interaction__confirm-wrapper');
  expect(confirmWrapper.childElementCount).toEqual(0);
});

test('#handleClose: should engage cancel_partial event', () => {
  const apptentiveSurvey = setup(true, { ...surveyConfig });
  const apiSpy = jest.spyOn(apptentiveSurvey.sdk, 'engage');

  domSetChecked(
    `input[name="${multichoiceQuestionConfig.id}"][value="${multichoiceQuestionConfig.answer_choices[0].id}"]`
  );
  domSetChecked(
    `input[name="${multiselectQuestionConfig.id}"][value="${multiselectQuestionConfig.answer_choices[1].id}"]`
  );
  domSetChecked(
    `input[name="${multiselectQuestionConfig.id}"][value="${multiselectQuestionConfig.answer_choices[2].id}"]`
  );

  domFireEvent('.apptentive-appbar__action--close');

  document.querySelector('.apptentive-interaction__confirm-wrapper').childNodes[1].click();

  expect(apiSpy.mock.calls[0][0]).toBe('com.apptentive#Survey#cancel_partial');
});

test('#handleClose: should close confirm block on cross btn click', () => {
  const apptentiveSurvey = setup(true, { ...surveyConfig });
  const apiSpy = jest.spyOn(apptentiveSurvey.sdk, 'engage');

  domSetChecked(
    `input[name="${multichoiceQuestionConfig.id}"][value="${multichoiceQuestionConfig.answer_choices[0].id}"]`
  );
  domSetChecked(
    `input[name="${multiselectQuestionConfig.id}"][value="${multiselectQuestionConfig.answer_choices[1].id}"]`
  );
  domSetChecked(
    `input[name="${multiselectQuestionConfig.id}"][value="${multiselectQuestionConfig.answer_choices[2].id}"]`
  );

  const crossBtn = document.querySelector('.apptentive-appbar .apptentive-appbar__action--close');
  crossBtn.click();
  crossBtn.click();

  expect(apiSpy.mock.calls[0][0]).toBe('com.apptentive#Survey#cancel_partial');
});

test('#scrollToError: should not throw an error without invalid questions', () => {
  setup();
  expect(() => {
    scrollToError();
  }).not.toThrow();
});

test('#scrollToError: should not throw an error with invalid questions', () => {
  setup();
  document.querySelector('.apptentive-survey-question').classList.add('invalid');
  expect(() => {
    scrollToError();
  }).not.toThrow();
});

test('#focusOtherInput: should not throw an error without an event', () => {
  setup();
  expect(() => {
    focusOtherInput();
  }).not.toThrow();
});

test('#focusOtherInput: should not throw an error without an event target', () => {
  setup();
  const event = {
    target: null,
  };
  expect(() => {
    focusOtherInput(event);
  }).not.toThrow();
});

test('#focusOtherInput: should not throw an error without an event target nextSibling', () => {
  setup();
  const element = document.querySelector('#choice-input-multichoice-answer-other');
  element.nextSibling.remove();
  const event = {
    target: element,
  };
  expect(() => {
    focusOtherInput(event);
  }).not.toThrow();
});

test('#focusOtherInput: should not throw an error with valid targets', () => {
  setup();
  const element = document.querySelector('#choice-input-multichoice-answer-other');
  element.checked = true;
  const event = {
    target: element,
  };
  expect(() => {
    focusOtherInput(event);
  }).not.toThrow();
});

test('#selectPreviousInput: should not throw an error without an event', () => {
  setup();
  expect(() => {
    selectPreviousInput();
  }).not.toThrow();
});

test('#selectPreviousInput: should add the checked flag from the text input when text', () => {
  setup();
  const element = document.querySelector('#choice-other-input-multichoice-answer-other');
  element.value = 'Value';
  const event = {
    target: element,
  };

  element.previousSibling.checked = false;
  expect(element.previousSibling.checked).toBe(false);
  selectPreviousInput(event);
  expect(element.previousSibling.checked).toBe(true);
});

test('#selectPreviousInput: should remove the checked flag from the text input when no text', () => {
  setup();
  const element = document.querySelector('#choice-other-input-multichoice-answer-other');
  element.value = '';

  const event = {
    target: element,
  };

  element.previousSibling.checked = true;
  expect(element.previousSibling.checked).toBe(true);
  selectPreviousInput(event);
  expect(element.previousSibling.checked).toBe(false);
});

test('#surveyError: should handle an error when submitting a survey', () => {
  const apptentiveSurvey = setup();

  expect(() => {
    apptentiveSurvey.surveyError();
  }).not.toThrow();
});

test('#surveyError: should handle an error when submitting a survey with error text', () => {
  const apptentiveSurvey = setup();

  expect(() => {
    apptentiveSurvey.surveyError({ responseText: '{ "error": "Missing 52db59c27724c591ab00003f" }' });
  }).not.toThrow();
});

test('Question Types: Multichoice: renders the questions text and instructions', () => {
  setup();
  const firstQuestion = surveyConfig.configuration.question_sets[0].questions[0];
  const question = document.querySelectorAll('#fixtures question');
  expect(question.length).not.toBe(0);

  const questionText = question[0].querySelector('h2');
  expect(questionText.textContent).toBe(firstQuestion.value);

  const questionInstructions = question[0].querySelector('question-instructions');
  expect(questionInstructions.textContent).toBe(`(${firstQuestion.instructions})`);
});

test('Question Types: Multiselect: renders with a required question instructions', () => {
  setup();
  const secondQuestion = surveyConfig.configuration.question_sets[1].questions[0];
  const question = document.querySelectorAll('#fixtures question');
  expect(question.length).not.toBe(0);

  const questionText = question[1].querySelector('h2');
  expect(questionText.textContent).toBe(secondQuestion.value);

  const questionInstructions = question[1].querySelector('question-instructions');
  expect(questionInstructions.textContent).toBe(`Required (${secondQuestion.instructions})`);
});

test('Question Types: All Question Types: when the form is submitted and the question is invalid creates an invalid reason element with explanation (Required)', () => {
  const apptentiveSurvey = setup();
  apptentiveSurvey.submitSurvey(surveyConfig.configuration);

  const question = document.querySelector(`#fixtures #question-${multiselectQuestionConfig.id}`);
  const questionClasses = Array.prototype.slice.call(question.classList);

  expect(questionClasses).toEqual([domSelectors.apptentiveSurveyQuestion, 'multiselect', 'invalid']);
  expect(question.querySelector(domSelectors.invalidReason)).not.toBe(null);
  expect(question.querySelector(domSelectors.invalidReason).textContent).toBe(multiselectQuestionConfig.error_message);
});

test('Question Types: All Question Types: when the form is submitted and the question is invalid does not create duplicate invalid reasons ', () => {
  const apptentiveSurvey = setup();
  apptentiveSurvey.submitSurvey(surveyConfig.configuration);
  apptentiveSurvey.submitSurvey(surveyConfig.configuration);

  const question = document.querySelector(`#fixtures #question-${multiselectQuestionConfig.id}`);
  const questionClasses = Array.prototype.slice.call(question.classList);

  expect(questionClasses).toEqual([domSelectors.apptentiveSurveyQuestion, 'multiselect', 'invalid']);
  expect(question.querySelectorAll(domSelectors.invalidReason).length).toBe(1);
  expect(question.querySelector(domSelectors.invalidReason)).not.toBe(null);
  expect(question.querySelector(domSelectors.invalidReason).textContent).toBe(multiselectQuestionConfig.error_message);
});

test('Question Types: All Question Types: when the form is submitted and the question is invalid and afterwards the answer is changed removes the invalid indicators', () => {
  const apptentiveSurvey = setup();
  apptentiveSurvey.submitSurvey(surveyConfig.configuration);
  const question = document.querySelector(`#fixtures #question-${multiselectQuestionConfig.id}`);
  const questionClasses = Array.prototype.slice.call(question.classList);
  expect(questionClasses).toEqual([domSelectors.apptentiveSurveyQuestion, 'multiselect', 'invalid']);
  expect(question.querySelector(domSelectors.invalidReason)).not.toBe(null);
  removeErrors(question)();
  const postQuestion = document.querySelector(`#fixtures #question-${multiselectQuestionConfig.id}`);
  const postQuestionClasses = Array.prototype.slice.call(postQuestion.classList);
  expect(postQuestionClasses).toEqual([domSelectors.apptentiveSurveyQuestion, 'multiselect']);
  expect(postQuestion.querySelector(domSelectors.invalidReason)).toBe(null);
});

test('Question Types: All Question Types: when the form is submitted and the question is invalid and afterwards the answer is changed is idempotent', () => {
  const apptentiveSurvey = setup();
  apptentiveSurvey.submitSurvey(surveyConfig.configuration);
  const question = document.querySelector(`#fixtures #question-${multiselectQuestionConfig.id}`);
  const questionClasses = Array.prototype.slice.call(question.classList);
  expect(questionClasses).toEqual([domSelectors.apptentiveSurveyQuestion, 'multiselect', 'invalid']);
  expect(question.querySelector(domSelectors.invalidReason)).not.toBe(null);
  removeErrors(question)();
  expect(() => {
    removeErrors(question)();
  }).not.toThrow();
});

test('Question Types: Unrecognized Type: renders nothing', () => {
  setup();
  expect(document.querySelectorAll('#fixtures question.bogus').length).toBe(0);
});

test('Question Types: Multichoice: renders correctly', () => {
  setup();
  const multichoiceQuestion = document.querySelector('#fixtures question.multichoice');

  const answerChoices = multichoiceQuestion.querySelector(domSelectors.answerChoices);
  const choices = answerChoices.querySelectorAll(domSelectors.answerChoice);

  expect(choices.length).toBe(multichoiceQuestionConfig.answer_choices.length);

  const choiceInput = choices[0].querySelector('input');
  expect(choiceInput.type).toBe('radio');
  expect(choiceInput.name).toBe(multichoiceQuestionConfig.id);
  expect(choiceInput.value).toBe(multichoiceQuestionConfig.answer_choices[0].id);

  const label = choices[0].querySelector('label');
  expect(label.textContent).toBe(multichoiceQuestionConfig.answer_choices[0].value);
});

test('Question Types: Multichoice: renders an other option and text field if flag is set', () => {
  setup();
  const multichoiceQuestion = document.querySelector('#fixtures question.multichoice');

  const answerChoices = multichoiceQuestion.querySelector(domSelectors.answerChoices);
  const otherChoices = answerChoices.querySelectorAll('.other-input');

  expect(otherChoices.length).toBe(1);
});

test('Question Types: Multiselect: renders correctly', () => {
  setup();
  const multiselectQuestion = document.querySelector('#fixtures question.multiselect');

  const answerChoices = multiselectQuestion.querySelector(domSelectors.answerChoices);
  const choices = answerChoices.querySelectorAll(domSelectors.answerChoice);

  expect(choices.length).toBe(multiselectQuestionConfig.answer_choices.length);

  const choiceInput = choices[0].querySelector('input');
  expect(choiceInput.type).toBe('checkbox');
  expect(choiceInput.name).toBe(multiselectQuestionConfig.id);
  expect(choiceInput.value).toBe(multiselectQuestionConfig.answer_choices[0].id);

  const label = choices[0].querySelector('label');
  expect(label.textContent).toBe(multiselectQuestionConfig.answer_choices[0].value);
});

test('Question Types: Multiselect: renders an other option and text field if flag is set', () => {
  setup();
  const multiselectQuestion = document.querySelector('#fixtures question.multiselect');

  const answerChoices = multiselectQuestion.querySelector(domSelectors.answerChoices);
  const otherChoices = answerChoices.querySelectorAll('.other-input');

  expect(otherChoices.length).toBe(1);
});

test('Question Types: Multiselect: if an invalid number of choices are made invalidates the survey (too many)', () => {
  setup();
  const apptentiveSurvey = setup();

  document.querySelector(
    `input[name="${multiselectQuestionConfig.id}"][value="${multiselectQuestionConfig.answer_choices[0].id}" ]`
  ).checked = true;
  document.querySelector(
    `input[name="${multiselectQuestionConfig.id}"][value="${multiselectQuestionConfig.answer_choices[1].id}" ]`
  ).checked = true;
  document.querySelector(
    `input[name="${multiselectQuestionConfig.id}"][value="${multiselectQuestionConfig.answer_choices[2].id}" ]`
  ).checked = true;
  document.querySelector(
    `input[name="${multiselectQuestionConfig.id}"][value="${multiselectQuestionConfig.answer_choices[3].id}" ]`
  ).checked = true;
  document.querySelector(
    `input[name="${multiselectQuestionConfig.id}"][value="${multiselectQuestionConfig.answer_choices[4].id}" ]`
  ).checked = true;
  apptentiveSurvey.submitSurvey(surveyConfig.configuration);

  const question = document.querySelector(`#fixtures #question-${multiselectQuestionConfig.id}`);
  const questionClasses = Array.prototype.slice.call(question.classList);

  expect(questionClasses).toEqual([domSelectors.apptentiveSurveyQuestion, 'multiselect', 'invalid']);
  expect(question.querySelector(domSelectors.invalidReason)).not.toBe(null);
  expect(question.querySelector(domSelectors.invalidReason).textContent).toBe(multiselectQuestionConfig.error_message);
});

test('Question Types: Multiselect: if an invalid number of choices are made invalidates the survey (too few)', () => {
  setup();
  const apptentiveSurvey = setup();

  document.querySelector(
    `input[name="${multiselectQuestionConfig.id}"][value="${multiselectQuestionConfig.answer_choices[0].id}" ]`
  ).checked = true;
  apptentiveSurvey.submitSurvey(surveyConfig.configuration);

  const question = document.querySelector(`#fixtures #question-${multiselectQuestionConfig.id}`);
  const questionClasses = Array.prototype.slice.call(question.classList);

  expect(questionClasses).toEqual([domSelectors.apptentiveSurveyQuestion, 'multiselect', 'invalid']);
  expect(question.querySelector(domSelectors.invalidReason)).not.toBe(null);
  expect(question.querySelector(domSelectors.invalidReason).textContent).toBe(multiselectQuestionConfig.error_message);
});

test('Question Types: Single Line: renders correctly', () => {
  setup();
  const singlelineQuestion = document.querySelector('#fixtures question.singleline');
  expect(singlelineQuestion).not.toBe(null);
  const answerChoices = singlelineQuestion.querySelector(domSelectors.answerChoices);
  const choices = answerChoices.querySelectorAll(domSelectors.answerChoice);
  expect(choices.length).toBe(1);
  const choiceInput = choices[0].querySelector('input');
  expect(choiceInput.type).toBe('text');
  expect(choiceInput.name).toBe(singlelineQuestionConfig.id);
});

test('Question Types: Single Line: renders a textarea if it is multiline', () => {
  setup();
  const singlelineQuestion = document.querySelectorAll('#fixtures question.singleline')[1];
  expect(singlelineQuestion).not.toBe(null);
  const answerChoices = singlelineQuestion.querySelector(domSelectors.answerChoices);
  const choices = answerChoices.querySelectorAll(domSelectors.answerChoice);
  expect(choices.length).toBe(1);
  const choiceInput = choices[0].querySelector('textarea');
  expect(choiceInput).not.toBe(null);
  expect(choiceInput.name).toBe(multilineQuestionConfig.id);
});

test('Question Types: Range / NPS: renders correctly', () => {
  setup();
  const npsQuestion = document.querySelector('#fixtures question.nps');
  expect(npsQuestion).not.toBe(null);
  const answerChoices = npsQuestion.querySelector(domSelectors.answerChoices);
  const choices = answerChoices.querySelectorAll(domSelectors.answerChoice);
  expect(choices.length).toBe(11);
  const answerChoiceLabels = npsQuestion.querySelector('answer-choice-labels');
  const minLabel = answerChoiceLabels.querySelector('answer-min-label');
  expect(minLabel.textContent).toBe(npsQuestionConfig.min_label);
  const maxLabel = answerChoiceLabels.querySelector('answer-max-label');
  expect(maxLabel.textContent).toBe(npsQuestionConfig.max_label);
});
