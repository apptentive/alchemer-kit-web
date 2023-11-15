import ApptentiveApi from '../../../src/api.ts';
import ApptentiveBase from '../../../src/base.ts';
import ApptentiveSurveyPaged from '../../../src/interactions/survey-paged.ts';

import { singlelineQuestionConfig } from '../../mocks/data/survey-questions.ts';
import { domFireEvent, domSelectors, domSetValue } from '../../utils/dom.js';
import { manifest as surveyBranchedManifest } from '../../mocks/data/survey-branched-manifest';
import { _domNode, _domNodeId, _host, _interactionOptions, _apiToken, _appId } from '../../mocks/data/shared-constants';

const surveyConfig = {
  id: 'SURVEY_ID',
  configuration: {
    name: 'test survey',
    questions: [],
    show_success_message: true,
    success_message: 'Thank you!',
    contact_url: 'Contact Us!',
    contact_url_text: 'http://www.apptentive.com/',
  },
};

const manifest = {
  interactions: [surveyConfig, ...surveyBranchedManifest.interactions],
  targets: {
    'local#app#launch_survey_paged_id': [
      {
        interaction_id: 'SURVEY_ID',
        criteria: {},
      },
    ],
    ...surveyBranchedManifest.targets,
  },
};
Object.freeze(manifest);

let currentInteraction = {};

const getNestedDataFromManifest = (questionSet, question, answer) => {
  let result = currentInteraction;

  if (questionSet > -1) {
    result = result.configuration.question_sets[questionSet];
  }

  if (question > -1) {
    result = result.questions[question];
  }

  if (answer > -1) {
    result = result.answer_choices[answer];
  }

  return result;
};

// eslint-disable-next-line consistent-return
const setup = (options = {}) => {
  const optionsWithDefaults = {
    scaffoldDomNode: true,
    scaffoldSdk: true,
    autoRenderSurvey: true,
    build: true,
    customInteractions: {},
    debug: false,
    ...options,
  };

  if (optionsWithDefaults.scaffoldDomNode) {
    const domNodeElement = document.createElement('div');

    domNodeElement.id = _domNodeId;
    domNodeElement.innerHTML = '';
    document.body.append(domNodeElement);
  }

  if (optionsWithDefaults.scaffoldSdk) {
    currentInteraction = { ...surveyBranchedManifest.interactions[0], ...optionsWithDefaults.customInteractions };

    const apptentiveSdk = new ApptentiveBase({
      id: _appId,
      debug: optionsWithDefaults.debug,
      host: _host,
      token: _apiToken,
      ...manifest,
    });
    apptentiveSdk.conversation.id = 'conversation-id';

    const apptentiveSurveyBranched = new ApptentiveSurveyPaged(currentInteraction, apptentiveSdk, _interactionOptions);

    if (optionsWithDefaults.autoRenderSurvey) {
      apptentiveSurveyBranched.render();
    }

    return apptentiveSurveyBranched;
  }
};

afterEach(() => {
  document.body.innerHTML = '';
});

test('#constructor: has no side effect if no config is passed', () => {
  setup({ scaffoldSdk: false });

  const apptentiveSDK = new ApptentiveBase({ id: _appId, host: _host, token: _apiToken, ...manifest });
  const apptentiveSurvey = new ApptentiveSurveyPaged(undefined, apptentiveSDK);
  apptentiveSurvey.render();

  expect(document.querySelector(_domNode).innerHTML).toBe('');
});

test('#render: should render a DOM element on the page', () => {
  setup();
  expect(document.querySelector(_domNode).innerHTML).toMatchSnapshot();
});

test('#render: can be built as a static method', () => {
  setup({ scaffoldSdk: false });

  const apptentiveSDK = new ApptentiveBase({ id: _appId, host: _host, token: _apiToken, ...manifest });
  apptentiveSDK.conversation.id = 'conversation-id';

  ApptentiveSurveyPaged.display(surveyBranchedManifest.interactions[0], apptentiveSDK, _interactionOptions);

  expect(document.querySelector(_domNode).innerHTML).toMatchSnapshot();
});

test('#render: properly catches error if no parameters are passed', () => {
  expect(() => ApptentiveSurveyPaged.display()).not.toThrow();
});

