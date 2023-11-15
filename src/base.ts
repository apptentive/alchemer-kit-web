/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unused-vars */
import Fifo from 'localstorage-fifo';
import ApptentiveApi from './api';
import ApptentiveDisplay from './display';
import ApptentiveI18N from './i18n';
import LogicEngine from './logic-engine';
import { version } from '../package.json';
import gguid from './guid';
import browserEvent from './browser-event';
import browserEvents from './constants/browser-events';
import internalEvents from './constants/events';
import sdkDoctor from './utils/sdkDoctor';

import { IApptentiveSdkOptions } from './interfaces/sdk/IApptentiveSdkOptions';
import { ISdkMetadata } from './interfaces/data/ISdkMetadata';
import { IConversation } from './interfaces/data/IConversation';
import { ICreateConversationOptions } from './interfaces/options/ICreateConversationOptions';
import { IConversationResponse } from './interfaces/api/IConversationResponse';
import { ICreateMessageOptions } from './interfaces/options/ICreateMessageOptions';
import { ICreateMessageResponse } from './interfaces/api/ICreateMessageResponse';
import { IDevice } from './interfaces/data/IDevice';
import { IDeviceOptions } from './interfaces/options/IDeviceOptions';
import { IEngageEvent } from './interfaces/engine/IEngageEvent';
import { IEngageEventCustomData } from './interfaces/engine/IEngageEventCustomData';
import { IErrorResponse } from './interfaces/api/IErrorResponse';
import { IFetchManifestOptions } from './interfaces/options/IFetchManifestOptions';
import { IIdentifyPersonOptions } from './interfaces/options/IIdentifyPersonOptions';
import { IManifest } from './interfaces/data/IManifest';
import { IUpdatePersonOptions } from './interfaces/options/IUpdatePersonOptions';
import { IPerson } from './interfaces/data/IPerson';
import { ISdkInitOptions } from './interfaces/sdk/ISdkInitOptions';
import { IUpdateConversationOptions } from './interfaces/options/IUpdateConversationOptions';

import buildDeviceMetadata from './utils/buildDeviceMetadata';
import isLocalStorageAvailable from './utils/isLocalStorageAvailable';
import getLocalSdkOptions from './utils/getLocalSdkOptions';
import getLogicEngineOptions from './utils/getLogicEngineOptions';
import { localStorageKeys, sessionStorageKeys } from './constants/storageKeys';
import appendStyles from './utils/appendStyles';
import prefixEventName from './utils/prefixEventName';

/**
 * The entry point of the ApptentiveBase.
 * @property {Fifo} db - Local Storage Accessor
 * @property {object} sdk - SDK Meta Data
 * @property {string} page_name - Name of the current page
 * @property {Date} date - Current Date
 * @property {object} conversation - Conversation Object
 * @property {ApptentiveApi} ajax - Network Connectivity
 * @property {LogicEngine} logicEngine - Logic Engine
 * @property {string} session_id - Session GUID
 * @property {object} options - Configuration options.
 * @property {string} options.token - Your API Key from the Apptentive dashboard.
 * @property {string} [options.host="https://api.apptentive.com"] - The Apptentive URL endpoint, this should not be changed unless directly instructed to do so.
 * @property {boolean} [options.debug=false] - Enable debugging information in the browser console.
 * @property {boolean} [options.readOnly=false] - Enable a read only SDK that does not PUT/POST any data.
 * @property {boolean} [options.force_refresh=false] - Skips loading data from localStorage.
 * @property {string} [options.domNode] - A DOM Node to append the interactions to rather than the document body, any valid querySelector string.
 * @property {boolean} [options.skipStyles=false] - Skip loading the external style sheet.
 * @property {boolean} [options.customStyles=false] - Enable Custom UI for displaying interactions.
 * @property {object} [options.settings] - Legacy Settings, used for style additions.
 * @property {object} [options.settings.styles] - Key / Value custom styles to append.
 * @property {object[]} [options.interactions] - Interactions
 * @property {object[]} [options.targeted_events] - Targeted Events
 * @example
 * let apptentiveSDK = new ApptentiveBase({ debug: true, token: 'YOUR_TOKEN_HERE' });
 * apptentiveSDK.engage('watched-video', { video: 'Rickroll' });
 */
export default class ApptentiveBase {
  private ajax!: ApptentiveApi;
  private db!: Fifo;
  private sdk: ISdkMetadata = {
    programming_language: 'JavaScript',
    author_name: 'Apptentive, Inc.',
    platform: 'Web',
    distribution: 'CDN',
    distribution_version: '',
    version: `${version}`,
  };
  private _date: Date = new Date();
  private _hasInitialized = false;
  private _isCaptureDisabled = false;
  private _isDebug = false;
  private _logicEngine!: LogicEngine;
  private _session_id: string = gguid();

