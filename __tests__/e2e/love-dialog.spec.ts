import { test, expect } from '@playwright/test';
import type ApptentiveBase from '../../src/base';
import {
  TEST_URL,
  createConversation,
  defaultInvoke,
  getFieldFromLocalStorage,
  getQuestion,
  getQuestionSet,
} from './utils';
import { IInteraction } from '../../src/interfaces/manifest/IInteraction';
import { ISurveyBranchedConfiguration } from '../../src/interfaces/interactions/ISurveyBranchedConfiguration';
import { ILoveDialogConfiguration } from '../../src/interfaces/interactions/ILoveDialogConfiguration';
import { ITextModalConfiguration } from '../../src/interfaces/interactions/ITextModalConfiguration';

declare global {
  interface Window {
    ApptentiveSDK: ApptentiveBase;
  }
}

test.describe('Love Dialog', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(TEST_URL);
    await page.evaluate(() => window.ApptentiveSDK.reset());
    await createConversation(page);

    let codePointFromStorage = await getFieldFromLocalStorage(page, 'code_point');
    let ldEvent = codePointFromStorage['local#app#displayLoveDialog'];
    let ldLaunchEvent = codePointFromStorage['com.apptentive#EnjoymentDialog#launch'];

    expect(ldEvent).toEqual(undefined);
    expect(ldLaunchEvent).toEqual(undefined);

    await page.evaluate(() => window.ApptentiveSDK.engage('displayLoveDialog'));
    const surveySelector = await page.waitForSelector('apptentive-love-dialog');
    expect(surveySelector).not.toBeNull();

    codePointFromStorage = await getFieldFromLocalStorage(page, 'code_point');
    ldEvent = codePointFromStorage['local#app#displayLoveDialog'];
    ldLaunchEvent = codePointFromStorage['com.apptentive#EnjoymentDialog#launch'];

    expect(ldEvent.invokes).toEqual(defaultInvoke);
    expect(ldLaunchEvent.invokes).toEqual(defaultInvoke);

    const loveDialog = (await page.evaluate(() =>
      window.ApptentiveSDK.logicEngine.interactionFromId('love_dialog')
    )) as IInteraction<ILoveDialogConfiguration>;

    const ldModal = await page.locator('id=apptentive-love-dialog-love_dialog' as any);

    expect(ldModal).toBeVisible();
    expect(ldModal.getByText(loveDialog.configuration.title)).toBeVisible();
    expect(ldModal.getByText(loveDialog.configuration.yes_text)).toBeVisible();
    expect(ldModal.getByText(loveDialog.configuration.no_text)).toBeVisible();
  });

  test('on YES click', async ({ page }) => {
    const noteInteraction = (await page.evaluate(() =>
      window.ApptentiveSDK.logicEngine.interactionFromId('note_fan')
    )) as IInteraction<ITextModalConfiguration>;
    const loveDialog = (await page.evaluate(() =>
      window.ApptentiveSDK.logicEngine.interactionFromId('love_dialog')
    )) as IInteraction<ILoveDialogConfiguration>;

    await page
      .locator('id=apptentive-love-dialog-love_dialog' as any)
      .getByText(loveDialog.configuration.yes_text)
      .click();

    const noteSelector = await page.waitForSelector('apptentive-note');
    expect(noteSelector).not.toBeNull();

    const note = await page.locator('id=apptentive-note-note_fan' as any);
    expect(note).toBeVisible();
    expect(note.getByText(noteInteraction.configuration.title)).toBeVisible();
    expect(note.getByText(noteInteraction.configuration.body)).toBeVisible();
    expect(note.getByText(noteInteraction.configuration.actions[0].label)).toBeVisible();
    expect(note.getByText(noteInteraction.configuration.actions[1].label)).toBeVisible();

    const codePointFromStorage = await getFieldFromLocalStorage(page, 'code_point');
    const ldSmbtEvent = codePointFromStorage['com.apptentive#EnjoymentDialog#yes'];
    const noteLaubchEvent = codePointFromStorage['com.apptentive#TextModal#launch'];
    expect(ldSmbtEvent.invokes).toEqual(defaultInvoke);
    expect(noteLaubchEvent.invokes).toEqual(defaultInvoke);
  });

  test('on NO click', async ({ page }) => {
    const surveyInteraction = (await page.evaluate(() =>
      window.ApptentiveSDK.logicEngine.interactionFromId('survey_list')
    )) as IInteraction<ISurveyBranchedConfiguration>;
    const loveDialog = (await page.evaluate(() =>
      window.ApptentiveSDK.logicEngine.interactionFromId('love_dialog')
    )) as IInteraction<ILoveDialogConfiguration>;

    await page
      .locator('id=apptentive-love-dialog-love_dialog' as any)
      .getByText(loveDialog.configuration.no_text)
      .click();

    const surveySelector = await page.waitForSelector('apptentive-survey');
    expect(surveySelector).not.toBeNull();

    const survey = await page.locator('id=apptentive-survey-survey_list' as any);
    expect(survey).toBeVisible();
    expect(survey.getByText(surveyInteraction.configuration.name)).toBeVisible();
    expect(survey.getByText(surveyInteraction.configuration.description)).toBeVisible();
    expect(survey.getByText(getQuestion(surveyInteraction.configuration, 0, 0).value)).toBeVisible();
    expect(survey.getByText(getQuestion(surveyInteraction.configuration, 0, 1).value)).toBeVisible();
    expect(survey.getByText(getQuestion(surveyInteraction.configuration, 1, 0).value)).toBeVisible();
    expect(survey.getByText(getQuestion(surveyInteraction.configuration, 2, 0).value)).toBeVisible();
    expect(survey.getByText(getQuestion(surveyInteraction.configuration, 3, 0).value)).toBeVisible();
    expect(survey.getByText(getQuestion(surveyInteraction.configuration, 4, 0).value)).toBeVisible();
    expect(survey.getByText(getQuestion(surveyInteraction.configuration, 5, 0).value)).toBeVisible();
    expect(survey.getByText(getQuestion(surveyInteraction.configuration, 6, 0).value)).toBeVisible();
    expect(survey.getByText(getQuestion(surveyInteraction.configuration, 7, 0).value)).toBeVisible();
    expect(survey.getByText(surveyInteraction.configuration.disclaimer_text as string)).toBeVisible();
    expect(survey.getByText(getQuestionSet(surveyInteraction.configuration, 7).button_text)).toBeVisible();

    const codePointFromStorage = await getFieldFromLocalStorage(page, 'code_point');
    const ldSmbtEvent = codePointFromStorage['com.apptentive#EnjoymentDialog#no'];
    const surveyLaunchEvent = codePointFromStorage['com.apptentive#Survey#launch'];
    expect(ldSmbtEvent.invokes).toEqual(defaultInvoke);
    expect(surveyLaunchEvent.invokes).toEqual(defaultInvoke);
  });

  test('on CLOSE click', async ({ page }) => {
    await page
      .locator('id=apptentive-love-dialog-love_dialog' as any)
      .getByText('✕')
      .click();
    const codePointFromStorage = await getFieldFromLocalStorage(page, 'code_point');
    const ldCancelEvent = codePointFromStorage['com.apptentive#EnjoymentDialog#cancel'];
    expect(ldCancelEvent.invokes).toEqual(defaultInvoke);
  });
});