test('#render: renders only once', () => {
  const apptentiveSurvey = setup();

  apptentiveSurvey.render();
  apptentiveSurvey.render();

  expect(document.querySelectorAll('apptentive-survey').length).toBe(1);
});

test('#render: logs error if no questionSets exist', () => {
  setup({ scaffoldSdk: false });

  const apptentiveSdk = new ApptentiveBase({ id: _appId, host: _host, token: _apiToken, debug: true, ...manifest });
  apptentiveSdk.conversation.id = 'conversation-id';

  const consoleSpy = jest.spyOn(apptentiveSdk, 'console').mockImplementation();
  const apptentiveSurveyBranched = new ApptentiveSurveyPaged(
    {
      id: 'test_id',
      configuration: {
        question_sets: null,
      },
    },
    apptentiveSdk,
    _interactionOptions
  );

  apptentiveSurveyBranched.render();

  expect(consoleSpy).toHaveBeenCalledTimes(2);
  expect(consoleSpy.mock.calls[1]).toEqual(['error', 'This Survey has no QuestionSets']);
});

test('#render: displays the introduction page if one is configured', () => {
  setup({
    customInteractions: {
      configuration: {
        ...surveyBranchedManifest.interactions[0].configuration,
        description: 'Introduction Text',
      },
    },
  });

  const introductionElement = document.querySelectorAll('apptentive-survey-introduction');
  expect(introductionElement.length).toBe(1);
});

test('#render: does not render if the question form cannot be rendered', () => {
  const apptentiveSurvey = setup({
    autoRenderSurvey: false,
    customInteractions: {
      configuration: {
        ...surveyBranchedManifest.interactions[0].configuration,
        description: 'Introduction Text',
      },
    },
  });

  // Set the question index to a value that doesn't have a cooresponding question to cause the render to fail
  apptentiveSurvey.currentQuestionIndex = 42;
  apptentiveSurvey.render();

  const surveyElement = document.querySelector('apptentive-survey');
  expect(surveyElement).toBeNull();
});

test('#collectAnswers: can collect the answers from a visible QuestionSet for checkbox answers', () => {
  const apptentiveSurvey = setup();
  expect(apptentiveSurvey.answers).toEqual({});

  document.querySelector(
    `input[name="${getNestedDataFromManifest(0, 0).id}"][value="${getNestedDataFromManifest(0, 0, 1).id}"]`
  ).checked = true;
  apptentiveSurvey.collectAnswers();

  expect(apptentiveSurvey.answers).toEqual({
    '4e32ffff-e858-45d1-b7e9-ba729ef43834': [
      {
        value: 'b58de0dc-a2b7-49c6-8787-a6df496699a7',
      },
    ],
  });
});

test('#collectAnswers: can collect the answers from a visible QuestionSet for Other text answers', () => {
  const apptentiveSurvey = setup();
  expect(apptentiveSurvey.answers).toEqual({});

  document.querySelector(
    `input[name="${getNestedDataFromManifest(0, 0).id}"][value="${getNestedDataFromManifest(0, 0, 2).id}"]`
  ).checked = true;
  document.querySelector(`input[name="${getNestedDataFromManifest(0, 0).id}-other"]`).value = 'other text';
  apptentiveSurvey.collectAnswers();

  expect(apptentiveSurvey.answers).toEqual({
    '4e32ffff-e858-45d1-b7e9-ba729ef43834': [
      {
        other: 'other text',
        value: 'b58de0dc-a2b7-49c6-8787-a6df496699a8',
      },
    ],
  });
});

test('#submitQuestionSet: should fire an event containing the current question answers', (done) => {
  const apptentiveSurvey = setup();

  apptentiveSurvey.answers = {
    [getNestedDataFromManifest(0, 0).id]: [
      {
        value: getNestedDataFromManifest(0, 0, 1).id,
        other: 'something',
      },
    ],
  };

  const validator = (event) => {
    expect(event.detail).toEqual({
      answers: {
        [getNestedDataFromManifest(0, 0).id]: {
          state: 'answered',
          value: [
            {
              id: getNestedDataFromManifest(0, 0, 1).id,
              value: 'something',
            },
          ],
        },
      },
      id: apptentiveSurvey.currentQuestionSet.id,
      interaction_id: apptentiveSurvey.interaction.id,
    });
    done();
  };

  document.addEventListener('apptentive:survey:next_question_set', validator);

  apptentiveSurvey.submitQuestionSet();
  document.removeEventListener('apptentive:survey:next_question_set', validator);
});