  public conversation: IConversation = {} as IConversation;
  public currentLanguage!: string;
  public defaultLanguage!: string;
  public i18n!: ApptentiveI18N;
  public last_event = {} as { [key: string]: any };
  public last_message = {} as ICreateMessageResponse;
  public LOADER_VERSION = '0'; // Set from the init.js file
  public options: IApptentiveSdkOptions = {
    apiVersion: 12,
    captureDisabled: false,
    customStyles: false,
    debug: false,
    force_refresh: false,
    host: 'https://api.apptentive.com',
    readOnly: false,
    skipStyles: false,
  } as IApptentiveSdkOptions;

  /**
   * @param {object} options - Your configuration options.
   * @param {string} options.id - Your Apptentive AppId from the Apptentive dashboard.
   * @param {string} options.token - Your API Key from the Apptentive dashboard.
   * @param {object} [options.db] - A replacement storage engine.
   * @param {string} [options.host] - The Apptentive URL endpoint, this should not be changed unless directly instructed to do so.
   * @param {boolean} [options.debug] - Enable debugging information in the browser console.
   * @param {boolean} [options.readOnly] - Enable a read only SDK that does not PUT/POST any data.
   * @param {boolean} [options.force_refresh] - Skips loading data from localStorage.
   * @param {string} [options.domNode] - A DOM Node to append the interactions to rather than the document body, any valid querySelector string.
   * @param {boolean} [options.skipStyles] - Skip loading the external style sheet.
   * @param {boolean} [options.customStyles] - Enable Custom UI for displaying interactions.
   * @param {object} [options.settings] - Legacy Settings, used for style additions.
   * @param {object} [options.settings.styles] - Key / Value custom styles to append.
   * @param {boolean} [options.settings.hide_branding] - Show or Hide the Apptentive Branding, where applicable.
   * @param {object[]} [options.interactions] - Interactions
   * @param {object[]} [options.targeted_events] - Targeted Events
   * @see https://be.apptentive.com/apps/current/settings/api
   */
  constructor(options: ISdkInitOptions) {
    // Force bindings for use inside wrappers for Vue, React, etc.
    this.setOption = this.setOption.bind(this);
    this.reset = this.reset.bind(this);
    this.createConversation = this.createConversation.bind(this);
    this.conversationSuccess = this.conversationSuccess.bind(this);
    this.updateConversation = this.updateConversation.bind(this);
    this.updateConversationSuccess = this.updateConversationSuccess.bind(this);
    this.updatePerson = this.updatePerson.bind(this);
    this.updatePersonSuccess = this.updatePersonSuccess.bind(this);
    this.updateDevice = this.updateDevice.bind(this);
    this.updateDeviceSuccess = this.updateDeviceSuccess.bind(this);
    this.createMessage = this.createMessage.bind(this);
    this.createMessageSuccess = this.createMessageSuccess.bind(this);
    this.engage = this.engage.bind(this);
    this.engageSuccess = this.engageSuccess.bind(this);
    this.identifyPerson = this.identifyPerson.bind(this);
    this.identifyPersonSuccess = this.identifyPersonSuccess.bind(this);
    this.identifyPersonError = this.identifyPersonError.bind(this);
    this.console = this.console.bind(this);
    this.doctor = this.doctor.bind(this);
    this.setPageName = this.setPageName.bind(this);
    this.showMessageCenter = this.showMessageCenter.bind(this);
    this.canShowInteraction = this.canShowInteraction.bind(this);
    this.showInteraction = this.showInteraction.bind(this);
    this.loadInteraction = this.loadInteraction.bind(this);
    this.fetchManifest = this.fetchManifest.bind(this);
    this.fetchManifestSuccess = this.fetchManifestSuccess.bind(this);
    this.cacheManifest = this.cacheManifest.bind(this);
    this.clearManifestCache = this.clearManifestCache.bind(this);
    this.restoreOrFetchManifest = this.restoreOrFetchManifest.bind(this);
    this.parseInteractionQueryString = this.parseInteractionQueryString.bind(this);
    this.setLocale = this.setLocale.bind(this);

    // Check for localStorage, we depend on this
    if (!isLocalStorageAvailable()) {
      const error = 'LocalStorage is not available in this environment; the SDK cannot initialize.';

      browserEvent(browserEvents.APPTENTIVE_ERROR, { error });
      this.console('error', error);
      return;
    }

    // Merge default options, constructor options, and locally stored options
    this.options = { ...this.options, ...options, ...getLocalSdkOptions(this.console) };
    this._isDebug = this.options.debug ?? false;

    // With the move to only using the options object during initialization (e.g., in this constructor), we need to add proxies for the debug and readOnly properties
    // to maintain backwards compatibility (e.g., ApptentiveSDK.options.debug = true will be passed through to ApptentiveSDK.debug = true)
    // To make this as easy as possible, we can use a simple proxy that will intercept the object setter and pass it to the class setter
    if (window.Proxy) {
      this.options = new Proxy(this.options, {
        // This must be an arrow function to access the surrounding class
        set: (obj, prop: string, value) => {
          if (prop === 'debug') {
            this.debug = value;
          }

          if (prop === 'readOnly') {
            this.readOnly = value;
          }

          // Set the underlying object value to maintain its state
          obj[prop] = value;

          return true;
        },
      });
    }

    if (!this.options.token) {
      const error = 'No API Token was provided, please check the Apptentive Dashboard for your API Token.';

      browserEvent(browserEvents.APPTENTIVE_ERROR, { error });
      this.console('error', error);
      return;
    }

    appendStyles(this.options, this.console);

    this.db =
      options.db ||
      new Fifo({
        namespace: 'Apptentive',
        console: this.console,
      });

    if (this.options.captureDisabled || this.db.get(localStorageKeys.captureDisabled)) {
      this.console(
        'warn',
        'Capturing data is disabled for this user, the SDK will not capture events for this person.'
      );
      this._isCaptureDisabled = true;
    }

    // If we are read only mode, skip the Conversation creation.
    if (this.options.readOnly) {
      this.conversation = {
        id: 'READ-ONLY',
        token: 'READ-ONLY',
      } as IConversation;
    } else if (this.options.force_refresh !== true) {
      this.conversation = this.db.get(localStorageKeys.conversation) || ({} as IConversation);
    }

    this.ajax = new ApptentiveApi(this.options.id, this.options.token, {
      apiVersion: this.options.apiVersion,
      conversationId: this.conversation.id,
      conversationToken: this.conversation.token,
      debug: this.options.debug,
      prefixUrl: this.options.host,
      readonly: this.options.readOnly,
    });

    // Set the current AppID
    if (options.id) {
      // Validate we are on the correct App
      if (this.db.get(localStorageKeys.appId) && this.db.get(localStorageKeys.appId) !== options.id) {
        this.console('error', 'Apptentive AppID differs from previous AppID, resetting DB.');
        this.db.empty();
        this.clearManifestCache();
      }

      this.db.set(localStorageKeys.appId, options.id);
    }

    this._logicEngine = new LogicEngine({
      ...getLogicEngineOptions(this.options.force_refresh, this.db, this.console),
      console: this.console,
      interactions: options.interactions,
      targeted_events: options.targeted_events,
    });

    // Translations, first detect the default language
    this.defaultLanguage = window?.navigator?.language ?? 'en';
    this.currentLanguage = this.defaultLanguage;

    this.i18n = new ApptentiveI18N({
      defaultLanguage: this.defaultLanguage,
      debug: this.options.debug,
    });

    this.i18n.add(this.defaultLanguage, { interactions: options.interactions });

    // Set a new locale based on sessionStorage or from the configuration
    //
    // The session storage key gets set when a customer calls the setLocale method manually
    // On the next page load, read in that value and then restore the locale and the cached manifest
    const localeOverride = window.sessionStorage.getItem('apptentiveLocaleOverride');

    // If there isn't a locale override, this will use the default cached manifest store
    this.restoreOrFetchManifest(localeOverride);
    this._hasInitialized = true;

    if (window.ApptentiveSDK) {
      // Save the global function queue setup by the init script to be run now.
      let queue: any[] | null = (window.ApptentiveSDK as any) || [];

      this.console(
        'info',
        `ApptentiveSDK INIT Script: ${window.ApptentiveSDK.LOADER_VERSION ? window.ApptentiveSDK.LOADER_VERSION : 0}`
      );

      this.console('info', `ApptentiveSDK INIT Script Queue: ${queue?.length}`);

      // Make any calls queued before the full sdk.js library had loaded.
      while (queue && queue.length > 0) {
        const args: any[] = queue.shift();
        const method: string = args.shift();

        if (typeof this[method as keyof ApptentiveBase] === 'function') {
          (this as any)[method](...args);
        }
      }

      queue = null;
    } else {
      this.console('info', 'No ApptentiveSDK INIT Script');
    }
  }

