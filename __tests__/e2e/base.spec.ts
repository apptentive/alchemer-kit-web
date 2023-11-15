import { test, expect } from '@playwright/test';
import type ApptentiveBase from '../../src/base';
import { TEST_URL, createConversation, getMockedStore, reloadPage } from './utils';

declare global {
  interface Window {
    ApptentiveSDK: ApptentiveBase;
  }
}

test('properly opens test environment', async ({ page }) => {
  await page.goto(TEST_URL);

  await expect(page).toHaveTitle(/Playwright Testing App/);
});

test('properly restores conversation on page reload', async ({ page }) => {
  await page.goto(TEST_URL);

  const conversation = await createConversation(page);

  await reloadPage(page);

  const restoredConversation = await page.evaluate(() => window.ApptentiveSDK.conversation);

  expect(restoredConversation).toEqual(conversation);
});

test('properly reads in options from localStorage', async ({ page }) => {
  const optionOverrides = {
    apiVersion: 13,
    captureDisabled: true,
    customStyles: true,
    debug: true,
    force_refresh: true,
    readOnly: true,
    skipStyles: true,
  };

  await page.goto(TEST_URL);
  await createConversation(page);
  await page.evaluate(
    (options) => window.localStorage.setItem('ApptentiveSDKOptions', JSON.stringify(options)),
    optionOverrides
  );
  await reloadPage(page);

  const options = await page.evaluate(() => window.ApptentiveSDK.options);

  expect(options.apiVersion).toBe(optionOverrides.apiVersion);
  expect(options.captureDisabled).toBe(optionOverrides.captureDisabled);
  expect(options.customStyles).toBe(optionOverrides.customStyles);
  expect(options.debug).toBe(optionOverrides.debug);
  expect(options.force_refresh).toBe(optionOverrides.force_refresh);
  expect(options.readOnly).toBe(optionOverrides.readOnly);
  expect(options.skipStyles).toBe(optionOverrides.skipStyles);
});

test('properly parses interaction query string', async ({ page }) => {
  await page.goto(`${TEST_URL}?interactionId=survey_paged_short`);
  await createConversation(page);

  const element = await page.waitForSelector('apptentive-survey');

  expect(element).not.toBeNull();
});

test('properly restores event data on reload', async ({ page }) => {
  const codePoints = {
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
  };

  await page.goto(TEST_URL);
  await createConversation(page);
  await page.evaluate(
    (data) => window.localStorage.setItem('Apptentive', JSON.stringify(data)),
    getMockedStore({ code_point: codePoints })
  );
  await reloadPage(page);

  const restoredCodePoints = await page.evaluate(() => window.ApptentiveSDK.logicEngine.code_point);

  expect(restoredCodePoints).toEqual(codePoints);
});