test('#getNextQuestion: returns undefined when there is no question found', () => {
  const apptentiveSurvey = setup();

  apptentiveSurvey.currentQuestionSet = getNestedDataFromManifest(7);
  const nextQuestion = apptentiveSurvey.getNextQuestion();

  expect(nextQuestion).toBeNull();
});

test('#evaluateQuestionSetCriteria: returns null when there is no invokes array', () => {
  const apptentiveSurvey = setup();
  const result = apptentiveSurvey.evaluateQuestionSetCriteria(null);

  expect(result).toBeNull();
});

test('#evaluateQuestionSetCriteria: returns next question set id when behavior is continue', () => {
  const apptentiveSurvey = setup();
  const mockQuestionSetId = '12345';
  const invokesArray = [
    {
      criteria: {
        test: 'test',
      },
      behavior: 'continue',
      next_question_set_id: mockQuestionSetId,
    },
  ];
  const evaluateCriteriaSpy = jest.spyOn(apptentiveSurvey.sdk.logicEngine, 'evaluateCriteria').mockReturnValue(true);

  const result = apptentiveSurvey.evaluateQuestionSetCriteria(invokesArray);

  expect(result).toBe(mockQuestionSetId);

  evaluateCriteriaSpy.mockRestore();
});

test('#evaluateQuestionSetCriteria: returns null when behavior is end', () => {
  const apptentiveSurvey = setup();
  const invokesArray = [
    {
      criteria: {
        test: 'test',
      },
      behavior: 'end',
    },
  ];
  const evaluateCriteriaSpy = jest.spyOn(apptentiveSurvey.sdk.logicEngine, 'evaluateCriteria').mockReturnValue(true);

  const result = apptentiveSurvey.evaluateQuestionSetCriteria(invokesArray);

  expect(result).toBeNull();

  evaluateCriteriaSpy.mockRestore();
});

test('#nextQuestion: can validate the current question and advance to the next Question', () => {
  const apptentiveSurvey = setup();
  document.querySelector(
    `input[name="${getNestedDataFromManifest(0, 0).id}"][value="${getNestedDataFromManifest(0, 0, 1).id}"]`
  ).checked = true;

  apptentiveSurvey.nextQuestion();

  expect(apptentiveSurvey.answers).toEqual({
    '4e32ffff-e858-45d1-b7e9-ba729ef43834': [
      {
        value: 'b58de0dc-a2b7-49c6-8787-a6df496699a7',
      },
    ],
  });
});

test('#nextQuestion: should change the button text to submit when there is no next question', () => {
  const apptentiveSurvey = setup({
    customInteractions: {
      configuration: {
        ...surveyBranchedManifest.interactions[0].configuration,
        question_sets: [
          surveyBranchedManifest.interactions[0].configuration.question_sets[0],
          {
            ...surveyBranchedManifest.interactions[0].configuration.question_sets[1],
            invokes: null,
          },
        ],
      },
    },
  });

  document.querySelector(
    `input[name="${getNestedDataFromManifest(0, 0).id}"][value="${getNestedDataFromManifest(0, 0, 1).id}"]`
  ).checked = true;

  apptentiveSurvey.nextQuestion();

  const buttonElement = document.querySelector('.apptentive-survey-questions .apptentive-survey__button');

  expect(buttonElement.textContent).toBe(getNestedDataFromManifest(1).button_text);
});

test('#nextQuestion: will add error if question is invalid', () => {
  const apptentiveSurvey = setup();
  apptentiveSurvey.nextQuestion();

  const errorsContainer = document.querySelector('apptentive-survey .apptentive-errors');

  expect(errorsContainer.textContent).toBe('Error - There was a problem with your single-select answer.');
});