  get api() {
    return this.ajax;
  }

  get captureDisabled() {
    return this._isCaptureDisabled;
  }

  set captureDisabled(value: boolean) {
    this._isCaptureDisabled = value;

    // Persist this setting if turning it on, otherwise remove the key from LS
    if (value === true) {
      this.db.set(localStorageKeys.captureDisabled, value);
    } else {
      this.db.remove(localStorageKeys.captureDisabled);
    }
  }

  get debug() {
    return this._isDebug;
  }

  set debug(value: boolean) {
    // Debug needs to propagate to other class instances (sdk, api, and localization)
    // TODO: Eventually we need to combine the console logger into its own class that can maintain a single state for all of these instances
    this._isDebug = value;
    this.i18n.debug = value;
    this.ajax.debug = value;
  }

  get logicEngine() {
    return this._logicEngine;
  }

  get page_name() {
    return this.ajax.pageName;
  }

  set page_name(name: string) {
    this.ajax.pageName = name;
  }

  get readOnly() {
    return this.ajax.readOnly;
  }

  set readOnly(value: boolean) {
    this.ajax.readOnly = value;
  }

  get session_id() {
    return this._session_id;
  }

  /**
   * Parses the URL for an interactionId query string to trigger an interaction
   * @private
   */
  parseInteractionQueryString() {
    // Read in URL and see if there is an interaction that should be displayed
    try {
      const url = new URL(window.location.toString());
      const interactionId = url.searchParams.get('interactionId');

      if (interactionId) {
        const interactionConfig = this._logicEngine.interactions.find(
          (interaction) => interaction.id === interactionId
        );

        if (interactionConfig) {
          // Update the interaction counts to show that this was displayed
          LogicEngine.createOrUpdate(this._logicEngine.interaction_counts, interactionId);
          ApptentiveDisplay(interactionConfig, this, { domNode: this.options.domNode });

          // Modify the url object to remove the specific searchParam and then replace the history
          // This ensures that a user cannot use the back button to re-trigger the interaction
          url.searchParams.delete('interactionId');
          window.history.replaceState(null, '', url.toString());
        }
      }
    } catch (_) {}
  }

