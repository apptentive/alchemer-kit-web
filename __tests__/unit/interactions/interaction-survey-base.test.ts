import ApptentiveInteractionSurveyBase from '../../../src/interactions/interaction-survey-base';

const _mockSurveyElementClassname = 'mock_survey_element';
const _mockInteraction = {
  id: 'MOCK_INTERACTION',
  type: 'Survey',
  api_version: 12,
  configuration: {},
} as any;

const _mockSdk = {
  engage: jest.fn(),
} as any;

describe('ApptentiveInteractionSurveyBase', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    _mockSdk.engage.mockClear();
  });

  test('properly dismisses a survey', () => {
    const base = new ApptentiveInteractionSurveyBase(_mockInteraction, _mockSdk, {} as any);

    const surveyElement = document.createElement('div');
    surveyElement.classList.add(_mockSurveyElementClassname);
    document.body.append(surveyElement);

    base.surveyContainer = surveyElement;
    base.dismiss('com.apptentive#Survey#cancel');

    expect(_mockSdk.engage).toHaveBeenCalledTimes(1);
    expect(document.body.querySelector(`.${_mockSurveyElementClassname}`)).toBeNull();
  });

  test('properly handles a missing container when dismissing', () => {
    const base = new ApptentiveInteractionSurveyBase(_mockInteraction, _mockSdk);

    expect(() => base.dismiss('')).not.toThrow();
    expect(_mockSdk.engage).toHaveBeenCalledTimes(1);
  });

  test('properly handles a missing sdk when dismissing', () => {
    // @ts-expect-error test for passing invalid sdk argument
    const base = new ApptentiveInteractionSurveyBase(_mockInteraction);

    const surveyElement = document.createElement('div');
    surveyElement.classList.add(_mockSurveyElementClassname);
    document.body.append(surveyElement);

    base.surveyContainer = surveyElement;

    expect(() => base.dismiss('')).not.toThrow();
    expect(_mockSdk.engage).not.toHaveBeenCalled();
    expect(document.body.querySelector(`.${_mockSurveyElementClassname}`)).toBeNull();
  });

  test('properly handles a missing sdk and container when dismissing', () => {
    // @ts-expect-error test for passing invalid sdk argument
    const base = new ApptentiveInteractionSurveyBase(_mockInteraction, null, {});

    expect(() => base.dismiss('')).not.toThrow();
    expect(_mockSdk.engage).not.toHaveBeenCalled();
  });
});
