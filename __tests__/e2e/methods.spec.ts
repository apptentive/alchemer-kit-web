import { test, expect } from '@playwright/test';
import type ApptentiveBase from '../../src/base';
import { IConversation } from '../../src/interfaces/data/IConversation';
import { IAppRelease } from '../../src/interfaces/data/IAppRelease';
import {
  TEST_URL,
  createConversation,
  getDateFormat,
  getFieldFromLocalStorage,
  getMockedStore,
  reloadPage,
} from './utils';
import { IIdentifyPersonOptions } from '../../src/interfaces/options/IIdentifyPersonOptions';
import { ICreateMessageOptions } from '../../src/interfaces/options/ICreateMessageOptions';
import { IPerson } from '../../src/interfaces/data/IPerson';
import { IDevice } from '../../src/interfaces/data/IDevice';
import { IInteraction, InteractionConfiguration } from '../../src/interfaces/manifest/IInteraction';

declare global {
  interface Window {
    ApptentiveSDK: ApptentiveBase;
  }
}

test.describe('SDK methods', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(TEST_URL);
    await page.evaluate(() => window.ApptentiveSDK.reset());
  });

  test('setOption', async ({ page }) => {
    // call with empty key
    await page.evaluate(() => {
      window.ApptentiveSDK.setOption('', 'value1');
    });
    const setOptionResult1 = await page.evaluate(() => window.ApptentiveSDK.options.key1);
    expect(setOptionResult1).toEqual(undefined);

    // call with valid key and update
    await page.evaluate(() => {
      window.ApptentiveSDK.setOption('key1', 'value1');
    });
    const setOption2 = await page.evaluate(() => window.ApptentiveSDK.options.key1);
    expect(setOption2).toEqual('value1');
    await page.evaluate(() => {
      window.ApptentiveSDK.setOption('key1', 'value2');
    });
    const setOption3 = await page.evaluate(() => window.ApptentiveSDK.options.key1);
    expect(setOption3).toEqual('value2');
  });

  test('conversationSuccess', async ({ page }) => {
    const testConversation = await page.evaluate(() => {
      const testConv: IConversation = {
        state: 'new',
        id: '1678988699224',
        device_id: '1678988699225',
        person_id: '1678988699226',
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
      };
      window.ApptentiveSDK.conversationSuccess(testConv);
      return testConv;
    });

    const conv = await page.evaluate(() => window.ApptentiveSDK.conversation);
    expect(conv).toEqual(testConversation);

    const conversationFromStorage = await getFieldFromLocalStorage(page, 'conversation');
    expect(conversationFromStorage).toEqual(testConversation);
  });

  test('updateConversation', async ({ page }) => {
    let conversation: IConversation;

    // init
    conversation = await createConversation(page);
    expect(conversation.app_release).toEqual({
      sdk_version: '0.5.0',
      type: 'web',
    });

    // update
    await page.evaluate(() =>
      window.ApptentiveSDK.updateConversation({ app_release: { version: '007' } as IAppRelease })
    );
    conversation = await page.evaluate(() => window.ApptentiveSDK.conversation);
    expect(conversation.app_release).toEqual({ version: '007' });

    const conversationFromStorage = await getFieldFromLocalStorage(page, 'conversation');
    expect(conversationFromStorage).toEqual(conversation);
  });

  test('identifyPerson', async ({ page }) => {
    const errorConversation = new Error('Attempted to identify a Person before a conversation was created.');
    const errorToken = new Error(
      'You cannot identify a person without a valid person object and a valid unique_token.'
    );

    let res: any = await page.evaluate(() => window.ApptentiveSDK.identifyPerson(null as any));
    expect(res).toEqual(errorConversation.message);

    await createConversation(page);
    res = await page.evaluate(() =>
      window.ApptentiveSDK.identifyPerson({ unique_token: '', id: '' } as IIdentifyPersonOptions)
    );
    expect(res).toEqual(errorToken.message);

    const person = await page.evaluate(() =>
      window.ApptentiveSDK.identifyPerson({
        ...window.ApptentiveSDK.conversation.person,
        name: 'test-name',
        unique_token: window.ApptentiveSDK.conversation.token,
      } as IIdentifyPersonOptions).then(() => window.ApptentiveSDK.logicEngine.person as IPerson)
    );
    expect(person.name).toEqual('test-name');

    const personFromStorage = await getFieldFromLocalStorage(page, 'person');
    expect(personFromStorage).toEqual(person);
  });

  test('updatePerson', async ({ page }) => {
    const error = new Error(
      'You cannot update a person without a valid person (email, name) and a valid Conversation token.'
    );

    const res: any = await page.evaluate(() => window.ApptentiveSDK.updatePerson(null as any));
    expect(res).toEqual(error.message);

    await createConversation(page);

    await page.evaluate(() =>
      window.ApptentiveSDK.identifyPerson({
        ...window.ApptentiveSDK.conversation.person,
        name: 'test-name',
        email: 'test-email',
        unique_token: window.ApptentiveSDK.conversation.token,
      } as IIdentifyPersonOptions)
    );

    const person = await page.evaluate(() =>
      window.ApptentiveSDK.updatePerson({
        ...window.ApptentiveSDK.conversation.person,
        name: 'updated-name',
        email: 'updated-email',
      }).then(() => window.ApptentiveSDK.logicEngine.person as IPerson)
    );

    expect(person.name).toEqual('updated-name');
    expect(person.email).toEqual('updated-email');

    const personFromStorage = await getFieldFromLocalStorage(page, 'person');
    expect(personFromStorage).toEqual(person);
  });

  test('updateDevice', async ({ page }) => {
    const testDevice: IDevice = {
      'test-key': 'test-value',
      browser_height: 100500,
      browser_width: 100500,
      cookie_enabled: true,
      browser_languages: ['en', 'ukr'],
      locale_language_code: 'en',
      locale_raw: '',
      user_agent: '',
      browser_vendor: '',
      screen_width: 100500,
      screen_height: 100500,
      orientation_angle: 0,
      orientation_type: 'landscape-primary',
      uuid: 'test-id',
      custom_data: {},
      os_name: 'MacOS',
    };

    const error = new Error('You cannot update a device without a valid Conversation token.');

    const res: any = await page.evaluate(() => window.ApptentiveSDK.updateDevice(null as any));
    expect(res).toEqual(error.message);

    await createConversation(page);
    const device: IDevice = await page.evaluate(() =>
      window.ApptentiveSDK.updateDevice({
        'test-key': 'test-value',
        browser_height: 100500,
        browser_width: 100500,
        cookie_enabled: true,
        browser_languages: ['en', 'ukr'],
        locale_language_code: 'en',
        locale_raw: '',
        user_agent: '',
        browser_vendor: '',
        screen_width: 100500,
        screen_height: 100500,
        orientation_angle: 0,
        orientation_type: 'landscape-primary',
        uuid: 'test-id',
        custom_data: {},
        os_name: 'MacOS',
      }).then(() => window.ApptentiveSDK.logicEngine.device)
    );
    expect(device).toEqual(testDevice);

    const deviceFromStorage = await getFieldFromLocalStorage(page, 'device');
    expect(deviceFromStorage).toEqual(device);
  });

  test('engage', async ({ page }) => {
    const codePoints = {
      'com.apptentive#app#init': {
        invokes: {
          total: 1,
          version: 1,
          build: 1,
        },
        last_invoked_at: 1685447631705,
      },
      'com.apptentive#app#launch': {
        invokes: {
          total: 1,
          version: 1,
          build: 1,
        },
        last_invoked_at: 1685447631705,
      },
    };

    await page.evaluate(
      (data) => window.localStorage.setItem('Apptentive', JSON.stringify(data)),
      getMockedStore({ code_point: codePoints })
    );

    // check before first engage
    let codePointFromStorage = await getFieldFromLocalStorage(page, 'code_point');
    expect(codePointFromStorage).toEqual(codePoints);

    await page.evaluate(() => window.ApptentiveSDK.engage(''));

    // check after failed engage
    codePointFromStorage = await getFieldFromLocalStorage(page, 'code_point');
    expect(codePointFromStorage).toEqual(codePoints);

    await reloadPage(page);
    await page.evaluate(() => window.ApptentiveSDK.engage('test-event'));

    // check after successful engage
    codePointFromStorage = await getFieldFromLocalStorage(page, 'code_point');
    let testEvent = codePointFromStorage['local#app#test-event'];
    expect(testEvent.invokes).toEqual({
      build: 1,
      total: 1,
      version: 1,
    });

    await reloadPage(page);
    await page.evaluate(() => window.ApptentiveSDK.engage('test-event'));

    // check after another successful engage
    codePointFromStorage = await getFieldFromLocalStorage(page, 'code_point');
    testEvent = codePointFromStorage['local#app#test-event'];
    expect(testEvent.invokes).toEqual({
      build: 2,
      total: 2,
      version: 2,
    });
  });

  test('canShowInteraction', async ({ page }) => {
    let canShowInteraction = await page.evaluate(() => window.ApptentiveSDK.canShowInteraction('test-event'));

    await page.evaluate(() => {
      window.ApptentiveSDK.logicEngine.targeted_events = {
        'local#app#test-event': [
          {
            criteria: {},
            interaction_id: '55bffcd3e1c388521a000bd0',
          },
        ],
      };
      window.ApptentiveSDK.logicEngine.interactions = [
        {
          type: 'EnjoymentDialog',
          id: '55bffcd3e1c388521a000bd0',
          configuration: {
            no_text: 'No',
            title: 'Do you love Apptentive Test App?',
            yes_text: 'Yes',
          },
          version: 1,
        } as IInteraction<InteractionConfiguration>,
      ];
    });

    canShowInteraction = await page.evaluate(() => window.ApptentiveSDK.canShowInteraction('test-event'));
    expect(canShowInteraction).toEqual(true);
  });

  test('loadInteraction', async ({ page }) => {
    let loadedInteraction = await page.evaluate(() => window.ApptentiveSDK.loadInteraction(''));
    expect(loadedInteraction).toEqual(undefined);

    await page.evaluate(() => {
      window.ApptentiveSDK.logicEngine.interactions = [
        {
          type: 'EnjoymentDialog',
          id: '55bffcd3e1c388521a000bd0',
          configuration: {
            no_text: 'No',
            title: 'Do you love Apptentive Test App?',
            yes_text: 'Yes',
          },
          version: 1,
        } as IInteraction<InteractionConfiguration>,
      ];
    });

    loadedInteraction = await page.evaluate(() => window.ApptentiveSDK.loadInteraction('55bffcd3e1c388521a000bd0'));
    expect(loadedInteraction).toEqual({
      type: 'EnjoymentDialog',
      id: '55bffcd3e1c388521a000bd0',
      configuration: {
        no_text: 'No',
        title: 'Do you love Apptentive Test App?',
        yes_text: 'Yes',
      },
      version: 1,
    });
  });

  test('fetchManifest and cacheManifest', async ({ page }) => {
    const testManifest = { locale: 'ja', response: { title: 'test-manifest' } };
    const error = new Error('Attempted to fetch Conversation Manifest without a locale.');

    const err = await page.evaluate(() => window.ApptentiveSDK.fetchManifest(''));
    expect(error.message).toEqual(err);

    const res = await page.evaluate(() => {
      const sdk = window.ApptentiveSDK as any;
      sdk.ajax.fetchManifest = async () =>
        Promise.resolve({
          title: 'test-manifest',
        } as any);
      return sdk.fetchManifest('ja');
    });
    expect(res).toEqual(testManifest);

    await page.evaluate(() => window.ApptentiveSDK.cacheManifest("{ title: 'test-manifest' }"));
    const manifestCache = await page.evaluate(() => window.sessionStorage.getItem('apptentiveCachedManifest') as any);
    expect(manifestCache).toEqual("{ title: 'test-manifest' }");

    const cachedTime = await page.evaluate(() => window.sessionStorage.getItem('apptentiveCacheExpiration') as any);
    const expExpirationDate = new Date();
    expExpirationDate.setMinutes(expExpirationDate.getMinutes() + 30);
    const gotExpirationDate = new Date();
    gotExpirationDate.setTime(cachedTime);
    expect(getDateFormat(expExpirationDate)).toEqual(getDateFormat(gotExpirationDate));
  });

  test('restoreOrFetchManifest', async ({ page }) => {
    const oldIntId = '55bffcd3e1c388521a000bd0';
    const newIntId = '55bffcd3e1c388521a000bd1';
    const cachedManifest = {
      title: 'old-manifest',
      interactions: [
        {
          type: 'EnjoymentDialog',
          id: oldIntId,
          configuration: {
            no_text: 'No',
            title: 'Do you love Apptentive Test App?',
            yes_text: 'Yes',
          },
          version: 1,
        },
      ],
      targets: {
        'local#app#test-event': [
          {
            criteria: {},
            interaction_id: oldIntId,
          },
        ],
      },
    };
    const fetchedManifest = {
      title: 'new-manifest',
      interactions: [
        {
          type: 'EnjoymentDialog',
          id: newIntId,
          configuration: {
            no_text: 'No',
            title: 'Do you love Apptentive Test App?',
            yes_text: 'Yes',
          },
          version: 1,
        },
      ],
      targets: {
        'local#app#test-event': [
          {
            criteria: {},
            interaction_id: newIntId,
          },
        ],
      },
    };

    // mock fetchManifest to return new manifest
    await page.evaluate(() => {
      const sdk = window.ApptentiveSDK as any;
      sdk.ajax.fetchManifest = async () =>
        Promise.resolve({
          title: 'new-manifest',
          interactions: [
            {
              type: 'EnjoymentDialog',
              id: '55bffcd3e1c388521a000bd1',
              configuration: {
                no_text: 'No',
                title: 'Do you love Apptentive Test App?',
                yes_text: 'Yes',
              },
              version: 1,
            },
          ],
          targets: {
            'local#app#test-event': [
              {
                criteria: {},
                interaction_id: '55bffcd3e1c388521a000bd1',
              },
            ],
          },
        });
    });

    // save old manifest in cache and configure interactions / targets
    await page.evaluate(() => {
      window.ApptentiveSDK.cacheManifest(
        JSON.stringify({
          title: 'old-manifest',
          interactions: [
            {
              type: 'EnjoymentDialog',
              id: '55bffcd3e1c388521a000bd0',
              configuration: {
                no_text: 'No',
                title: 'Do you love Apptentive Test App?',
                yes_text: 'Yes',
              },
              version: 1,
            },
          ],
          targets: {
            'local#app#test-event': [
              {
                criteria: {},
                interaction_id: '55bffcd3e1c388521a000bd0',
              },
            ],
          },
        })
      );

      window.ApptentiveSDK.logicEngine.targeted_events = {
        'local#app#test-event': [
          {
            criteria: {},
            interaction_id: '55bffcd3e1c388521a000bd0',
          },
        ],
      };
      window.ApptentiveSDK.logicEngine.interactions = [
        {
          type: 'EnjoymentDialog',
          id: '55bffcd3e1c388521a000bd0',
          configuration: {
            no_text: 'No',
            title: 'Do you love Apptentive Test App?',
            yes_text: 'Yes',
          },
          version: 1,
        } as IInteraction<InteractionConfiguration>,
      ];
    });

    // get manifest from cache
    let cachedTime = await page.evaluate(() => {
      const expExpiratDate = new Date();
      expExpiratDate.setMinutes(expExpiratDate.getMinutes() + 30);

      window.sessionStorage.setItem('apptentiveCacheExpiration', String(expExpiratDate.valueOf()));
      return window.sessionStorage.getItem('apptentiveCacheExpiration') as any;
    });

    let expExpirationDate = new Date();
    expExpirationDate.setMinutes(expExpirationDate.getMinutes() + 30);
    let gotExpirationDate = new Date();
    gotExpirationDate.setTime(cachedTime);
    expect(getDateFormat(expExpirationDate)).toEqual(getDateFormat(gotExpirationDate));

    const manifestCache = await page.evaluate(() => {
      window.ApptentiveSDK.restoreOrFetchManifest(null);
      return JSON.parse(window.sessionStorage.getItem('apptentiveCachedManifest') as any);
    });
    let cachedEvents = await page.evaluate(() => window.ApptentiveSDK.logicEngine.targeted_events);
    let cachedInteractions = await page.evaluate(() => window.ApptentiveSDK.logicEngine.interactions);

    expect(manifestCache).toEqual(cachedManifest);
    expect(cachedEvents).toEqual(cachedManifest.targets);
    expect(cachedInteractions).toEqual(cachedManifest.interactions);

    // get new manifest
    cachedTime = await page.evaluate(() => {
      const expExpiratDate = new Date();
      expExpiratDate.setMinutes(expExpiratDate.getMinutes() - 31);

      window.sessionStorage.setItem('apptentiveCacheExpiration', String(expExpiratDate.valueOf()));
      return window.sessionStorage.getItem('apptentiveCacheExpiration') as any;
    });
    expExpirationDate = new Date();
    expExpirationDate.setMinutes(expExpirationDate.getMinutes() - 31);
    gotExpirationDate = new Date();
    gotExpirationDate.setTime(cachedTime);
    expect(getDateFormat(expExpirationDate)).toEqual(getDateFormat(gotExpirationDate));

    await page.evaluate(() => window.ApptentiveSDK.restoreOrFetchManifest(null));
    cachedEvents = await page.evaluate(() => window.ApptentiveSDK.logicEngine.targeted_events);
    cachedInteractions = await page.evaluate(() => window.ApptentiveSDK.logicEngine.interactions);
    expect(cachedEvents).toEqual(fetchedManifest.targets);
    expect(cachedInteractions).toEqual(fetchedManifest.interactions);
  });

  test('createMessage', async ({ page }) => {
    const err = new Error('A message cannot be sent before a conversation is created');
    let res = await page.evaluate(() =>
      window.ApptentiveSDK.createMessage({ body: 'test-msg', custom_data: {} } as ICreateMessageOptions)
    );

    expect(res).toEqual(err.message);

    await createConversation(page);
    res = await page.evaluate(() =>
      window.ApptentiveSDK.createMessage({
        body: 'test-msg',
        custom_data: { 'test-key': 'test-value' },
      } as ICreateMessageOptions)
    );

    expect(res).toEqual('');
  });

  test('reset', async ({ page }) => {
    await page.evaluate(() => window.ApptentiveSDK.fetchManifest('ja'));
    await createConversation(page);
    await page.evaluate(() => window.ApptentiveSDK.reset());
    const sdk = await page.evaluate(() => window.ApptentiveSDK as any);

    expect(sdk.ajax._apiToken).toEqual('FAKE_API_TOKEN');
    expect(sdk.ajax._conversationId).toEqual('');
    expect(sdk._logicEngine.code_point).toEqual({});

    const config = await page.evaluate(() => JSON.parse(window.localStorage.getItem('Apptentive') as string));
    expect(config.items).toEqual({});
    expect(config.keys).toEqual([]);

    const cachedTime = await page.evaluate(() => window.sessionStorage.getItem('apptentiveCacheExpiration'));
    expect(cachedTime).toEqual(null);

    const cachedManifest = await page.evaluate(() => window.sessionStorage.getItem('apptentiveCachedManifest'));
    expect(cachedManifest).toEqual(null);
  });
});