  /**
   * Sets an option on the SDK for a provided key / value.
   * @param {string} key - The key to use when setting a value for an option.
   * @param {string|number|boolean} value - The value for a provided key to be set on the options object.
   */
  setOption(key: string, value: string | number | boolean) {
    this.console(
      'warn',
      'The internal options object is being moved to only be used during initialization.',
      'Please use the direct setter for changing a value (e.g., ApptentiveSDK.debug = true) instead.'
    );

    if (!key) {
      this.console('warn', 'Tried to set option without key');
      return;
    }

    if (typeof this.options[key] !== 'undefined') {
      this.console('info', `Updating '${key}' to '${value}' from '${this.options[key]}'`);
    } else {
      this.console('info', `Setting '${key}' to '${value}'`);
    }

    this.options[key] = value;
  }

  /**
   * @param {string} event - The event name to test for a matching interaction.
   * @returns {boolean} - Returns a boolean to indicate an interaction matches that event.
   */
  canShowInteraction(event: string) {
    const interactionConfig = this.logicEngine.canShowInteractionForEvent(prefixEventName(event));

    // All that matters here is whether or not an interaction config was returned
    // so we need to coerce this to a boolean.
    return !!interactionConfig;
  }

  /**
   * Resets the SDK instance back to the initial empty state.
   */
  reset() {
    this.ajax.reset();
    this._logicEngine.reset();
    this.db.empty();
    this.clearManifestCache();

    this._date = new Date();
    this.conversation = {} as IConversation;

    this._session_id = gguid();
  }

  doctor() {
    sdkDoctor(this.console, this._logicEngine, this.ajax, this.conversation, {
      currentLanguage: this.currentLanguage,
      defaultLanguage: this.defaultLanguage,
      debug: this._isDebug,
      readOnly: this.readOnly,
      session_id: this._session_id,
      version,
    });
  }

  /**
   * Initiates a Conversation- a Conversation in this sense is the interactions between you the provider and the end user interacting with your app.
   * @param {object} [options] - Your conversation configuration.
   * @param {object} [options.app_release] - Your App Release Object.
   * @param {string} [options.app_release.type] - Type of App, always web in our case.
   * @param {string} [options.app_release.sdk_version] - SDK Version.
   * @param {string} [options.app_release.version] - Your sites version.
   * @param {number} [options.app_release.build_number] - Your sites build number.
   * @param {object} [options.person] - The individual starting the conversation.
   * @param {string} [options.person.name] - Their name.
   * @param {string} [options.person.email] - Their email address.
   * @param {object} [options.device] - The device starting the conversation.
   * @param {Function} [options.success] - A function to be called after a successful call.
   * @param {Function} [options.failure] - A function to be called after an unsuccessful call.
   */
  async createConversation(options: Partial<ICreateConversationOptions> = {}) {
    if (!this._hasInitialized) {
      const error = new Error(
        'SDK initialization failed and a conversation can not be created. Please check the logs for more details.'
      );

      browserEvent(browserEvents.APPTENTIVE_ERROR, { error: error.message });
      this.console('error', error.message);

      // In order to keep backwards compatibility, this needs to be resolved instead of rejected.
      // The caller will need to check for the response to be an instanceof Error to know if this call was successful or not.
      return Promise.resolve(error);
    }

    if (this.conversation && this.conversation.token) {
      this.console('info', 'Loading Conversation...');
      this.conversationSuccess(this.conversation);

      return Promise.resolve(this.conversation);
    }

    if (options.person) {
      this._logicEngine.person = options.person;
      this.db.set(localStorageKeys.person, options.person);
    }

    const device = buildDeviceMetadata(options.device);
    this._logicEngine.device = device;
    this.db.set(localStorageKeys.device, device);

    this.console('info', 'Creating Conversation...');

    const data = {
      app_release: { ...options.app_release, type: 'web', sdk_version: this.sdk.version },
      device,
      person: options.person,
      sdk: this.sdk,
      session_id: this._session_id,
    };

    return this.ajax
      .createConversation({ json: data })
      .then((response) => {
        this.conversationSuccess(response);

        if (options.success) {
          options.success(JSON.stringify(response));
        }

        return response;
      })
      .catch((error) => {
        if (options.failure) {
          options.failure();
        }

        return error;
      });
  }

