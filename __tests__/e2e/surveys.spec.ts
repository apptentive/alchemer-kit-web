import { test, expect } from '@playwright/test';
import type ApptentiveBase from '../../src/base';
import {
  TEST_URL,
  createConversation,
  defaultInvoke,
  getAnsChoiceValue,
  getFieldFromLocalStorage,
  getQuestion,
  getQuestionSet,
} from './utils';
import { IInteraction } from '../../src/interfaces/manifest/IInteraction';
import { ISurveyBranchedConfiguration } from '../../src/interfaces/interactions/ISurveyBranchedConfiguration';

declare global {
  interface Window {
    ApptentiveSDK: ApptentiveBase;
  }
}

test('Paged survey with skip logic', async ({ page }) => {
  await page.goto(TEST_URL);
  await page.evaluate(() => window.ApptentiveSDK.reset());
  await createConversation(page);

  let codePointFromStorage = await getFieldFromLocalStorage(page, 'code_point');
  let pageShortEvent = codePointFromStorage['local#app#surveyPagedshort'];
  let surveyLaunchEvent = codePointFromStorage['com.apptentive#Survey#launch'];

  expect(pageShortEvent).toEqual(undefined);
  expect(surveyLaunchEvent).toEqual(undefined);

  await page.evaluate(() => window.ApptentiveSDK.engage('surveyPagedshort'));
  const surveySelector = await page.waitForSelector('apptentive-survey');
  expect(surveySelector).not.toBeNull();

  codePointFromStorage = await getFieldFromLocalStorage(page, 'code_point');
  pageShortEvent = codePointFromStorage['local#app#surveyPagedshort'];
  surveyLaunchEvent = codePointFromStorage['com.apptentive#Survey#launch'];

  expect(pageShortEvent.invokes).toEqual(defaultInvoke);
  expect(surveyLaunchEvent.invokes).toEqual(defaultInvoke);

  const { configuration } = (await page.evaluate(() =>
    window.ApptentiveSDK.logicEngine.interactionFromId('survey_paged_short')
  )) as IInteraction<ISurveyBranchedConfiguration>;

  const startBtn = await page.getByText('Start Survey');

  // check intro page
  expect(page.getByText(configuration.name)).toBeVisible();
  expect(page.getByText(configuration.description)).toBeVisible();
  expect(startBtn).toBeVisible();
  expect(page.getByText(configuration.disclaimer_text as string)).toBeVisible();
  expect(page.getByText('Contact Us')).toBeVisible();

  await startBtn.click();

  // check first question_set (with additional question inside)
  let nextBtn = await page.getByText(getQuestionSet(configuration, 0).button_text);
  let questionValue = await page.getByText(getQuestion(configuration, 0).value);
  let answerChoiceYes = page.locator('id=choice-container-question_paged_1_answer_1');
  let answerChoiceNo = page.locator('id=choice-container-question_paged_1_answer_2');

  expect(questionValue).toBeVisible();
  expect(page.getByText('Required (select one)')).toBeVisible();
  expect(answerChoiceYes.getByText(getAnsChoiceValue(getQuestion(configuration, 0), 0))).toBeVisible();
  expect(answerChoiceNo.getByText(getAnsChoiceValue(getQuestion(configuration, 0), 1))).toBeVisible();
  expect(nextBtn).toBeVisible();

  await answerChoiceYes.click();
  await nextBtn.click();

  questionValue = await page.getByText(getQuestion(configuration, 0, 1).value);
  answerChoiceYes = page.locator('id=choice-container-question_paged_2_answer_1');
  answerChoiceNo = page.locator('id=choice-container-question_paged_2_answer_2');

  expect(questionValue).toBeVisible();
  expect(page.getByText('Required (select one)')).toBeVisible();
  expect(answerChoiceYes.getByText(getAnsChoiceValue(getQuestion(configuration, 0, 1), 0))).toBeVisible();
  expect(answerChoiceNo.getByText(getAnsChoiceValue(getQuestion(configuration, 0, 1), 1))).toBeVisible();
  expect(nextBtn).toBeVisible();

  await answerChoiceYes.click();
  await nextBtn.click();

  // check second question_set
  nextBtn = await page.getByText(getQuestionSet(configuration, 1).button_text);
  questionValue = await page.getByText(getQuestion(configuration, 1).value);
  const answerChoiceOne = page.locator('id=choice-container-question_paged_3_answer_1');
  const answerChoiceTwo = page.locator('id=choice-container-question_paged_3_answer_2');
  const answerChoiceThree = page.locator('id=choice-container-question_paged_3_answer_3');

  expect(questionValue).toBeVisible();
  expect(page.getByText('(select all that apply)')).toBeVisible();
  expect(answerChoiceOne.getByText(getAnsChoiceValue(getQuestion(configuration, 1), 0))).toBeVisible();
  expect(answerChoiceTwo.getByText(getAnsChoiceValue(getQuestion(configuration, 1), 1))).toBeVisible();
  expect(answerChoiceThree.getByText(getAnsChoiceValue(getQuestion(configuration, 1), 2))).toBeVisible();
  expect(nextBtn).toBeVisible();

  await answerChoiceOne.click();
  await answerChoiceTwo.click();
  await answerChoiceThree.click();
  await nextBtn.click();

  // check fourth question_set
  nextBtn = await page.getByText(getQuestionSet(configuration, 3).button_text);
  questionValue = await page.getByText(getQuestion(configuration, 3).value);
  const answerChoiceOther = page.locator('id=choice-container-question_paged_5_answer_5');

  expect(questionValue).toBeVisible();
  expect(page.getByText('Required (select between 1 and 2)')).toBeVisible();
  expect(answerChoiceOther.getByPlaceholder(getAnsChoiceValue(getQuestion(configuration, 3), 4))).toBeVisible();
  expect(nextBtn).toBeVisible();

  await answerChoiceOther.getByRole('textbox').fill('custom other choice answer');
  await nextBtn.click();

  // check fifth question_set
  nextBtn = await page.getByText(getQuestionSet(configuration, 4).button_text);
  questionValue = await page.getByText(getQuestion(configuration, 4).value);
  const answerChoiceNot = page.locator('id=choice-container-question_paged_6_answer_2');

  expect(questionValue).toBeVisible();
  expect(answerChoiceNot.getByText(getAnsChoiceValue(getQuestion(configuration, 4), 1))).toBeVisible();
  expect(nextBtn).toBeVisible();

  await answerChoiceNot.click();
  await nextBtn.click();

  // check success message
  const finishBtn = await page.getByText(configuration.success_button_text);
  expect(page.getByText(configuration.success_message)).toBeVisible();
  expect(finishBtn).toBeVisible();

  codePointFromStorage = await getFieldFromLocalStorage(page, 'code_point');
  const surveySbmtEvent = codePointFromStorage['com.apptentive#Survey#submit'];
  expect(surveySbmtEvent.invokes).toEqual(defaultInvoke);

  await finishBtn.click();

  codePointFromStorage = await getFieldFromLocalStorage(page, 'code_point');
  const surveyCloseEvent = codePointFromStorage['com.apptentive#Survey#close'];
  expect(surveyCloseEvent.invokes).toEqual(defaultInvoke);
});

