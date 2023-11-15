import { test, expect } from '@playwright/test';
import type ApptentiveBase from '../../src/base';
import { TEST_URL, createConversation, defaultInvoke, getFieldFromLocalStorage } from './utils';
import { IInteraction } from '../../src/interfaces/manifest/IInteraction';
import { ITextModalConfiguration } from '../../src/interfaces/interactions/ITextModalConfiguration';

declare global {
  interface Window {
    ApptentiveSDK: ApptentiveBase;
  }
}

test.describe('Note', () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(1000);
    await page.goto(TEST_URL);
    await page.evaluate(() => window.ApptentiveSDK.reset());
    await createConversation(page);

    const note = (await page.evaluate(() => {
      window.ApptentiveSDK.engage('com.apptentive#EnjoymentDialog#yes');
      return window.ApptentiveSDK.logicEngine.interactionFromId('note_fan');
    })) as IInteraction<ITextModalConfiguration>;

    const noteSelector = await page.waitForSelector('apptentive-note');
    expect(noteSelector).not.toBeNull();

    const getNoteModal = () => page.locator('id=apptentive-note-note_fan' as any);

    expect(getNoteModal().getByText(note.configuration.title)).toBeVisible();
    expect(getNoteModal().getByText(note.configuration.body)).toBeVisible();
    expect(getNoteModal().getByText(note.configuration.actions[0].label)).toBeVisible();
    expect(getNoteModal().getByText(note.configuration.actions[1].label)).toBeVisible();

    const codePointFromStorage = await getFieldFromLocalStorage(page, 'code_point');
    const ldSmbtEvent = codePointFromStorage['com.apptentive#EnjoymentDialog#yes'];
    const noteLaubchEvent = codePointFromStorage['com.apptentive#TextModal#launch'];
    expect(ldSmbtEvent.invokes).toEqual(defaultInvoke);
    expect(noteLaubchEvent.invokes).toEqual(defaultInvoke);
  });

  test('on DISMIS click', async ({ page }) => {
    const note = (await page.evaluate(() =>
      window.ApptentiveSDK.logicEngine.interactionFromId('note_fan')
    )) as IInteraction<ITextModalConfiguration>;

    await page
      .locator('id=apptentive-note-note_fan' as any)
      .getByText(note.configuration.actions[0].label)
      .click();

    const codePointFromStorage = await getFieldFromLocalStorage(page, 'code_point');
    const noteDismisEvent = codePointFromStorage['com.apptentive#TextModal#dismiss'];
    expect(noteDismisEvent.invokes).toEqual(defaultInvoke);
  });

  test('on SUBMIT click', async ({ page }) => {
    const note = (await page.evaluate(() =>
      window.ApptentiveSDK.logicEngine.interactionFromId('note_fan')
    )) as IInteraction<ITextModalConfiguration>;

    await page
      .locator('id=apptentive-note-note_fan' as any)
      .getByText(note.configuration.actions[1].label)
      .click();

    const codePointFromStorage = await getFieldFromLocalStorage(page, 'code_point');
    const noteSmbtEvent = codePointFromStorage['com.apptentive#TextModal#interaction'];
    const surveyLaunchEvent = codePointFromStorage['com.apptentive#Survey#launch'];
    expect(noteSmbtEvent.invokes).toEqual(defaultInvoke);
    expect(surveyLaunchEvent.invokes).toEqual(defaultInvoke);

    const surveySelector = await page.waitForSelector('apptentive-survey');
    expect(surveySelector).not.toBeNull();
  });
});