  /**
   * @private
   * @param {string} [response] - The returned Conversation to be set on the SDK instance.
   */
  conversationSuccess(response: IConversationResponse) {
    this.conversation = response;

    this.console('info', 'Conversation Created:', this.conversation);
    this.db.set(localStorageKeys.conversation, this.conversation);

    this.engage(internalEvents.APPTENTIVE_INIT);
    this.engage(internalEvents.APPTENTIVE_LAUNCH);

    browserEvent(browserEvents.APPTENTIVE_INIT);
  }

  /**
   * Updates a Conversation's AppRelease and SDK objects.
   * @param {object} [options] - Your conversation configuration.
   * @param {object} [options.app_release] - Your App Release Object.
   * @param {Function} [options.success] - A function to be called after a successful conversation creation.
   * @param {Function} [options.failure] - A function to be called after an unsuccessful conversation creation.
   */
  async updateConversation(options: Partial<IUpdateConversationOptions> = {}) {
    const data = {
      id: this.conversation.id,
      sdk: this.sdk,
    } as IConversation;

    if (options.app_release) {
      data.app_release = options.app_release;
    }

    return this.ajax
      .updateConversation({ json: data })
      .then((response) => {
        this.updateConversationSuccess(response);

        if (options.success) {
          options.success(response);
        }

        return response;
      })
      .catch((error: IErrorResponse) => {
        if (options.failure) {
          options.failure();
        }

        return error;
      });
  }

  /**
   * @private
   * @param {object} [data] - The returned conversation data (app_release, sdk) to be set on our instance.
   * @param {object} [data.app_release] - An updated AppRelease object.
   * @param {object} [data.sdk] - An updated SDK object.
   */
  updateConversationSuccess(data: IConversationResponse) {
    if (data.app_release) {
      this.conversation.app_release = data.app_release;
    }

    this.conversation.sdk = data.sdk;
    this.db.set(localStorageKeys.conversation, this.conversation);
  }

  /**
   * Updates a person for the current Conversation token.
   * @param {object} person - Your person details.
   * @param {string} person.email - A required email address for this person.
   * @param {string} person.name - A required name for this person.
   * @param {object} [options] - Your person callback configuration.
   * @param {Function} [options.success] - A function to be called after a successful call.
   * @param {Function} [options.failure] - A function to be called after an unsuccessful call.
   */
  async updatePerson(person: Partial<IPerson>, options: IUpdatePersonOptions = {}) {
    if (!person || !this.conversation || !this.conversation.id) {
      const error = new Error(
        'You cannot update a person without a valid person (email, name) and a valid Conversation token.'
      );
      this.console('warn', error.message);

      return Promise.resolve(error.message);
    }

    const data = { person };

    return this.ajax
      .updatePerson({ json: data })
      .then(() => {
        this.updatePersonSuccess(data.person as IPerson);

        if (options.success) {
          options.success(JSON.stringify(data.person));
        }

        return data.person;
      })
      .catch((error: IErrorResponse) => {
        if (options.failure) {
          options.failure();
        }

        return error;
      });
  }

  /**
   * @private
   * @param {object} data - The returned person data to be set on our instance.
   */
  updatePersonSuccess(data: IPerson) {
    try {
      const updatedData = { ...this._logicEngine.person, ...data } as IPerson;
      this._logicEngine.person = updatedData;
      this.db.set(localStorageKeys.person, updatedData);
    } catch (error) {
      this.console('error', error);
    }
  }

  /**
   * Updates a device for the current Conversation token.
   * @param {object} device - Your device details.
   * @param {object} [options] - Your device callback configuration.
   * @param {Function} [options.success] - A function to be called after a successful call.
   * @param {Function} [options.failure] - A function to be called after an unsuccessful call.
   */
  async updateDevice(device: IDevice, options: IDeviceOptions = {}) {
    if (!this.conversation || !this.conversation.id) {
      const error = new Error('You cannot update a device without a valid Conversation token.');
      this.console('warn', error.message);

      return Promise.resolve(error.message);
    }

    const data = {
      device: device || buildDeviceMetadata(),
    };

    return this.ajax
      .updateDevice({ json: data })
      .then(() => {
        this.updateDeviceSuccess(data.device);

        if (options.success) {
          options.success(JSON.stringify(data.device));
        }

        return data.device;
      })
      .catch((error: IErrorResponse) => {
        if (options.failure) {
          options.failure();
        }

        return error;
      });
  }

  /**
   * @private
   * @param {object} data - The returned device data to be set on our instance.
   */
  updateDeviceSuccess(data: IDevice) {
    try {
      const updatedData = { ...this._logicEngine.device, ...data };
      this._logicEngine.device = updatedData;
      this.db.set(localStorageKeys.device, updatedData);
    } catch (error) {
      this.console('error', error);
    }
  }