test('List survey without skip logic', async ({ page }) => {
  await page.goto(TEST_URL);
  await page.evaluate(() => window.ApptentiveSDK.reset());
  await createConversation(page);

  let codePointFromStorage = await getFieldFromLocalStorage(page, 'code_point');
  let surveyListEvent = codePointFromStorage['local#app#surveyList'];
  let surveyLaunchEvent = codePointFromStorage['com.apptentive#Survey#launch'];

  expect(surveyListEvent).toEqual(undefined);
  expect(surveyLaunchEvent).toEqual(undefined);

  await page.evaluate(() => window.ApptentiveSDK.engage('surveyList'));
  const surveySelector = await page.waitForSelector('apptentive-survey');
  expect(surveySelector).not.toBeNull();

  codePointFromStorage = await getFieldFromLocalStorage(page, 'code_point');
  surveyListEvent = codePointFromStorage['local#app#surveyList'];
  surveyLaunchEvent = codePointFromStorage['com.apptentive#Survey#launch'];

  expect(surveyListEvent.invokes).toEqual(defaultInvoke);
  expect(surveyLaunchEvent.invokes).toEqual(defaultInvoke);

  const { configuration } = (await page.evaluate(() =>
    window.ApptentiveSDK.logicEngine.interactionFromId('survey_list')
  )) as IInteraction<ISurveyBranchedConfiguration>;

  const questionAnswChoice1 = page.locator('id=choice-container-question_list_1_answer_1');
  const questionAnswChoice2 = page.locator('id=choice-container-question_list_2_answer_1');
  const questionAnswChoice3 = page.locator('id=choice-container-question_list_3_answer_1');
  const questionAnswChoice4 = page.locator('id=choice-container-question_list_4_answer_1');
  const questionAnswChoice5 = page.locator('id=choice-container-question_list_5_answer_1');
  const questionAnswChoice6 = page.locator('id=choice-container-question_list_6_answer_1');
  const questionAnswChoice7 = page.locator('id=question-question_list_7').getByPlaceholder('Please provide a response');
  const questionAnswChoice8 = page.locator('id=question-question_list_8').getByPlaceholder('Please provide a response');
  const questionAnswChoice9 = page.locator('id=choice-container-question_list_9_answer_1');

  const sbmtBtn = page.getByTitle(getQuestionSet(configuration, 7).button_text);

  expect(page.getByText(getQuestion(configuration, 0).value)).toBeVisible();
  expect(page.getByText(getQuestion(configuration, 0, 1).value)).toBeVisible();
  expect(page.getByText(getQuestion(configuration, 1).value)).toBeVisible();
  expect(page.getByText(getQuestion(configuration, 2).value)).toBeVisible();
  expect(page.getByText(getQuestion(configuration, 3).value)).toBeVisible();
  expect(page.getByText(getQuestion(configuration, 4).value)).toBeVisible();
  expect(page.getByText(getQuestion(configuration, 5).value)).toBeVisible();
  expect(page.getByText(getQuestion(configuration, 6).value)).toBeVisible();
  expect(page.getByText(getQuestion(configuration, 7).value)).toBeVisible();

  expect(questionAnswChoice1).toBeVisible();
  expect(page.locator('id=choice-container-question_list_1_answer_2')).toBeVisible();

  expect(questionAnswChoice2).toBeVisible();
  expect(page.locator('id=choice-container-question_list_2_answer_2')).toBeVisible();

  expect(questionAnswChoice3).toBeVisible();
  expect(page.locator('id=choice-container-question_list_3_answer_2')).toBeVisible();
  expect(page.locator('id=choice-container-question_list_3_answer_3')).toBeVisible();
  expect(page.locator('id=choice-container-question_list_3_answer_4')).toBeVisible();
  expect(page.locator('id=choice-container-question_list_3_answer_5')).toBeVisible();

  expect(questionAnswChoice4).toBeVisible();
  expect(page.locator('id=choice-container-question_list_4_answer_2')).toBeVisible();
  expect(page.locator('id=choice-container-question_list_4_answer_3')).toBeVisible();
  expect(page.locator('id=choice-container-question_list_4_answer_4')).toBeVisible();
  expect(page.locator('id=choice-container-question_list_4_answer_5')).toBeVisible();
  expect(page.locator('id=choice-container-question_list_4_answer_6')).toBeVisible();
  expect(page.locator('id=choice-container-question_list_4_answer_7')).toBeVisible();
  expect(page.locator('id=choice-container-question_list_4_answer_8')).toBeVisible();
  expect(page.locator('id=choice-container-question_list_4_answer_9')).toBeVisible();
  expect(page.locator('id=choice-container-question_list_4_answer_10')).toBeVisible();
  expect(page.locator('id=choice-container-question_list_4_answer_11')).toBeVisible();

  expect(questionAnswChoice5).toBeVisible();
  expect(page.locator('id=choice-container-question_list_5_answer_2')).toBeVisible();
  expect(page.locator('id=choice-container-question_list_5_answer_3')).toBeVisible();
  expect(page.locator('id=choice-container-question_list_5_answer_4')).toBeVisible();
  expect(page.locator('id=choice-container-question_list_5_answer_5')).toBeVisible();

  expect(questionAnswChoice6).toBeVisible();
  expect(page.locator('id=choice-container-question_list_6_answer_1')).toBeVisible();

  expect(questionAnswChoice7).toBeVisible();
  expect(questionAnswChoice8).toBeVisible();

  expect(questionAnswChoice9).toBeVisible();
  expect(page.locator('id=choice-container-question_list_9_answer_2')).toBeVisible();
  expect(page.locator('id=choice-container-question_list_9_answer_3')).toBeVisible();

  expect(sbmtBtn).toBeVisible();

  await questionAnswChoice1.click();
  await questionAnswChoice2.click();
  await questionAnswChoice3.click();
  await questionAnswChoice4.click();
  await questionAnswChoice5.click();
  await questionAnswChoice6.click();
  await questionAnswChoice7.fill('custom other choice answer');
  await questionAnswChoice8.fill('custom other choice answer');
  await questionAnswChoice9.click();
  await sbmtBtn.click();

  // check success message
  const finishBtn = await page.getByText(configuration.success_button_text);
  expect(page.getByText(configuration.success_message)).toBeVisible();
  expect(finishBtn).toBeVisible();
  await finishBtn.click();

  codePointFromStorage = await getFieldFromLocalStorage(page, 'code_point');
  const surveySbmtEvent = codePointFromStorage['com.apptentive#Survey#submit'];
  const surveyCloseEvent = codePointFromStorage['com.apptentive#Survey#close'];
  expect(surveySbmtEvent.invokes).toEqual(defaultInvoke);
  expect(surveyCloseEvent.invokes).toEqual(defaultInvoke);
});
