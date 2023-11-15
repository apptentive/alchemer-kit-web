import { HTTPError } from 'ky';
import { _appId, _host, _apiToken, _conversationToken, _conversationId } from '../mocks/data/shared-constants';

// This needs to be imported as a module so that it can be mocked properly
import * as DisplayModule from '../../src/display.ts';

import ApptentiveApi from '../../src/api.ts';
import ApptentiveBase from '../../src/base.ts';
import ApptentiveNavigateToLink from '../../src/interactions/navigate-to-link.ts';
import ApptentiveNote from '../../src/interactions/note.ts';
import ApptentiveMessageCenter from '../../src/interactions/message-center.ts';
import browserEvents from '../../src/constants/browser-events.ts';
import { localStorageKeys, sessionStorageKeys } from '../../src/constants/storageKeys.ts';

import { manifest } from '../mocks/data/survey-branched-manifest';
import ApptentiveBaseBuilder from '../mocks/builders/ApptentiveBaseBuilder';

jest.useFakeTimers().setSystemTime(new Date('2233-03-22'));

const cacheExpirationDate = new Date();
cacheExpirationDate.setMinutes(cacheExpirationDate.getMinutes() + 30);

const cacheExpirationTime = cacheExpirationDate.getTime().toString();
const _mockError = new Error('mock error');

const _mockPerson = {
  name: 'Suzy Creamcheese',
  email: 'suzy.creamcheese@apptentive.com',
};

const _mockDevice = {
  vendor: 'Apple',
  model: 'iPhone',
};

afterEach(() => {
  document.querySelectorAll('#apptentive-base-styles').forEach((node) => node.remove());
  document.querySelectorAll('#apptentive-custom-styles').forEach((node) => node.remove());

  // Clear local and session storage to remove any previous data from tests
  window.sessionStorage.clear();
  window.localStorage.clear();
});