test('#nextQuestion: when the question is currently invalid clicking next will clear out previous answers', () => {
  const apptentiveSdk = setup({
    customInteractions: {
      configuration: {
        ...surveyBranchedManifest.interactions[0].configuration,
        question_sets: [
          {
            id: 'question_set',
            button_text: 'Onward',
            invokes: [
              {
                behavior: 'continue',
                next_question_set_id: 'next_question_set',
                criteria: {},
              },
            ],
            questions: [{ ...singlelineQuestionConfig, required: true }],
          },
        ],
      },
    },
  });

  domFireEvent(domSelectors.apptentiveSurveyButton);

  expect(apptentiveSdk.answers).toEqual({
    [singlelineQuestionConfig.id]: [{ value: '' }],
  });

  domSetValue(`input[name="${singlelineQuestionConfig.id}"]`, 'something');
  domFireEvent(domSelectors.apptentiveSurveyButton);

  expect(apptentiveSdk.answers).toEqual({
    [singlelineQuestionConfig.id]: [{ value: 'something' }],
  });
});

test('#nextQuestion: can submit when at the last Question of the QuestionSet', () => {
  const apptentiveSurvey = setup();
  const evaluateQuestionSetCriteria = jest.spyOn(apptentiveSurvey, 'evaluateQuestionSetCriteria').mockReturnValue(null);
  const submitQuestionSet = jest.spyOn(apptentiveSurvey, 'submitQuestionSet').mockImplementation();

  document.querySelector(
    `input[name="${getNestedDataFromManifest(0, 0).id}"][value="${getNestedDataFromManifest(0, 0, 1).id}"]`
  ).checked = true;

  expect(submitQuestionSet).toHaveBeenCalledTimes(0);

  apptentiveSurvey.nextQuestion(apptentiveSurvey.interaction);

  expect(submitQuestionSet).toHaveBeenCalledTimes(1);

  evaluateQuestionSetCriteria.mockRestore();
  submitQuestionSet.mockRestore();
});

test('#nextQuestion: can render the next question set', () => {
  const apptentiveSurvey = setup();
  const submitSurvey = jest.spyOn(apptentiveSurvey, 'submitSurvey').mockImplementation();

  document.querySelector(
    `input[name="${getNestedDataFromManifest(0, 0).id}"][value="${getNestedDataFromManifest(0, 0, 1).id}"]`
  ).checked = true;

  expect(apptentiveSurvey.currentQuestionSet).toEqual(getNestedDataFromManifest(0));
  expect(submitSurvey).toHaveBeenCalledTimes(0);

  apptentiveSurvey.nextQuestion();

  expect(apptentiveSurvey.currentQuestionSet).toEqual(getNestedDataFromManifest(1));
  expect(submitSurvey).toHaveBeenCalledTimes(0);

  submitSurvey.mockRestore();
});

test('#nextQuestion: will update indeterminate progress indicator', () => {
  // const apptentiveSurvey = setup({ autoRenderSurvey: false });
  const apptentiveSurvey = setup({
    customInteractions: {
      configuration: {
        ...surveyBranchedManifest.interactions[0].configuration,
        question_sets: [
          surveyBranchedManifest.interactions[0].configuration.question_sets[0],
          surveyBranchedManifest.interactions[0].configuration.question_sets[1],
          {
            id: '11',
            questions: [
              {
                id: '1',
              },
            ],
          },
          {
            id: '22',
            questions: [
              {
                id: '2',
              },
            ],
          },
          {
            id: '33',
            questions: [
              {
                id: '3',
              },
            ],
          },
          {
            id: '44',
            questions: [
              {
                id: '4',
              },
            ],
          },
          {
            id: '55',
            questions: [
              {
                id: '5',
              },
            ],
          },
          {
            id: '66',
            questions: [
              {
                id: '6',
              },
            ],
          },
          {
            id: '77',
            questions: [
              {
                id: '7',
              },
            ],
          },
          {
            id: '88',
            questions: [
              {
                id: '8',
              },
            ],
          },
          {
            id: '99',
            questions: [
              {
                id: '9',
              },
            ],
          },
        ],
      },
    },
  });

  document.querySelector(
    `input[name="${getNestedDataFromManifest(0, 0).id}"][value="${getNestedDataFromManifest(0, 0, 1).id}"]`
  ).checked = true;

  apptentiveSurvey.nextQuestion();

  const progressBarElement = document.querySelector('.apptentive-progress-bar');
  const progressValue = (1 / 11) * 100; // 1 is the second question index

  expect(progressBarElement.value).toBe(progressValue);
});

