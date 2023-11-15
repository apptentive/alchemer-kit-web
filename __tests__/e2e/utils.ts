import { Page } from '@playwright/test';
import { IQuestionSet } from '../../src/interfaces/interactions/survey/IQuestionSet';
import { ISurveyBranchedConfiguration } from '../../src/interfaces/interactions/ISurveyBranchedConfiguration';
import { QuestionType } from '../../src/interfaces/interactions/survey/IQuestionType';
import { IQuestionMultiselect } from '../../src/interfaces/interactions/survey/IQuestionMultiselect';
import { IStoreInvoke } from '../../src/interfaces/store/IStoreInvoke';

export const TEST_URL = '/public/playwright/';
export const defaultInvoke: IStoreInvoke = { total: 1, version: 1, build: 1 };

export const createConversation = async (page: Page) => {
  await page.evaluate(() => window.ApptentiveSDK.createConversation());
  await page.waitForFunction(() => Object.keys(window.ApptentiveSDK.conversation).length > 0);

  return page.evaluate(() => window.ApptentiveSDK.conversation);
};

export const reloadPage = async (page: Page) => {
  await page.reload({ waitUntil: 'domcontentloaded' });

  // Wait until the conversation and logic engine has been populated
  await page.waitForFunction(
    () =>
      !!window.ApptentiveSDK &&
      !!window.ApptentiveSDK.logicEngine &&
      Object.keys(window.ApptentiveSDK.conversation).length > 0
  );
};

export const getFieldFromLocalStorage = async (page: Page, field: string) => {
  const config = await page.evaluate(() => JSON.parse(window.localStorage.getItem('Apptentive') as string));
  return config.items[field];
};

export const getMockedStore = (data: Record<string, any>) => ({
  keys: ['app_id', 'random', 'interaction_counts', 'code_point', 'conversation'],
  items: {
    app_id: 'playwright',
    conversation: {
      state: 'new',
      id: 1678988699224,
      device_id: 1678988699225,
      person_id: 1678988699226,
      sdk: {
        programming_language: 'JavaScript',
        author_name: 'Apptentive, Inc.',
        platform: 'Web',
        distribution: 'CDN',
        distribution_version: '',
        version: '0.2.0',
      },
      app_release: {
        type: 'web',
        sdk_version: '0.2.0',
      },
      token: 'FAKE_API_TOKEN',
    },
    code_point: {
      'com.apptentive#app#init': {
        invokes: {
          total: 1,
          version: 1,
          build: 1,
        },
        last_invoked_at: 1678988933630,
      },
      'com.apptentive#app#launch': {
        invokes: {
          total: 1,
          version: 1,
          build: 1,
        },
        last_invoked_at: 1678988933632,
      },
    },
    interaction_counts: {},
    random: {},
    ...data,
  },
});

export const getDateFormat = (date: Date) =>
  `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}:${date.getHours()}-${date.getMinutes()}`;

export const getQuestionSet = (configuration: ISurveyBranchedConfiguration, num: number): IQuestionSet =>
  configuration.question_sets[num];
export const getQuestion = (configuration: ISurveyBranchedConfiguration, num: number, questionNum = 0): QuestionType =>
  configuration.question_sets[num].questions[questionNum];
export const getAnsChoice = (q: QuestionType, num: number) => {
  const question = { ...q } as IQuestionMultiselect;
  return question.answer_choices ? question.answer_choices[num] : null;
};
export const getAnsChoiceValue = (q: QuestionType, num: number) => {
  const ansChoice = getAnsChoice(q, num);
  return ansChoice ? ansChoice.value : '';
};