  /**
   * Creates a Message on our Conversation that can be viewed and optionally responded to (if an email is present and valid) on the Apptentive dashboard.
   * @param {object} options - Your Message and callback configuration.
   * @param {string} options.body - The text of your Message.
   * @param {object} [options.custom_data] - Any identifying metadata for the Message.
   * @param {Function} [options.success] - A function to be called after a successful call.
   * @param {Function} [options.failure] - A function to be called after an unsuccessful call.
   * @see https://be.apptentive.com/apps/current/conversations
   */
  async createMessage(options: ICreateMessageOptions) {
    const nonce = gguid();
    const data = {
      message: {
        type: 'CompoundMessage',
        nonce,
        body: options.body,
        hidden: false,
        custom_data: options.custom_data,
        client_created_at: Date.now(),
        client_created_at_utc_offset: this._date.getTimezoneOffset(),
        session_id: this._session_id,
      },
    };

    return this.ajax
      .createMessage({ json: data })
      .then((response) => {
        this.createMessageSuccess(response);

        if (options.success) {
          options.success(JSON.stringify(response));
        }

        return response;
      })
      .catch((error: IErrorResponse) => {
        if (options.failure) {
          options.failure(error);
        }

        return error.message;
      });
  }

  /**
   * @private
   * @param {object} [data] - The returned Message to be set on the SDK instance. This is primarily for debugging purposes.
   */
  createMessageSuccess(data: ICreateMessageResponse) {
    this.console('info', 'Created Message', data);
    browserEvent(browserEvents.APPTENTIVE_MESSAGES_CREATED);

    if (this._isDebug) {
      this.last_message = data;
    }
  }

  /**
   * Fetches a manifest in a given locale.
   * @param {string} locale The locale to fetch a manifest in.
   * @param {object?} options The callback configuration for this call
   * @param {Function} [options.success] - A function to be called after a successful call.
   */
  async fetchManifest(locale: string, options: IFetchManifestOptions = {}) {
    // Currently the manifest endpoint does not require authorization so a conversation is not required
    // if (!this.conversation || !this.conversation.id) {
    //   const error = 'Attempted to fetch Conversation Manifest before a conversation was created.';
    //   browserEvent(browserEvents.APPTENTIVE_ERROR, { error });
    //   this.console('error', error);
    //   return;
    // }

    if (!locale) {
      const error = new Error('Attempted to fetch Conversation Manifest without a locale.');
      browserEvent(browserEvents.APPTENTIVE_ERROR, { error: error.message });
      this.console('error', error.message);

      return Promise.resolve(error.message);
    }

    return this.ajax
      .fetchManifest({}, locale)
      .then((response) => {
        this.fetchManifestSuccess(locale, response);

        if (options.success) {
          options.success(locale, JSON.stringify(response));
        }

        return { locale, response };
      })
      .catch((error: IErrorResponse) => error);
  }

  /**
   * Handle the fetched manifest.
   * @private
   * @param {string} locale The locale to fetch a manifest in.
   * @param {string} manifest The manifest data to process.
   */
  fetchManifestSuccess(locale: string, manifest: IManifest) {
    try {
      browserEvent(browserEvents.APPTENTIVE_MESSAGES_FETCHED, manifest);
      this.console('info', 'Processing Manifest for locale:', locale, manifest);

      this._logicEngine.interactions = manifest.interactions;
      this._logicEngine.targeted_events = manifest.targets;
      this.i18n.add(locale, manifest);
      this.i18n.setDefaultLanguage(locale);

      // Once the manifest is in place, check the query string for an interaction to trigger
      this.parseInteractionQueryString();
    } catch (error) {
      this.console('error', 'Error with manifest for locale', locale, error);
      browserEvent(browserEvents.APPTENTIVE_ERROR, error as any);
    }
  }

  /**
   * Cache a manifest in session storage to be able to restore later.
   * @param {string} manifest The manifest data being saved.
   * @param {string} locale The locale the manifest is being stored for.
   */
  cacheManifest(manifest: string, locale?: string) {
    // Create an expiration time that is 30 minutes in the future.
    const expirationDate = new Date();
    expirationDate.setMinutes(expirationDate.getMinutes() + 30);

    try {
      window.sessionStorage.setItem(sessionStorageKeys.manifestCache, manifest);
      window.sessionStorage.setItem(sessionStorageKeys.manifestExpiration, expirationDate.getTime().toString());

      this.console('info', `Cached manifest for ${locale ?? 'default'} language.`);
    } catch (error) {
      this.console('error', 'Error caching manifest', error);
      browserEvent(browserEvents.APPTENTIVE_ERROR, error as any);
    }
  }

  /**
   * Clear all cached manifests in session storage.
   */
  clearManifestCache() {
    try {
      window.sessionStorage.removeItem(sessionStorageKeys.manifestCache);
      window.sessionStorage.removeItem(sessionStorageKeys.manifestExpiration);
    } catch (error) {
      this.console('error', 'Error clearing cached manifest', error);
      browserEvent(browserEvents.APPTENTIVE_ERROR, error as any);
    }
  }