test('#surveySubmitted: with show_success_message being true should hide the survey questions & show the thank you message', () => {
  const apptentiveSurvey = setup();
  apptentiveSurvey.surveySubmitted({ show_success_message: true });

  expect(apptentiveSurvey.surveyContainer.querySelector('form.apptentive-survey-questions').style.display).toBe('none');
  expect(apptentiveSurvey.surveyContainer.querySelector('apptentive-survey-thank-you').style.display).toBe('');
});

test('#surveySubmitted: with show_success_message being false should call dismiss', () => {
  const apptentiveSurvey = setup({
    customInteractions: {
      ...surveyBranchedManifest.interactions[0],
      configuration: { ...surveyBranchedManifest.interactions[0].configuration, show_success_message: false },
    },
  });
  const close = jest.spyOn(apptentiveSurvey, 'handleClose').mockImplementation();

  apptentiveSurvey.surveySubmitted();

  expect(close).toHaveBeenCalledTimes(1);

  apptentiveSurvey.handleClose.mockRestore();
});

test('#surveySubmitted: should fire an event containing the answers', () => {
  const apptentiveSurvey = setup();
  const engageSpy = jest.spyOn(apptentiveSurvey.sdk, 'engage').mockImplementation(() => true);
  const dismiss = jest.spyOn(apptentiveSurvey, 'dismiss').mockImplementation();
  const answers = {
    [getNestedDataFromManifest(0, 0).id]: {
      state: 'answered',
      value: [
        {
          id: getNestedDataFromManifest(0, 0, 1).id,
          value: 'something',
        },
      ],
    },
    [getNestedDataFromManifest(2, 0).id]: {
      state: 'answered',
      value: [
        {
          id: getNestedDataFromManifest(2, 0, 1).id,
        },
        {
          id: getNestedDataFromManifest(2, 0, 2).id,
          value: 'something',
        },
      ],
    },
    [getNestedDataFromManifest(3, 0).id]: {
      state: 'answered',
      value: [
        {
          value: 'nope',
        },
      ],
    },
    [getNestedDataFromManifest(3, 0).id]: {
      state: 'answered',
      value: [
        {
          value: 5,
        },
      ],
    },
  };

  const translatedAnswers = {
    [getNestedDataFromManifest(0, 0).id]: [
      {
        id: getNestedDataFromManifest(0, 0, 1).id,
        value: 'something',
      },
    ],
    [getNestedDataFromManifest(2, 0).id]: [
      {
        id: getNestedDataFromManifest(2, 0, 1).id,
      },
      {
        id: getNestedDataFromManifest(2, 0, 2).id,
        value: 'something',
      },
    ],
    [getNestedDataFromManifest(3, 0).id]: [
      {
        value: 'nope',
      },
    ],
    [getNestedDataFromManifest(3, 0).id]: [
      {
        value: 5,
      },
    ],
  };
  apptentiveSurvey.surveyAnswers = answers;
  apptentiveSurvey.surveySubmitted();

  expect(engageSpy).toHaveBeenCalledTimes(1);
  expect(engageSpy.mock.calls[0][1]).toEqual({
    answers: translatedAnswers,
    id: 'SURVEY_PAGED_ID',
    interaction_id: 'SURVEY_PAGED_ID',
  });

  dismiss.mockRestore();
  engageSpy.mockRestore();
});

test('#dismiss: should engage cancel event', () => {
  const apptentiveSurvey = setup(true, { ...surveyConfig });
  const engageSpy = jest.spyOn(apptentiveSurvey.sdk, 'engage').mockImplementation(() => true);

  domFireEvent('.apptentive-appbar__action--close');

  expect(engageSpy.mock.calls[0][0]).toBe('com.apptentive#Survey#cancel');

  engageSpy.mockRestore();
});