describe('ApptentiveSDK Base', () => {
  describe('constructor', () => {
    test('should construct without issue', () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();
      expect(sdk instanceof ApptentiveBase).toBe(true);
    });

    test('should construct with default options', () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();

      expect(sdk.options.apiVersion).toBe(12);
      expect(sdk.options.captureDisabled).toBe(false);
      expect(sdk.options.customStyles).toBe(false);
      expect(sdk.options.debug).toBe(false);
      expect(sdk.options.force_refresh).toBe(false);
      expect(sdk.options.readOnly).toBe(false);
      expect(sdk.options.skipStyles).toBe(false);
    });

    test('should set debug to false if no option is passed in', () => {
      const { sdk } = new ApptentiveBaseBuilder()
        .useCachedManifest()
        .useOptions({ debug: null })
        .build()
        .withConversation();

      expect(sdk.debug).toBe(false);
    });

    test('should throw an error when no API Token is passed in', () => {
      const consoleSpy = jest.spyOn(window.console, 'error').mockImplementation();
      const { _sdk } = new ApptentiveBaseBuilder().useCachedManifest().useOptions({ token: null, debug: true }).build();

      expect(consoleSpy.mock.calls[0]).toEqual([
        '%c[Base]',
        'color: #ff414d;',
        'No API Token was provided, please check the Apptentive Dashboard for your API Token.',
      ]);

      consoleSpy.mockRestore();
    });

    test('should reset the appID when the appID differs in the DB', () => {
      const empty = jest.fn();
      const get = jest.fn().mockImplementation((key) => (key === 'captureDisabled' ? false : 'APP_ID_1'));
      const set = jest.fn();
      const db = { empty, get, set };

      const { sdk: _sdk1 } = new ApptentiveBaseBuilder()
        .useCachedManifest()
        .useOptions({ id: 'APP_ID_1', db })
        .build()
        .withConversation();

      expect(empty).not.toHaveBeenCalled();

      const { sdk: _sdk2 } = new ApptentiveBaseBuilder()
        .useCachedManifest()
        .useOptions({ id: 'APP_ID_2', db })
        .build()
        .withConversation();

      expect(empty).toHaveBeenCalledTimes(1);
    });

    test('should set the API token', () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();
      expect(sdk.options.token).toBe(_apiToken);
    });

    test('should set a date object', () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();
      expect(sdk._date).not.toBeFalsy();
    });

    test('should load settings from `ApptentiveSDKOptions` in localStorage when present', () => {
      window.localStorage.setItem('ApptentiveSDKOptions', '{ "test": "pass", "host": "fake" }');
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();

      expect(sdk.options.test).toBe('pass');
      expect(sdk.options.host).toBe('fake');
    });

    test('should emit error when localstorage is not available', (done) => {
      const mockSetItem = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw Error('No Storage');
      });

      const errorListener = (event) => {
        expect(event.detail.error).toBe(
          'LocalStorage is not available in this environment; the SDK cannot initialize.'
        );

        document.removeEventListener(browserEvents.APPTENTIVE_ERROR, errorListener);
        mockSetItem.mockRestore();

        done();
      };

      document.addEventListener(browserEvents.APPTENTIVE_ERROR, errorListener);

      const { _sdk } = new ApptentiveBaseBuilder().build();
    });

    test('should not throw an error when localStorage settings are invalid', () => {
      window.localStorage.setItem('ApptentiveSDKOptions', '{ "test": pass }');

      expect(() => {
        new ApptentiveBaseBuilder().build();
      }).not.toThrow();
    });

    test('should disable capture when captureDisabled option is passed in the options', () => {
      const { sdk } = new ApptentiveBaseBuilder()
        .useCachedManifest()
        .useOptions({ captureDisabled: true })
        .build()
        .withConversation();

      expect(sdk.captureDisabled).toBe(true);
    });

    test('should disable capture when captureDisabled is stored in localStorage', () => {
      window.localStorage.setItem('Apptentive', '{ "keys": ["captureDisabled"], "items": {"captureDisabled": true }}');
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();

      expect(sdk.captureDisabled).toBe(true);
    });

    test('should set the conversation to known default when readOnly is true', () => {
      window.localStorage.setItem('ApptentiveSDKOptions', '{ "readOnly": true }');
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().useOptions({ captureDisabled: true }).build();

      expect(sdk.conversation.id).toBe('READ-ONLY');
      expect(sdk.conversation.token).toBe('READ-ONLY');
    });

    test('should restore the conversation when stored in localStorage', () => {
      const _mockStorageData = {
        keys: ['conversation', 'app_id'],
        items: {
          app_id: 'this-is-a-test-websdk-app',
          conversation: {
            state: 'new',
            id: _conversationId,
            device_id: 1666889421159,
            person_id: 1666889421160,
            token: _apiToken,
          },
        },
      };

      window.localStorage.setItem('Apptentive', JSON.stringify(_mockStorageData));
      const { sdk } = new ApptentiveBaseBuilder().build();

      expect(sdk.conversation.id).toBe(_mockStorageData.items.conversation.id);
      expect(sdk.conversation.token).toBe(_mockStorageData.items.conversation.token);
    });

    test('should restore manifest when stored in sessionStorage', () => {
      const fetchManifestSpy = jest.spyOn(ApptentiveBase.prototype, 'fetchManifest');
      const { _sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();

      expect(fetchManifestSpy).not.toHaveBeenCalled();

      fetchManifestSpy.mockRestore();
    });

    test('should load manifest from API on initialization', () => {
      const fetchManifestSpy = jest.spyOn(ApptentiveBase.prototype, 'fetchManifest');
      const { _sdk } = new ApptentiveBaseBuilder().build().withConversation();

      expect(fetchManifestSpy).toHaveBeenCalledTimes(1);

      fetchManifestSpy.mockRestore();
    });

    test('should cache manifest when a new one is fetched', () => {
      const fetchManifestSpy = jest.spyOn(ApptentiveApi.prototype, 'fetchManifest').mockResolvedValue(manifest);
      const { _sdk } = new ApptentiveBaseBuilder().build().withConversation();

      expect(fetchManifestSpy).toHaveBeenCalledTimes(1);

      fetchManifestSpy.mockRestore();
    });

    test('should set a session_id GUID', () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();
      expect(sdk.session_id).toMatch(/[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[\da-f]{4}-[\da-f]{12}/);
    });

    test('should add calls to the queue if they were made before initialization', () => {
      const eventName = 'testEvent';

      window.ApptentiveSDK = [['engage', eventName]];
      window.ApptentiveSDK.LOADER_VERSION = '0.0.1';

      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build();

      expect(sdk.ajax.queue.length).toBe(1);
    });
  });

  describe('getters and setters', () => {
    test('properly gets and sets captureDisabled', () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();

      expect(sdk.captureDisabled).toBe(false);
      expect(sdk.db.get(localStorageKeys.captureDisabled)).toBeUndefined();

      sdk.captureDisabled = true;

      expect(sdk.captureDisabled).toBe(true);
      expect(sdk.db.get(localStorageKeys.captureDisabled)).toBe(true);
    });

    test('properly deletes setting when turning on capture', () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();
      sdk.captureDisabled = true;

      expect(sdk.db.get(localStorageKeys.captureDisabled)).toBe(true);

      sdk.captureDisabled = false;
      expect(sdk.db.get(localStorageKeys.captureDisabled)).toBeUndefined();
    });

    test('properly gets and sets debug', () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();

      expect(sdk.debug).toBe(false);

      sdk.debug = true;

      expect(sdk.debug).toBe(true);
      expect(sdk.i18n.debug).toBe(true);
      expect(sdk.ajax.debug).toBe(true);
    });

    test('properly gets and sets pageName', () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();

      expect(sdk.page_name).toBe('');

      sdk.page_name = 'Title';

      expect(sdk.page_name).toBe('Title');
      expect(sdk.ajax.pageName).toBe('Title');
    });

    test('properly gets and sets readOnly', () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();

      expect(sdk.readOnly).toBe(false);

      sdk.readOnly = true;

      expect(sdk.readOnly).toBe(true);
      expect(sdk.ajax.readOnly).toBe(true);
    });

    test('properly gets session_id', () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();

      expect(sdk.session_id).not.toBeFalsy();
    });
  });

  describe('utilityMethods', () => {
    test('setOption: should do nothing without a key', () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();
      expect(sdk.options.test).toBeUndefined();
      sdk.setOption('', 'test');
      expect(sdk.options.test).toBeUndefined();
    });

    test('setOption: should set an option value for a given key', () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();
      expect(sdk.options.test).toBeUndefined();

      sdk.setOption('test', 'test');
      expect(sdk.options.test).toBe('test');

      sdk.setOption('test', 'new');
      expect(sdk.options.test).toBe('new');
    });

    test('setOption: should use setter when key name is debug', () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();
      const debugSetterSpy = jest.spyOn(sdk, 'debug', 'set');
      sdk.setOption('debug', true);

      expect(sdk.debug).toBe(true);
      expect(debugSetterSpy).toHaveBeenCalledTimes(1);

      debugSetterSpy.mockRestore();
    });

    test('setOption: should use setter when key name is readOnly', () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();
      const readOnlySetterSpy = jest.spyOn(sdk, 'readOnly', 'set');
      sdk.setOption('readOnly', true);

      expect(sdk.readOnly).toBe(true);
      expect(readOnlySetterSpy).toHaveBeenCalledTimes(1);

      readOnlySetterSpy.mockRestore();
    });

    test('proxySetter: should call setter when readOnly is changed in the options object', () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();
      const readOnlySetterSpy = jest.spyOn(sdk, 'readOnly', 'set');

      sdk.options.readOnly = true;

      expect(sdk.readOnly).toBe(true);
      expect(readOnlySetterSpy).toHaveBeenCalledTimes(1);

      readOnlySetterSpy.mockRestore();
    });

    test('reset: should reset the SDK to the initial empty state', () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();
      expect(sdk.conversation.id).toBe(_conversationId);
      expect(sdk.conversation.token).toBe(_conversationToken);

      sdk.reset();

      expect(sdk.conversation).toEqual({});
    });

    test('doctor: can output diagnostic information without throwing', () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();

      expect(() => {
        sdk.doctor();
      }).not.toThrow();
    });

    test('parseInteractionQueryString: properly parses an interaction query string from the url', () => {
      // Replace the URL to have a query parameter on it to trigger the interaction
      window.history.replaceState(null, '', 'http://apptentive.com?interactionId=SURVEY_PAGED_ID');
      const displaySpy = jest.spyOn(DisplayModule, 'default');

      const { _sdk } = new ApptentiveBaseBuilder().useCachedManifest(manifest).build().withConversation();

      expect(displaySpy).toHaveBeenCalledTimes(1);
      expect(window.location.toString()).toBe('http://apptentive.com/');

      displaySpy.mockClear();
      window.history.replaceState(null, '', 'http://apptentive.com/');
    });

    test('parseInteractionQueryString: properly handles an invalid interaction id', () => {
      window.history.replaceState(null, '', 'http://apptentive.com/?interactionId=invalid_interaction');
      const displaySpy = jest.spyOn(DisplayModule, 'default');

      const { _sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();

      expect(displaySpy).toHaveBeenCalledTimes(0);
      expect(window.location.toString()).toBe('http://apptentive.com/?interactionId=invalid_interaction');

      displaySpy.mockClear();
      window.history.replaceState(null, '', 'http://apptentive.com/');
    });

    test('parseInteractionQueryString: properly initializes without an interaction query string', () => {
      const displaySpy = jest.spyOn(DisplayModule, 'default');

      const { _sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();

      expect(displaySpy).toHaveBeenCalledTimes(0);
      expect(window.location.toString()).toBe('http://apptentive.com/');

      displaySpy.mockClear();
    });
  });

  describe('canShowInteraction', () => {
    test('properly returns whether an interaction can be shown from an event', () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest(manifest).build().withConversation();
      const validEventName = sdk.canShowInteraction(Object.keys(manifest.targets)[0]);
      const invalidEventName = sdk.canShowInteraction('local#app#invalidEvent');

      expect(validEventName).toBe(true);
      expect(invalidEventName).toBe(false);
    });

    test('properly returns false when person does not meet the criteria', () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest(manifest).build().withConversation();
      const eventWithCriteria = sdk.canShowInteraction(Object.keys(manifest.targets)[1]);

      expect(eventWithCriteria).toBe(false);
    });
  });

  describe('createConversation', () => {
    test('properly loads the conversation with a past conversation', async () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();
      const conversationSuccessSpy = jest.spyOn(sdk, 'conversationSuccess');

      await sdk.createConversation();

      expect(conversationSuccessSpy.mock.calls[0]).toEqual([sdk.conversation]);

      conversationSuccessSpy.mockRestore();
    });

    test('properly creates a conversation without a past one', async () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build();
      const createConversationSpy = jest.spyOn(ApptentiveApi.prototype, 'createConversation').mockResolvedValue({});

      await sdk.createConversation();

      expect(createConversationSpy).toHaveBeenCalledTimes(1);

      createConversationSpy.mockRestore();
    });

    test('properly updates the person object if passed in', async () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build();
      const createConversationSpy = jest.spyOn(ApptentiveApi.prototype, 'createConversation').mockResolvedValue({});

      await sdk.createConversation({ person: _mockPerson });

      const args = createConversationSpy.mock.calls[0][0];
      expect(args.json.person).toEqual(_mockPerson);

      expect(sdk.logicEngine.person).toEqual(_mockPerson);
      expect(sdk.db.get('person')).toEqual(_mockPerson);

      createConversationSpy.mockRestore();
    });

    test('properly creates a conversation without a person object', async () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build();
      const createConversationSpy = jest.spyOn(ApptentiveApi.prototype, 'createConversation').mockResolvedValue({});

      await sdk.createConversation();

      expect(createConversationSpy).toHaveBeenCalledTimes(1);

      const args = createConversationSpy.mock.calls[0][0];
      expect(args.json.person).toBeUndefined();

      createConversationSpy.mockRestore();
    });

    test('properly creates a conversation with an app_release', async () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build();
      const createConversationSpy = jest.spyOn(ApptentiveApi.prototype, 'createConversation').mockResolvedValue({});

      await sdk.createConversation({
        app_release: { version: 1, build_number: 2 },
      });

      expect(createConversationSpy).toHaveBeenCalledTimes(1);

      const args = createConversationSpy.mock.calls[0][0];
      expect(args.json.app_release.version).toBe(1);
      expect(args.json.app_release.build_number).toBe(2);

      createConversationSpy.mockRestore();
    });

    test('properly calls a success callback when api request succeeds', async () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build();
      const createConversationSpy = jest.spyOn(ApptentiveApi.prototype, 'createConversation').mockResolvedValue({});
      const successSpy = jest.spyOn(sdk, 'conversationSuccess');
      const successCallback = jest.fn();

      await sdk.createConversation({ success: successCallback });

      expect(successSpy).toHaveBeenCalledTimes(1);
      expect(successCallback).toHaveBeenCalledTimes(1);
      expect(createConversationSpy).toHaveBeenCalledTimes(1);

      createConversationSpy.mockRestore();
      successSpy.mockRestore();
    });

    test('properly calls failure callback when api request fails', async () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build();
      const successSpy = jest.spyOn(sdk, 'conversationSuccess');
      const createConversationSpy = jest
        .spyOn(ApptentiveApi.prototype, 'createConversation')
        .mockRejectedValue(_mockError);

      const failureCallback = jest.fn();

      await sdk.createConversation({ failure: failureCallback });

      expect(successSpy).not.toHaveBeenCalled();
      expect(failureCallback).toHaveBeenCalledTimes(1);
      expect(createConversationSpy).toHaveBeenCalledTimes(1);

      createConversationSpy.mockRestore();
      successSpy.mockRestore();
    });

    test('properly skips conversation creation if SDK initialization failed', async () => {
      const storageSpy = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw Error('No Storage');
      });
      const { sdk } = new ApptentiveBaseBuilder().build();
      const createConversationSpy = jest.spyOn(ApptentiveApi.prototype, 'createConversation');
      const conversationResponse = await sdk.createConversation();

      expect(createConversationSpy).not.toHaveBeenCalled();
      expect(conversationResponse).toBeInstanceOf(Error);
      expect(conversationResponse.message).toBe(
        'SDK initialization failed and a conversation can not be created. Please check the logs for more details.'
      );

      createConversationSpy.mockRestore();
      storageSpy.mockRestore();
    });

    test('#conversationSuccess: should set a conversation', () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();
      sdk.conversationSuccess({ token: 'FAKE_TEST_TOKEN' });
      expect(sdk.conversation.token).toBe('FAKE_TEST_TOKEN');
    });

    test('#conversationSuccess: handles invalid responses', () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();
      expect(() => {
        sdk.conversationSuccess('ERROR');
      }).not.toThrow();
    });
  });

  describe('createMessage', () => {
    test('properly creates a message on the conversation', async () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();
      const createMessageSpy = jest.spyOn(ApptentiveApi.prototype, 'createMessage').mockResolvedValue({
        id: '123456',
        created_at: 123456789,
      });

      await sdk.createMessage({
        body: 'Hello!',
        custom_data: { cat: 'meow' },
      });

      expect(createMessageSpy).toHaveBeenCalledTimes(1);

      const args = createMessageSpy.mock.calls[0][0];
      expect(args.json.message.body).toBe('Hello!');
      expect(args.json.message.client_created_at).not.toBeUndefined();
      expect(args.json.message.client_created_at_utc_offset).not.toBeUndefined();
      expect(args.json.message.custom_data).toEqual({ cat: 'meow' });
      expect(args.json.message.session_id).toBe(sdk.session_id);
      expect(args.json.message.type).toBe('CompoundMessage');

      createMessageSpy.mockRestore();
    });

    test('properly calls the success callback when the api call succeeds', async () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();
      const successSpy = jest.spyOn(sdk, 'createMessageSuccess');
      const createMessageSpy = jest.spyOn(ApptentiveApi.prototype, 'createMessage').mockResolvedValue({
        id: '123456',
        created_at: 123456789,
      });
      const successCallback = jest.fn();

      await sdk.createMessage({ body: 'body', success: successCallback });

      expect(successCallback).toHaveBeenCalledTimes(1);
      expect(successSpy).toHaveBeenCalledTimes(1);
      expect(createMessageSpy).toHaveBeenCalledTimes(1);

      createMessageSpy.mockRestore();
      successSpy.mockRestore();
    });

    test('properly calls a failure callback when api call fails', async () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();
      const createMessageSpy = jest.spyOn(ApptentiveApi.prototype, 'createMessage').mockRejectedValue(_mockError);
      const successSpy = jest.spyOn(sdk, 'createMessageSuccess');
      const failureCallback = jest.fn();
      const response = await sdk.createMessage({ body: 'body', failure: failureCallback });

      expect(response).toEqual('mock error');
      expect(successSpy).not.toHaveBeenCalled();
      expect(failureCallback).toHaveBeenCalledTimes(1);
      expect(createMessageSpy).toHaveBeenCalledTimes(1);

      createMessageSpy.mockRestore();
      successSpy.mockRestore();
    });

    test('success callback properly sets the last_message to be the returned message', () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();
      sdk.debug = true;
      sdk.createMessageSuccess({ dog: 'woof' });

      expect(sdk.last_message).toEqual({
        dog: 'woof',
      });
    });

    test('success callback handles an invalid response', () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();
      expect(() => {
        sdk.createMessageSuccess('ERROR');
      }).not.toThrow();
    });
  });

  describe('updateConversation', () => {
    test('properly appends app_release data when passed in', async () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();
      const updateConversationSpy = jest.spyOn(ApptentiveApi.prototype, 'updateConversation').mockResolvedValue({});

      await sdk.updateConversation({
        app_release: { version: '1' },
      });

      expect(updateConversationSpy).toHaveBeenCalledTimes(1);

      const args = updateConversationSpy.mock.calls[0][0];
      expect(args.json.app_release).toEqual({ version: '1' });
      expect(args.json.id).toBe(_conversationId);

      updateConversationSpy.mockRestore();
    });

    test('properly calls api without app_release data being passed in', async () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();
      const updateConversationSpy = jest.spyOn(ApptentiveApi.prototype, 'updateConversation').mockResolvedValue({});

      await sdk.updateConversation();

      expect(updateConversationSpy).toHaveBeenCalledTimes(1);

      const args = updateConversationSpy.mock.calls[0][0];
      expect(args.json.app_release).toBeFalsy();
      expect(args.json.id).toBe(_conversationId);

      updateConversationSpy.mockRestore();
    });

    test('properly calls success callback when api request succeeds', async () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();
      const updateConversationSpy = jest.spyOn(ApptentiveApi.prototype, 'updateConversation').mockResolvedValue({
        sdk: {},
      });

      const successSpy = jest.spyOn(sdk, 'updateConversationSuccess');
      const successCallback = jest.fn();

      await sdk.updateConversation({ success: successCallback });
      expect(successSpy).toHaveBeenCalledTimes(1);
      expect(successCallback).toHaveBeenCalledTimes(1);
      expect(updateConversationSpy).toHaveBeenCalledTimes(1);

      updateConversationSpy.mockRestore();
      successSpy.mockRestore();
    });

    test('properly calls a failure callback when api call returns an error', async () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();
      const updateConversationSpy = jest
        .spyOn(ApptentiveApi.prototype, 'updateConversation')
        .mockRejectedValue(_mockError);

      const successSpy = jest.spyOn(sdk, 'updateConversationSuccess');
      const failureCallback = jest.fn();
      const response = await sdk.updateConversation({ failure: failureCallback });

      expect(response).toBeInstanceOf(Error);
      expect(successSpy).not.toHaveBeenCalled();
      expect(failureCallback).toHaveBeenCalledTimes(1);
      expect(updateConversationSpy).toHaveBeenCalledTimes(1);

      updateConversationSpy.mockRestore();
      successSpy.mockRestore();
    });

    test('properly updates the conversation with the new data when api call succeeds', async () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();
      await sdk.updateConversationSuccess({
        app_release: {
          version: '2',
        },
        sdk: {
          language: 'CoffeeScript',
        },
      });

      expect(sdk.conversation.app_release).toEqual({ version: '2' });
      expect(sdk.conversation.sdk).toEqual({ language: 'CoffeeScript' });
    });
  });

  describe('engage', () => {
    test('properly sends event when called', () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();
      const engageSpy = jest.spyOn(ApptentiveApi.prototype, 'createEvent').mockResolvedValue({});

      sdk.engage('eventTest');

      expect(engageSpy).toHaveBeenCalledTimes(1);

      engageSpy.mockRestore();
    });

    test('properly catches error when api call fails', () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();
      const engageSpy = jest.spyOn(ApptentiveApi.prototype, 'createEvent').mockRejectedValue(_mockError);

      expect(() => sdk.engage('eventTest')).not.toThrow();

      engageSpy.mockRestore();
    });

    test('properly skips event capture when captureDisabled is true', () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();
      const engageSpy = jest.spyOn(ApptentiveApi.prototype, 'createEvent');

      sdk.captureDisabled = true;
      sdk.engage('eventTest');

      expect(engageSpy).not.toHaveBeenCalled();

      engageSpy.mockRestore();
    });

    test('properly warns about events missing a label', () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();
      const consoleSpy = jest.spyOn(sdk, 'console');
      const engageSpy = jest.spyOn(ApptentiveApi.prototype, 'createEvent');

      sdk.engage();

      expect(engageSpy).not.toHaveBeenCalled();
      expect(consoleSpy.mock.calls[0]).toEqual([
        'error',
        'You cannot engage Events without passing in an event label.',
      ]);

      consoleSpy.mockRestore();
      engageSpy.mockRestore();
    });

    test('properly warns about events labels not being a string', () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();
      const consoleSpy = jest.spyOn(sdk, 'console');
      const engageSpy = jest.spyOn(ApptentiveApi.prototype, 'createEvent');

      sdk.engage(1234);

      expect(engageSpy).not.toHaveBeenCalled();
      expect(consoleSpy.mock.calls[0]).toEqual(['error', 'Event label must be a string.']);

      consoleSpy.mockRestore();
      engageSpy.mockRestore();
    });

    test('properly creates an internal event with custom data', () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();
      const engageSpy = jest.spyOn(ApptentiveApi.prototype, 'createEvent');

      sdk.engage('com.apptentive#app#launch', { cat: 'meow' });

      expect(engageSpy).toHaveBeenCalledTimes(1);

      const args = engageSpy.mock.calls[0][0];
      expect(args.json.event.label).toBe('com.apptentive#app#launch');
      expect(args.json.event.data).toEqual({ cat: 'meow' });
      expect(args.json.event.client_created_at).not.toBeUndefined();
      expect(args.json.event.client_created_at_utc_offset).not.toBeUndefined();
      expect(args.json.event.session_id).toBe(sdk.session_id);

      engageSpy.mockRestore();
    });

    test('properly creates an internal event without custom data', () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();
      const engageSpy = jest.spyOn(ApptentiveApi.prototype, 'createEvent');

      sdk.engage('com.apptentive#app#launch');

      expect(engageSpy).toHaveBeenCalledTimes(1);

      const args = engageSpy.mock.calls[0][0];
      expect(args.json.event.label).toBe('com.apptentive#app#launch');
      expect(args.json.event.data).toBeUndefined();
      expect(args.json.event.client_created_at).not.toBeUndefined();
      expect(args.json.event.client_created_at_utc_offset).not.toBeUndefined();
      expect(args.json.event.session_id).toBe(sdk.session_id);

      engageSpy.mockRestore();
    });

    test('properly adds the interaction_id to the event payload', () => {
      const interactionId = 'b3dbf6f0-468a-51ae-8f5d-2043aa662b39';
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();
      const engageSpy = jest.spyOn(ApptentiveApi.prototype, 'createEvent');

      sdk.engage('com.apptentive#app#launch', { interaction_id: interactionId });

      const args = engageSpy.mock.calls[0][0];

      expect(args.json.event.interaction_id).toBe(interactionId);
      expect(Object.keys(args.json.event.data).includes('interaction_id')).toBe(false);

      engageSpy.mockRestore();
    });

    test('properly prefixes local events with custom data', () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();
      const engageSpy = jest.spyOn(ApptentiveApi.prototype, 'createEvent');

      sdk.engage('custom-event', { dog: 'woof' });

      expect(engageSpy).toHaveBeenCalledTimes(1);

      const args = engageSpy.mock.calls[0][0];
      expect(args.json.event.label).toBe('local#app#custom-event');
      expect(args.json.event.data).toEqual({ dog: 'woof' });
      expect(args.json.event.client_created_at).not.toBeUndefined();
      expect(args.json.event.client_created_at_utc_offset).not.toBeUndefined();
      expect(args.json.event.session_id).toBe(sdk.session_id);

      engageSpy.mockRestore();
    });

    test('properly prefixes local events without custom data', () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();
      const engageSpy = jest.spyOn(ApptentiveApi.prototype, 'createEvent');

      sdk.engage('custom-event');

      expect(engageSpy).toHaveBeenCalledTimes(1);

      const args = engageSpy.mock.calls[0][0];
      expect(args.json.event.label).toBe('local#app#custom-event');
      expect(args.json.event.data).toBeUndefined();
      expect(args.json.event.client_created_at).not.toBeUndefined();
      expect(args.json.event.client_created_at_utc_offset).not.toBeUndefined();
      expect(args.json.event.session_id).toBe(sdk.session_id);

      engageSpy.mockRestore();
    });

    test('properly calls an interaction (Note / TextModal)', () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();
      const logicEngineStub = jest.spyOn(sdk.logicEngine, 'engageEvent').mockReturnValue({
        type: 'TextModal',
        id: '123',
        configuration: {
          description: 'Would you like to take a survey!?',
          actions: [],
          name: 'Test',
          required: false,
          title: 'Testing Local',
        },
        version: 1,
      });

      const noteSpy = jest.spyOn(ApptentiveNote, 'display').mockImplementation();

      sdk.engage('custom-note-trigger');

      expect(noteSpy).toHaveBeenCalledTimes(1);

      logicEngineStub.mockRestore();
      noteSpy.mockRestore();
    });

    test('properly calls an interaction (NavigateToLink)', () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();
      const logicEngineStub = jest.spyOn(sdk.logicEngine, 'engageEvent').mockReturnValue({
        type: 'NavigateToLink',
        id: '123',
        configuration: {
          url: 'https://www.apptentive.com/',
        },
        version: 1,
      });

      const ntlSpy = jest.spyOn(ApptentiveNavigateToLink, 'display').mockImplementation();

      sdk.engage('custom-note-trigger');

      expect(ntlSpy).toHaveBeenCalledTimes(1);

      logicEngineStub.mockRestore();
      ntlSpy.mockRestore();
    });

    test('properly sets the last_event on the SDK when debug mode is enabled', () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();
      sdk.debug = true;
      sdk.engageSuccess({ label: 'yep' });

      expect(sdk.last_event.label).toBe('yep');
    });

    test('properly skips storing last_event when debug mode is disabled', () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();
      sdk.options.debug = false;
      sdk.engageSuccess({ label: 'nope' });

      expect(sdk.last_event).toStrictEqual({});
    });
  });

  describe('identifyPerson', () => {
    test('properly prevents a call without a conversation', async () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build();
      const identifyPersonSpy = jest.spyOn(ApptentiveApi.prototype, 'identifyPerson').mockResolvedValue(_mockError);

      const response = await sdk.identifyPerson();

      expect(response).toEqual('Attempted to identify a Person before a conversation was created.');
      expect(identifyPersonSpy).not.toHaveBeenCalled();

      identifyPersonSpy.mockRestore();
    });

    test('properly prevents a call without a person object', async () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();
      const identifyPersonSpy = jest.spyOn(ApptentiveApi.prototype, 'identifyPerson').mockResolvedValue(_mockError);

      const response = await sdk.identifyPerson({ person: null });

      expect(response).toEqual('You cannot identify a person without a valid person object and a valid unique_token.');
      expect(identifyPersonSpy).not.toHaveBeenCalled();

      identifyPersonSpy.mockRestore();
    });

    test('properly prevents a call without a unique token on the person', async () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();
      const identifyPersonSpy = jest.spyOn(ApptentiveApi.prototype, 'identifyPerson').mockResolvedValue(_mockError);

      const response = await sdk.identifyPerson({ person: _mockPerson });

      expect(response).toEqual('You cannot identify a person without a valid person object and a valid unique_token.');
      expect(identifyPersonSpy).not.toHaveBeenCalled();

      identifyPersonSpy.mockRestore();
    });

    test('properly updates the person object on api success', async () => {
      const user = {
        unique_token: 'user_1',
        name: 'Blake Imsland',
        email: 'blake@apptentive.com',
      };
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();

      const identifyPersonSpy = jest.spyOn(ApptentiveApi.prototype, 'identifyPerson').mockResolvedValue({});

      await sdk.identifyPerson(user);

      expect(identifyPersonSpy).toHaveBeenCalledTimes(1);

      const args = identifyPersonSpy.mock.calls[0][0];
      expect(args.json.person).toEqual({
        unique_token: 'user_1',
        name: 'Blake Imsland',
        email: 'blake@apptentive.com',
        secret: _conversationToken,
      });

      identifyPersonSpy.mockRestore();
    });

    test('properly calls success callback when api call succeeds', async () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();

      const identifyPersonSpy = jest.spyOn(ApptentiveApi.prototype, 'identifyPerson').mockResolvedValue({});

      const successSpy = jest.spyOn(sdk, 'identifyPersonSuccess');
      const failureSpy = jest.spyOn(sdk, 'identifyPersonError');
      const successCallback = jest.fn();

      await sdk.identifyPerson({ unique_token: 'unique_token', success: successCallback });

      expect(successCallback).toHaveBeenCalledTimes(1);
      expect(successSpy).toHaveBeenCalledTimes(1);
      expect(failureSpy).not.toHaveBeenCalled();
      expect(identifyPersonSpy).toHaveBeenCalledTimes(1);

      const args = identifyPersonSpy.mock.calls[0][0];
      expect(args.json.person.unique_token).toBe('unique_token');

      identifyPersonSpy.mockRestore();
      successSpy.mockRestore();
      failureSpy.mockRestore();
    });

    test('properly calls failure callback when api call fails', async () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();
      const identifyPersonSpy = jest
        .spyOn(ApptentiveApi.prototype, 'identifyPerson')
        .mockRejectedValue(new HTTPError({ status: 404 }));

      const successSpy = jest.spyOn(sdk, 'identifyPersonSuccess');
      const failureSpy = jest.spyOn(sdk, 'identifyPersonError');
      const failureCallback = jest.fn();
      const response = await sdk.identifyPerson({ unique_token: 'unique_token', failure: failureCallback });

      expect(response).toBeInstanceOf(Error);
      expect(successSpy).not.toHaveBeenCalled();
      expect(failureCallback).toHaveBeenCalledTimes(1);
      expect(failureSpy).toHaveBeenCalledTimes(1);
      expect(identifyPersonSpy).toHaveBeenCalledTimes(1);

      identifyPersonSpy.mockRestore();
      sdk.identifyPersonSuccess.mockRestore();
      sdk.identifyPersonError.mockRestore();
    });

    test('properly calls create conversation when api returns a 422 error', async () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();
      const identifyPersonSpy = jest.spyOn(ApptentiveApi.prototype, 'identifyPerson').mockRejectedValue(
        new HTTPError({
          status: 422,
        })
      );

      const createConversationSpy = jest.spyOn(ApptentiveApi.prototype, 'createConversation').mockResolvedValue({});

      const user = {
        unique_token: 'user_1',
        name: 'Blake Imsland',
        email: 'blake@apptentive.com',
      };

      await sdk.identifyPerson({ ...user });

      expect(identifyPersonSpy).toHaveBeenCalledTimes(1);
      expect(createConversationSpy).toHaveBeenCalledTimes(1);

      identifyPersonSpy.mockRestore();
      createConversationSpy.mockRestore();
    });

    test('properly updates the conversation data on success', () => {
      const user = {
        unique_token: 'user_1',
        name: 'Blake Imsland',
        email: 'blake@apptentive.com',
      };
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();

      sdk.identifyPersonSuccess(user);

      expect(sdk.logicEngine.person).toEqual(user);
      expect(sdk.conversation.person).toEqual(user);
      expect(sdk.db.get('person')).toEqual(user);
    });

    test('properly catches error when there is no conversation', () => {
      const user = {
        unique_token: 'user_1',
        name: 'Blake Imsland',
        email: 'blake@apptentive.com',
      };
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build();

      sdk.identifyPersonSuccess(user);

      expect(sdk.logicEngine.person).toEqual(user);
      expect(sdk.db.get('person')).toEqual(user);
    });

    test('properly catches an error when attempting to store person data', () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();
      sdk.db = {
        set: jest.fn(() => {
          throw new Error('cannot set localstorage');
        }),
      };

      expect(() => sdk.identifyPersonSuccess(_mockPerson)).not.toThrow();
    });

    test('properly handles invalid response in success callback', () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();
      expect(() => {
        sdk.identifyPersonSuccess('ERROR');
      }).not.toThrow();
    });

    test('properly warns about a standard api failure', () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();
      const consoleSpy = jest.spyOn(sdk, 'console');

      sdk.identifyPersonError();

      expect(consoleSpy.mock.calls[0]).toEqual([
        'info',
        'There was an issue associating a person to the current conversation',
      ]);

      consoleSpy.mockRestore();
    });
  });

  describe('updatePerson', () => {
    test('properly prevents call before a conversation is created', async () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build();
      const updatePersonSpy = jest.spyOn(ApptentiveApi.prototype, 'updatePerson').mockResolvedValue({});

      await sdk.updatePerson(_mockPerson);

      expect(updatePersonSpy).not.toHaveBeenCalled();

      updatePersonSpy.mockRestore();
    });

    test('properly prevents call when there is no person passed in', async () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();
      const updatePersonSpy = jest.spyOn(ApptentiveApi.prototype, 'updatePerson').mockResolvedValue({});

      await sdk.updatePerson();

      expect(updatePersonSpy).not.toHaveBeenCalled();

      updatePersonSpy.mockRestore();
    });

    test('properly updates conversation object with the new person', async () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();

      const updatePersonSpy = jest.spyOn(ApptentiveApi.prototype, 'updatePerson').mockResolvedValue({});

      await sdk.updatePerson(_mockPerson);

      expect(updatePersonSpy).toHaveBeenCalledTimes(1);

      const args = updatePersonSpy.mock.calls[0][0];
      expect(args.json.person).toEqual(_mockPerson);

      updatePersonSpy.mockRestore();
    });

    test('properly calls success callback when api call succeeds', async () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();
      const updatePersonSpy = jest.spyOn(ApptentiveApi.prototype, 'updatePerson').mockResolvedValue({});
      const successSpy = jest.spyOn(sdk, 'updatePersonSuccess');

      const successCallback = jest.fn();

      await sdk.updatePerson(_mockPerson, { success: successCallback });

      expect(successSpy).toHaveBeenCalledTimes(1);
      expect(successCallback).toHaveBeenCalledTimes(1);
      expect(updatePersonSpy).toHaveBeenCalledTimes(1);

      updatePersonSpy.mockRestore();
      successSpy.mockRestore();
    });

    test('properly calls failure callback when api call fails', async () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();
      const updatePersonSpy = jest.spyOn(ApptentiveApi.prototype, 'updatePerson').mockRejectedValue(_mockError);
      const successSpy = jest.spyOn(sdk, 'updatePersonSuccess');
      const failureCallback = jest.fn();
      const response = await sdk.updatePerson(_mockPerson, { failure: failureCallback });

      expect(response).toBeInstanceOf(Error);
      expect(successSpy).not.toHaveBeenCalled();
      expect(failureCallback).toHaveBeenCalledTimes(1);
      expect(updatePersonSpy).toHaveBeenCalledTimes(1);

      updatePersonSpy.mockRestore();
      successSpy.mockRestore();
    });

    test('properly updates the logic engine with the new person data', () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();
      const updPerson = { ...sdk.db.get('person'), ..._mockPerson };
      sdk.updatePersonSuccess(_mockPerson);

      expect(sdk.logicEngine.person).toEqual(updPerson);
      expect(sdk.db.get('person')).toEqual(updPerson);
    });

    test('properly catches an error when attempting to store person data', () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();
      sdk.db = {
        set: jest.fn(() => {
          throw new Error('cannot set localstorage');
        }),
      };

      expect(() => sdk.updatePersonSuccess(_mockPerson)).not.toThrow();
    });
  });

  describe('updateDevice', () => {
    test('properly prevents a call when a conversation has not been created', async () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build();
      const updateDeviceSpy = jest.spyOn(ApptentiveApi.prototype, 'updateDevice').mockResolvedValue({});

      const response = await sdk.updateDevice();

      expect(response).toEqual('You cannot update a device without a valid Conversation token.');
      expect(updateDeviceSpy).not.toHaveBeenCalled();

      updateDeviceSpy.mockRestore();
    });

    test('properly creates a device object when one is not passed in', async () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();
      const updateDeviceSpy = jest.spyOn(ApptentiveApi.prototype, 'updateDevice').mockResolvedValue({});

      await sdk.updateDevice();

      expect(updateDeviceSpy).toHaveBeenCalledTimes(1);

      const args = updateDeviceSpy.mock.calls[0][0];
      expect(args.json.device.custom_data).not.toBe(null);

      updateDeviceSpy.mockRestore();
    });

    test('properly uses the device object instead of the builder when passed in', async () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();
      const updateDeviceSpy = jest.spyOn(ApptentiveApi.prototype, 'updateDevice').mockResolvedValue({});

      await sdk.updateDevice(_mockDevice);

      expect(updateDeviceSpy).toHaveBeenCalledTimes(1);

      const args = updateDeviceSpy.mock.calls[0][0];
      expect(args.json.device).toEqual(_mockDevice);

      updateDeviceSpy.mockRestore();
    });

    test('properly calls success callback when api call succeeds', async () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();
      const updateDeviceSpy = jest.spyOn(ApptentiveApi.prototype, 'updateDevice').mockResolvedValue({});
      const successSpy = jest.spyOn(sdk, 'updateDeviceSuccess');
      const successCallback = jest.fn();

      await sdk.updateDevice(_mockPerson, { success: successCallback });

      expect(successSpy).toHaveBeenCalledTimes(1);
      expect(successCallback).toHaveBeenCalledTimes(1);
      expect(updateDeviceSpy).toHaveBeenCalledTimes(1);

      updateDeviceSpy.mockRestore();
      successSpy.mockRestore();
    });

    test('properly calls failure callback when api call fails', async () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();
      const updateDeviceSpy = jest.spyOn(ApptentiveApi.prototype, 'updateDevice').mockRejectedValue(_mockError);
      const successSpy = jest.spyOn(sdk, 'updateDeviceSuccess');
      const failureCallback = jest.fn();
      const response = await sdk.updateDevice(_mockPerson, { failure: failureCallback });

      expect(response).toBeInstanceOf(Error);
      expect(successSpy).not.toHaveBeenCalled();
      expect(failureCallback).toHaveBeenCalledTimes(1);
      expect(updateDeviceSpy).toHaveBeenCalledTimes(1);

      updateDeviceSpy.mockRestore();
      successSpy.mockRestore();
    });

    test('properly updates conversation with the new device data', () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();
      const updDevice = { ...sdk.logicEngine.device, ..._mockDevice };
      sdk.updateDeviceSuccess(_mockDevice);

      expect(sdk.logicEngine.device).toEqual(updDevice);
      expect(sdk.db.get('device')).toEqual(updDevice);
    });

    test('properly catches an error when attempting to store device data', () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();
      sdk.db = {
        set: jest.fn(() => {
          throw new Error('cannot set localstorage');
        }),
      };

      expect(() => sdk.updateDeviceSuccess(_mockDevice)).not.toThrow();
    });
  });

  describe('showMessageCenter', () => {
    test('#showMessageCenter: should attempt to find all MessageCenter interactions', () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();
      const logicEngineStub = jest.spyOn(sdk.logicEngine, 'interactionFromType').mockImplementation();

      sdk.showMessageCenter();

      expect(logicEngineStub.mock.calls[0]).toEqual(['MessageCenter']);
      logicEngineStub.mockRestore();
    });

    test('#showMessageCenter: should call a MessageCenter interaction', () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();
      const logicEngineStub = jest.spyOn(sdk.logicEngine, 'interactionFromType').mockReturnValue([
        {
          id: '55bae8ef35878bc3c6000582',
          type: 'MessageCenter',
          version: 2,
          configuration: {
            title: 'Message Center',
            composer: {
              title: 'New Message',
              hint_text: 'Please leave detailed feedback',
              send_button: 'Send',
              send_start: 'Sending...',
              send_ok: 'Sent',
              send_fail: 'Failed',
              close_text: 'Close',
              close_confirm_body: 'Are you sure you want to discard this message?',
              close_discard_button: 'Discard',
              close_cancel_button: 'Cancel',
            },
            greeting: {
              title: 'Hello!',
              body: "We'd love to get feedback from you on our app. The more details you can provide, the better.",
              image_url: 'https://assets.apptentive.com/assets/app-icon/ribbon-79c9715222c1befe55a0110b9778b02e.png',
            },
            status: {
              body: 'We will get back to you soon!',
            },
            automated_message: {
              body: 'Please let us know how to make Apptentive better for you!',
            },
            error_messages: {
              http_error_body:
                "It looks like we're having trouble sending your message. We've saved it and will try sending it again soon.",
              network_error_body:
                "It looks like you aren't connected to the Internet right now. We've saved your message and will try again when we detect a connection.",
            },
            profile: {
              request: true,
              require: false,
              initial: {
                title: 'Who are we speaking with?',
                name_hint: 'Name',
                email_hint: 'Email',
                skip_button: 'Skip',
                save_button: "That's Me!",
              },
              edit: {
                title: 'Profile',
                name_hint: 'Name',
                email_hint: 'Email',
                skip_button: 'Cancel',
                save_button: 'Save',
              },
            },
          },
        },
      ]);

      const mcSpy = jest.spyOn(ApptentiveMessageCenter, 'display').mockImplementation();

      sdk.showMessageCenter();

      expect(mcSpy).toHaveBeenCalledTimes(1);

      logicEngineStub.mockRestore();
      mcSpy.mockRestore();
    });

    test('#showMessageCenter: should not error with no logic engine', () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();
      delete sdk._logicEngine;

      expect(() => {
        sdk.showMessageCenter();
      }).not.toThrow();
    });
  });

  describe('interactions', () => {
    test('#showInteraction: should attempt to find the interaction', () => {
      const interactionId = '55bae8ef35878bc3c6000582';
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();
      const logicEngineStub = jest.spyOn(sdk.logicEngine, 'interactionFromId').mockImplementation();

      sdk.showInteraction(interactionId);

      expect(logicEngineStub.mock.calls[0]).toEqual([interactionId]);
      logicEngineStub.mockRestore();
    });

    test('#showInteraction: should call a MessageCenter interaction', () => {
      const interactionId = '55bae8ef35878bc3c6000582';
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();
      const logicEngineStub = jest.spyOn(sdk.logicEngine, 'interactionFromId').mockReturnValue({
        id: interactionId,
        type: 'MessageCenter',
        version: 2,
        configuration: {
          title: 'Message Center',
          composer: {
            title: 'New Message',
            hint_text: 'Please leave detailed feedback',
            send_button: 'Send',
            send_start: 'Sending...',
            send_ok: 'Sent',
            send_fail: 'Failed',
            close_text: 'Close',
            close_confirm_body: 'Are you sure you want to discard this message?',
            close_discard_button: 'Discard',
            close_cancel_button: 'Cancel',
          },
          greeting: {
            title: 'Hello!',
            body: "We'd love to get feedback from you on our app. The more details you can provide, the better.",
            image_url: 'https://assets.apptentive.com/assets/app-icon/ribbon-79c9715222c1befe55a0110b9778b02e.png',
          },
          status: {
            body: 'We will get back to you soon!',
          },
          automated_message: {
            body: 'Please let us know how to make Apptentive better for you!',
          },
          error_messages: {
            http_error_body:
              "It looks like we're having trouble sending your message. We've saved it and will try sending it again soon.",
            network_error_body:
              "It looks like you aren't connected to the Internet right now. We've saved your message and will try again when we detect a connection.",
          },
          profile: {
            request: true,
            require: false,
            initial: {
              title: 'Who are we speaking with?',
              name_hint: 'Name',
              email_hint: 'Email',
              skip_button: 'Skip',
              save_button: "That's Me!",
            },
            edit: {
              title: 'Profile',
              name_hint: 'Name',
              email_hint: 'Email',
              skip_button: 'Cancel',
              save_button: 'Save',
            },
          },
        },
      });

      const mcSpy = jest.spyOn(ApptentiveMessageCenter, 'display').mockImplementation();

      sdk.showInteraction(interactionId);

      expect(mcSpy).toHaveBeenCalledTimes(1);

      logicEngineStub.mockRestore();
      mcSpy.mockRestore();
    });

    test('#showInteraction: should not error with no logic engine', () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();
      delete sdk._logicEngine;

      expect(() => {
        sdk.showInteraction();
      }).not.toThrow();
    });

    test('#showInteraction: should not error with no ID', () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();

      expect(() => {
        sdk.showInteraction();
      }).not.toThrow();
    });

    test('#loadInteraction: should attempt to find the interaction', () => {
      const interactionId = '55bae8ef35878bc3c6000582';
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();
      const logicEngineStub = jest.spyOn(sdk.logicEngine, 'interactionFromId').mockImplementation();

      sdk.loadInteraction(interactionId);

      expect(logicEngineStub.mock.calls[0]).toEqual([interactionId]);
      logicEngineStub.mockRestore();
    });

    test('#loadInteraction: should load a MessageCenter interaction', () => {
      const interactionId = '55bae8ef35878bc3c6000582';
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();
      const logicEngineStub = jest.spyOn(sdk.logicEngine, 'interactionFromId').mockImplementation();
      const interactionPayload = {
        id: interactionId,
      };

      logicEngineStub.mockReturnValue(interactionPayload);

      const interaction = sdk.loadInteraction(interactionId);

      expect(interaction).toEqual(interactionPayload);

      logicEngineStub.mockRestore();
    });

    test('#loadInteraction: should not error with no logic engine', () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();
      delete sdk._logicEngine;

      expect(() => {
        sdk.loadInteraction();
      }).not.toThrow();
    });

    test('#loadInteraction: should not error with no ID', () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();

      expect(() => {
        sdk.loadInteraction();
      }).not.toThrow();
    });
  });

  describe('fetchManifest', () => {
    test('properly prevents a call without a locale', async () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();
      const fetchManifestSpy = jest.spyOn(ApptentiveApi.prototype, 'fetchManifest').mockResolvedValue({});
      const consoleSpy = jest.spyOn(sdk, 'console');
      const response = await sdk.fetchManifest();

      expect(response).toEqual('Attempted to fetch Conversation Manifest without a locale.');
      expect(fetchManifestSpy).not.toHaveBeenCalled();
      expect(consoleSpy.mock.calls[0]).toEqual(['error', 'Attempted to fetch Conversation Manifest without a locale.']);

      fetchManifestSpy.mockRestore();
      consoleSpy.mockRestore();
    });

    test('properly catches error when manifest call fails', async () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();
      const fetchManifestSpy = jest
        .spyOn(ApptentiveApi.prototype, 'fetchManifest')
        .mockRejectedValue(new HTTPError({ status: 500 }));
      const response = await sdk.fetchManifest('ja');

      expect(response).toBeInstanceOf(Error);

      fetchManifestSpy.mockRestore();
    });

    test('properly fetches a manifest when locale is specified', async () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();
      const fetchManifestSpy = jest.spyOn(ApptentiveApi.prototype, 'fetchManifest').mockResolvedValue({});

      await sdk.fetchManifest('ja');

      expect(fetchManifestSpy).toHaveBeenCalledTimes(1);
      expect(fetchManifestSpy.mock.calls[0][0]).toEqual({});
      expect(fetchManifestSpy.mock.calls[0][1]).toBe('ja');

      fetchManifestSpy.mockRestore();
    });

    test('properly processes a manifest response', () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();
      const mockManifest = {
        interactions: [{ test: 'interactions' }],
        targets: { test: ['targeted_events'] },
      };

      sdk.fetchManifestSuccess('ja', mockManifest);

      expect(sdk.logicEngine.interactions).toEqual(mockManifest.interactions);
      expect(sdk.logicEngine.targeted_events).toEqual(mockManifest.targets);
    });

    test('properly handle errors during manifest processing', () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();
      const consoleSpy = jest.spyOn(sdk, 'console');

      sdk.fetchManifestSuccess('ja', null);

      expect(consoleSpy.mock.calls[1][0]).toBe('error');
      expect(consoleSpy.mock.calls[1][1]).toBe('Error with manifest for locale');
      expect(consoleSpy.mock.calls[1][2]).toBe('ja');
    });

    test('properly sets the current locale and calls fetchManifest', () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();
      const fetchManifestSpy = jest.spyOn(sdk, 'fetchManifest').mockImplementation();

      sdk.setLocale('ja');

      expect(fetchManifestSpy).toHaveBeenCalledTimes(1);
      expect(sdk.currentLanguage).toBe('ja');

      fetchManifestSpy.mockRestore();
    });

    test('properly prevents call to fetchManifest if the language is the same', () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();
      const fetchManifestSpy = jest.spyOn(sdk, 'fetchManifest');

      expect(sdk.currentLanguage).toBe('en-US');
      sdk.setLocale('en-US');

      expect(fetchManifestSpy).not.toHaveBeenCalled();

      fetchManifestSpy.mockRestore();
    });

    test('properly persists locale and manifest', (done) => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();
      const fetchManifestSpy = jest.spyOn(ApptentiveApi.prototype, 'fetchManifest').mockResolvedValue({});
      const cacheManifestSpy = jest.spyOn(sdk, 'cacheManifest');

      const success = (locale, _) => {
        expect(window.sessionStorage.getItem('apptentiveLocaleOverride')).toBe('ja');
        expect(cacheManifestSpy).toHaveBeenCalledTimes(1);
        expect(locale).toBe('ja');

        fetchManifestSpy.mockRestore();
        cacheManifestSpy.mockRestore();
        done();
      };

      sdk.setLocale('ja', { success });
    });

    test('properly persists manifest in session storage when called', () => {
      const mockManifest = '{test:"value"}';
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();

      sdk.cacheManifest(mockManifest, 'ja');

      expect(window.sessionStorage.getItem(sessionStorageKeys.manifestCache)).toBe(mockManifest);
      expect(window.sessionStorage.getItem(sessionStorageKeys.manifestExpiration)).toBe(cacheExpirationTime);
    });

    test('properly handles errors when session storage is not available', (done) => {
      const errorMessage = Error('No Session Storage');
      const sessionStorageSpy = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw errorMessage;
      });

      const errorHandler = (event) => {
        document.removeEventListener(browserEvents.APPTENTIVE_ERROR, errorHandler);

        expect(event.detail).toBe(errorMessage);
        sessionStorageSpy.mockRestore();
        done();
      };

      const { sdk } = new ApptentiveBaseBuilder().build();
      document.addEventListener(browserEvents.APPTENTIVE_ERROR, errorHandler);

      expect(() => {
        sdk.cacheManifest('ja', '{ manifest }');
      }).not.toThrow();
    });

    test('properly restores locale if cached manifest is still valid', () => {
      const mockInteractions = { interaction1: 'value' };
      const mockTargetedEvents = { target_event1: 'value' };
      const mockManifest = { interactions: mockInteractions, targets: mockTargetedEvents };

      window.sessionStorage.setItem(sessionStorageKeys.manifestLocale, 'ja');

      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest(mockManifest).build().withConversation();

      expect(sdk.currentLanguage).toBe('ja');
      expect(sdk.logicEngine.interactions).toEqual(mockInteractions);
      expect(sdk.logicEngine.targeted_events).toEqual(mockTargetedEvents);
    });

    test('properly fetches manifest if cached manifest is expired', () => {
      const expiredCacheTimestamp = new Date();
      expiredCacheTimestamp.setMinutes(expiredCacheTimestamp.getMinutes() - 45);

      const consoleSpy = jest.spyOn(console, 'info').mockClear().mockImplementation();
      const fetchManifestSpy = jest.spyOn(ApptentiveBase.prototype, 'fetchManifest');
      const { _sdk } = new ApptentiveBaseBuilder()
        .useCachedManifest(manifest, expiredCacheTimestamp.getTime().toString())
        .useOptions({ debug: true })
        .build()
        .withConversation();

      expect(fetchManifestSpy).toHaveBeenCalledTimes(1);

      const cacheConsoleCall = consoleSpy.mock.calls.find(
        (call) => call[2] === 'Fetching a new manifest since there is not one cached locally'
      );
      expect(cacheConsoleCall).not.toBeNull();

      consoleSpy.mockRestore();
      fetchManifestSpy.mockRestore();
    });

    test('properly persists manifest in session storage when cacheManifest is called', () => {
      const mockManifest = '{test:"value"}';
      const { sdk } = new ApptentiveBaseBuilder().build();

      sdk.cacheManifest(mockManifest);

      expect(window.sessionStorage.getItem(sessionStorageKeys.manifestCache)).toBe(mockManifest);
      expect(window.sessionStorage.getItem(sessionStorageKeys.manifestExpiration)).toBe(cacheExpirationTime);
    });

    test('properly handles errors when caching manifest and session storage is not available', (done) => {
      const errorMessage = Error('No Session Storage');
      const sessionStorageSpy = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw errorMessage;
      });

      const errorHandler = (event) => {
        document.removeEventListener(browserEvents.APPTENTIVE_ERROR, errorHandler);

        expect(event.detail).toBe(errorMessage);
        sessionStorageSpy.mockRestore();
        done();
      };

      const { sdk } = new ApptentiveBaseBuilder().build();

      document.addEventListener(browserEvents.APPTENTIVE_ERROR, errorHandler);

      expect(() => {
        sdk.cacheManifest('{ manifest }');
      }).not.toThrow();
    });

    test('properly handles errors when clearing a cached manifest and session storage is not available', (done) => {
      const errorMessage = Error('No Session Storage');
      const sessionStorageSpy = jest.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
        throw errorMessage;
      });

      const errorHandler = (event) => {
        document.removeEventListener(browserEvents.APPTENTIVE_ERROR, errorHandler);

        expect(event.detail).toBe(errorMessage);
        sessionStorageSpy.mockRestore();
        done();
      };

      const { sdk } = new ApptentiveBaseBuilder().build();

      document.addEventListener(browserEvents.APPTENTIVE_ERROR, errorHandler);

      expect(() => {
        sdk.clearManifestCache();
      }).not.toThrow();
    });
  });
});