  /**
   * Restores a previously cached manifest.
   * @param {string} localeOverride - The locale string to override the current language with
   */
  restoreOrFetchManifest(localeOverride: string | null) {
    const cachedManifest = window.sessionStorage.getItem(sessionStorageKeys.manifestCache);
    const cacheExpiration = window.sessionStorage.getItem(sessionStorageKeys.manifestExpiration);
    const hasExpired = !cacheExpiration || this._date.getTime().toString() > cacheExpiration;

    if (localeOverride) {
      this.currentLanguage = localeOverride;
    }

    // If there is no cachedManifest or the current time is past the cacheExpiration, refetch the manifest
    if (!cachedManifest || hasExpired) {
      this.console(
        'info',
        `Fetching a new manifest since ${
          !cachedManifest ? 'there is not one cached locally' : 'the cached one has expired'
        }.`
      );

      this.fetchManifest(this.currentLanguage, {
        success: (_, manifest) => {
          this.cacheManifest(manifest);
        },
      });

      return;
    }

    this.console('info', `Restoring cached manifest for ${this.currentLanguage}.`);
    this.fetchManifestSuccess(this.currentLanguage, JSON.parse(cachedManifest));
  }

  /**
   * Sets the locale and loads the correct manifest.
   * @param {string} locale The locale to fetch a manifest in.
   * @param {object?} options The callback configuration for this call
   * @param {Function} [options.success] - A function to be called after a successful call.
   */
  setLocale(locale: string, options = {} as IFetchManifestOptions) {
    // Only refetch the manifest if the locale is different than the current language
    if (this.currentLanguage !== locale) {
      this.currentLanguage = locale;
      this.fetchManifest(locale, {
        // Save the locale and manifest in session storage to be able to restore later
        success: (localeString, manifest) => {
          window.sessionStorage.setItem(sessionStorageKeys.manifestLocale, localeString);
          this.cacheManifest(manifest, localeString);

          if (options.success) {
            options.success(localeString, manifest);
          }
        },
      });
    }
  }

  /**
   * Triggers the passed in event label and engages any events assigned to be triggered by that event that pass their crtieria.
   * @param {string} label - The label of your event.
   * @param {object} [eventData] - An object of custom data to attach to the event.
   * @see https://be.apptentive.com/apps/current/events
   */
  engage(label: string, eventData?: IEngageEventCustomData) {
    if (this._isCaptureDisabled) {
      return;
    }

    if (!label) {
      const error = 'You cannot engage Events without passing in an event label.';
      this.console('error', error);
      return;
    }

    if (typeof label !== 'string') {
      const error = 'Event label must be a string.';
      this.console('error', error);
      return;
    }

    const labelPrefixed = prefixEventName(label);

    const nonce = gguid();
    const data = {
      event: {
        label: labelPrefixed,
        nonce,
        client_created_at: Date.now(),
        client_created_at_utc_offset: this._date.getTimezoneOffset(),
        session_id: this._session_id,
      } as IEngageEvent,
    };

    if (eventData) {
      if (eventData.interaction_id) {
        data.event.interaction_id = eventData.interaction_id;
        // eslint-disable-next-line no-param-reassign
        delete eventData.interaction_id;
      }

      data.event.data = eventData;
    }

    // Check for interactions.
    const interaction = this._logicEngine.engageEvent(labelPrefixed, eventData as any);

    if (interaction) {
      browserEvent(browserEvents.APPTENTIVE_RENDER_INTERACTION, { interaction });
      ApptentiveDisplay(interaction, this, { domNode: this.options.domNode });
    }

    this.db.set(localStorageKeys.codePoint, this._logicEngine.code_point);
    this.db.set(localStorageKeys.interactionCounts, this._logicEngine.interaction_counts);
    this.db.set(localStorageKeys.random, this._logicEngine.random);

    this.ajax
      .createEvent({ json: data })
      .then((_response) => {
        this.engageSuccess({ label: data.event.label, data: data.event.data });
      })
      .catch((_error) => {});
  }

  /**
   * @private
   * @param {object} [event] - The returned event to be set on the SDK instance.
   * @param {string} [event.label] - The label of the event.
   * @param {object} [event.data] - The optional event data from the event.
   */
  engageSuccess(event: { label: string; data?: IEngageEventCustomData }) {
    this.console('info', 'Engaged Event:', event);

    if (this._isDebug) {
      this.last_event = event;
    }
  }

  /**
   * Identifys a person for the current Conversation token.
   * @param {object} person - Your person details.
   * @param {string} person.unique_token - A required unique identifier for this person.
   * @param {string} person.secret - A required Conversation token this person.
   * @param {Function} [person.success] - A function to be called after a successful call.
   * @param {Function} [person.failure] - A function to be called after an unsuccessful call.
   */
  async identifyPerson(person: IIdentifyPersonOptions) {
    if (!this.conversation || !this.conversation.id) {
      const error = new Error('Attempted to identify a Person before a conversation was created.');
      browserEvent(browserEvents.APPTENTIVE_ERROR, { error: error.message });
      this.console('error', error.message);

      return Promise.resolve(error.message);
    }

    if (!person || !person.unique_token) {
      const error = new Error('You cannot identify a person without a valid person object and a valid unique_token.');
      this.console('warn', error.message, person);

      return Promise.resolve(error.message);
    }

    const data = {
      person: {
        ...person,
        secret: this.conversation.token,
      },
    };

    return this.ajax
      .identifyPerson({ json: data })
      .then((response) => {
        this.identifyPersonSuccess(response as IPerson);

        if (person.success) {
          person.success(JSON.stringify(response));
        }
      })
      .catch((error: IErrorResponse) => {
        // A 422 error code means that the entity is unprocessable and the conversation is already identified
        this.identifyPersonError(person, error.response.status === 422);

        if (person.failure) {
          person.failure();
        }

        return error;
      });
  }