test('#handleClose: should show/hide confirm block', () => {
  const apptentiveSurvey = setup(true, { ...surveyConfig });

  document.querySelector(
    `input[name="${getNestedDataFromManifest(0, 0).id}"][value="${getNestedDataFromManifest(0, 0, 1).id}"]`
  ).checked = true;

  apptentiveSurvey.nextQuestion();

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
  const engageSpy = jest.spyOn(apptentiveSurvey.sdk, 'engage').mockImplementation(() => true);

  document.querySelector(
    `input[name="${getNestedDataFromManifest(0, 0).id}"][value="${getNestedDataFromManifest(0, 0, 1).id}"]`
  ).checked = true;

  apptentiveSurvey.nextQuestion();

  domFireEvent('.apptentive-appbar__action--close');

  document.querySelector('.apptentive-interaction__confirm-wrapper').childNodes[1].click();

  expect(engageSpy.mock.calls[0][0]).toBe('com.apptentive#Survey#cancel_partial');

  engageSpy.mockRestore();
});

test('#handleClose: should close confirm block on cross btn click', () => {
  const apptentiveSurvey = setup(true, { ...surveyConfig });
  const engageSpy = jest.spyOn(apptentiveSurvey.sdk, 'engage').mockImplementation(() => true);

  document.querySelector(
    `input[name="${getNestedDataFromManifest(0, 0).id}"][value="${getNestedDataFromManifest(0, 0, 1).id}"]`
  ).checked = true;

  apptentiveSurvey.nextQuestion();

  const crossBtn = document.querySelector('.apptentive-appbar .apptentive-appbar__action--close');
  crossBtn.click();
  crossBtn.click();

  expect(engageSpy.mock.calls[0][0]).toBe('com.apptentive#Survey#cancel_partial');

  engageSpy.mockRestore();
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

test('#surveySubmit: should make an api call with the stored answers', () => {
  const apptentiveSurvey = setup();
  apptentiveSurvey.interaction.id = 'SURVEY_PAGED_ID';

  const submitSurveySpy = jest
    .spyOn(ApptentiveApi.prototype, 'submitSurvey')
    .mockImplementation(() => Promise.resolve({}));
  const answers = {
    [getNestedDataFromManifest(0, 0).id]: {
      state: 'answered',
      value: [
        {
          id: getNestedDataFromManifest(0, 0, 1).id,
          value: 'Fencing',
        },
      ],
    },
    [getNestedDataFromManifest(1, 0).id]: {
      state: 'answered',
      value: [
        {
          id: getNestedDataFromManifest(1, 0, 0).id,
          value: 'Sesame Street',
        },
      ],
    },
    [getNestedDataFromManifest(2, 0).id]: {
      state: 'answered',
      value: [
        {
          id: getNestedDataFromManifest(2, 0, 1).id,
        },
        {
          id: getNestedDataFromManifest(2, 0, 2).id,
          value: 'other text',
        },
      ],
    },
    [getNestedDataFromManifest(3, 0).id]: {
      state: 'answered',
      value: [
        {
          value: 6,
        },
      ],
    },
    [getNestedDataFromManifest(4, 0).id]: {
      state: 'answered',
      value: [
        {
          value: 5,
        },
      ],
    },
    [getNestedDataFromManifest(5, 0).id]: {
      state: 'answered',
      value: [
        {
          value: 8,
        },
      ],
    },
  };

  apptentiveSurvey.surveyAnswers = answers;
  apptentiveSurvey.submitSurvey();

  const request = {
    ...answers,
    [getNestedDataFromManifest(6, 0).id]: {
      state: 'skipped',
    },
    [getNestedDataFromManifest(7, 0).id]: {
      state: 'skipped',
    },
  };

  expect(submitSurveySpy).toHaveBeenCalledTimes(1);
  expect(submitSurveySpy.mock.calls[0][0].json.session_id).toBe(apptentiveSurvey.sdk.session_id);
  expect(submitSurveySpy.mock.calls[0][0].json.response.id).toBe('SURVEY_PAGED_ID');
  expect(submitSurveySpy.mock.calls[0][0].json.response.answers).toEqual(request);

  submitSurveySpy.mockRestore();
});
