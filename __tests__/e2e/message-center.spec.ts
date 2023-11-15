import { test, expect, Page } from '@playwright/test';
import type ApptentiveBase from '../../src/base';
import { TEST_URL, createConversation, defaultInvoke, getFieldFromLocalStorage } from './utils';
import { IInteraction } from '../../src/interfaces/manifest/IInteraction';
import { IMessageCenterConfiguration } from '../../src/interfaces/interactions/IMessageCenterConfiguration';

declare global {
  interface Window {
    ApptentiveSDK: ApptentiveBase;
  }
}

const getMsgCenterModal = (page: Page) => page.locator('id=apptentive-message-center-message_center_full' as any);

test.describe('Message Center', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(TEST_URL);
    await page.evaluate(() => window.ApptentiveSDK.reset());
    await createConversation(page);

    const msgCenter = (await page.evaluate(() => {
      window.ApptentiveSDK.engage('local#app#messageCenterFull');
      return window.ApptentiveSDK.logicEngine.interactionFromId('message_center_full');
    })) as IInteraction<IMessageCenterConfiguration>;

    const msgCenterSelector = await page.waitForSelector('apptentive-message-center');
    expect(msgCenterSelector).not.toBeNull();

    expect(getMsgCenterModal(page).getByText(msgCenter.configuration.title)).toBeVisible();
    expect(getMsgCenterModal(page).getByText(msgCenter.configuration.automated_message.body)).toBeVisible();
    expect(getMsgCenterModal(page).getByText(msgCenter.configuration.greeting.title)).toBeVisible();
    expect(getMsgCenterModal(page).getByText(msgCenter.configuration.greeting.body)).toBeVisible();
    expect(getMsgCenterModal(page).getByText(msgCenter.configuration.profile.initial.title)).toBeVisible();

    const codePointFromStorage = await getFieldFromLocalStorage(page, 'code_point');
    const mcTriggerEvent = codePointFromStorage['local#app#messageCenterFull'];
    const mcLaunchEvent = codePointFromStorage['com.apptentive#MessageCenter#launch'];
    expect(mcTriggerEvent.invokes).toEqual(defaultInvoke);
    expect(mcLaunchEvent.invokes).toEqual(defaultInvoke);
  });

  test('on CLOSE click', async ({ page }) => {
    await page.locator('id=message-center__action--close' as any).click();
    const codePointFromStorage = await getFieldFromLocalStorage(page, 'code_point');
    const mcCloseEvent = codePointFromStorage['com.apptentive#MessageCenter#close'];
    expect(mcCloseEvent.invokes).toEqual(defaultInvoke);
  });

  test('on MINIMIZE/MAXIMIZE click', async ({ page }) => {
    await expect(getMsgCenterModal(page)).toHaveClass('fixed corner');
    await page.locator('id=message-center__action--minimize' as any).click();
    await expect(getMsgCenterModal(page)).toHaveClass('fixed corner corner--minimized');
    await page.locator('id=message-center__action--minimize' as any).click();
    await expect(getMsgCenterModal(page)).toHaveClass('fixed corner');
  });

  test('on SUBMIT click', async ({ page }) => {
    const msgCenter = (await page.evaluate(() =>
      window.ApptentiveSDK.logicEngine.interactionFromId('message_center_full')
    )) as IInteraction<IMessageCenterConfiguration>;
    const msgText = 'test feedback message';
    const emailText = 'test-email@google.com';
    const nameText = 'test-name';

    const msgField = await getMsgCenterModal(page).getByPlaceholder('Please leave detailed feedback');
    const emailField = await getMsgCenterModal(page).getByPlaceholder('Email');
    const nameField = await getMsgCenterModal(page).getByPlaceholder('Name');

    await msgField.fill(msgText);
    await emailField.fill(emailText);
    await nameField.fill(nameText);

    await getMsgCenterModal(page).getByRole('button', { name: 'Send' }).click();
    await expect(getMsgCenterModal(page).getByText(msgCenter.configuration.status.body)).toBeVisible();
    await getMsgCenterModal(page).getByRole('button', { name: 'Close' }).last().click();

    const codePointFromStorage = await getFieldFromLocalStorage(page, 'code_point');
    const mcSendEvent = codePointFromStorage['com.apptentive#MessageCenter#send'];
    const mcCloseEvent = codePointFromStorage['com.apptentive#MessageCenter#close'];
    expect(mcSendEvent.invokes).toEqual(defaultInvoke);
    expect(mcCloseEvent.invokes).toEqual(defaultInvoke);
  });
});