  /**
   * @private
   * @param {object} [person] - The returned person data to be set on the SDK instance.
   */
  identifyPersonSuccess(person: IPerson) {
    try {
      this.console('info', 'Identified Person:', person);

      if (this.conversation && this.conversation.id) {
        this.conversation.person = person;
      } else {
        this.console('warn', 'Identified a person without a Conversation.');
      }

      this._logicEngine.person = person;
      this.db.set(localStorageKeys.person, person);
    } catch (error) {
      this.console('error', 'Identified Person response was not JSON:', error);
    }
  }

  /**
   * @private
   * @param {object} [person] - The returned params from the previous failed call.
   * @param {boolean} [isAlreadyIdentified] - Whether or not the conversation has already been identified.
   */
  identifyPersonError(person: IIdentifyPersonOptions, isAlreadyIdentified = false) {
    if (isAlreadyIdentified && person && person.unique_token) {
      this.console('info', 'Already Identified Person:', person);
      this.console('info', 'Clearing Conversation for new Conversation...');
      this.db.empty();
      this.conversation = {} as IConversation;

      // Create a new conversation with the person that failed identification
      // One scenario for this is trying to identify a new person with a previous conversation id
      // in the case that a conversation was for person A, they logout, then person B logs in
      this.createConversation({ person });
    } else {
      this.console('info', 'There was an issue associating a person to the current conversation');
    }
  }

  /**
   * The internal debug output utility.
   * @param {string} method - The console method, such as info, log, error, warn, etc.
   * @param {...any} args - The data to log.
   * @private
   */
  console(method: string, ...args: any[]) {
    let consoleMethod = method;

    if (!['error', 'info', 'log', 'warn'].includes(method)) {
      args.unshift(method);
      consoleMethod = 'info';
    }

    if (this._isDebug && typeof window !== 'undefined' && window.console) {
      // eslint-disable-next-line no-console, @typescript-eslint/no-explicit-any
      (window.console as any)[consoleMethod]('%c[Base]', 'color: #ff414d;', ...args);
    }
  }

  /**
   * Set the current page name for tracking.
   * @param {string} pageName - The custom name for the page.
   */
  setPageName(pageName: string) {
    this.ajax.pageName = `${pageName}`;
  }

  /**
   * Show Message Center, if a MessageCenter interaction is avaliable.
   */
  showMessageCenter() {
    if (!this._logicEngine) {
      this.console('error', 'Logic Engine not initialized.');
      return;
    }

    // Check for interactions.
    const interactions = this._logicEngine.interactionFromType('MessageCenter');
    if (interactions && Array.isArray(interactions) && interactions.length > 0) {
      browserEvent(browserEvents.APPTENTIVE_RENDER_INTERACTION, { interaction: interactions[0] });
      ApptentiveDisplay(interactions[0], this, { domNode: this.options.domNode });
    } else {
      this.console('warn', 'Message Center not found.');
    }
  }

  /**
   * Show Interaction, if a given interaction is avaliable.
   * @param {string} id - The BSON ID for the interaction to show.
   */
  showInteraction(id: string) {
    if (!this._logicEngine) {
      this.console('error', 'Logic Engine not initialized.');
      return;
    }
    // Check for interactions.
    if (id) {
      const interaction = this._logicEngine.interactionFromId(id);
      if (interaction) {
        browserEvent(browserEvents.APPTENTIVE_RENDER_INTERACTION, { interaction });
        ApptentiveDisplay(interaction, this, { domNode: this.options.domNode });
      } else {
        this.console('warn', 'Interaction not found:', id);
      }
    }
  }

  /**
   * Load a given Interaction, if a given interaction is avaliable.
   * @param {string} id - The BSON ID for the interaction to show.
   * @returns {object|undefined} Returns the found Interaction or undefined.
   */
  loadInteraction(id: string) {
    if (!this._logicEngine) {
      this.console('error', 'Logic Engine not initialized.');
      return undefined;
    }

    // Check for interactions.
    if (id) {
      const interaction = this._logicEngine.interactionFromId(id);
      if (interaction) {
        return interaction;
      }
    }

    this.console('warn', 'Interaction not found:', id);
    return undefined;
  }

  /**
   * @static
   * @returns {string} - The current Apptentive SDK version.
   */
  static version() {
    return `${version}`;
  }
}

// This method is what ultimately scaffolds the SDK to the page, but is extremely difficult to test outside of integration tests
/* istanbul ignore next */
if (window && window.ApptentiveSDK && (window.ApptentiveSDK as any).config) {
  const base = new ApptentiveBase((window.ApptentiveSDK as any).config);
  window.ApptentiveSDK = base;
  browserEvent(browserEvents.APPTENTIVE_READY);
}
