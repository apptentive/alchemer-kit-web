import ApptentiveBase from '../../../src/base';
import { sessionStorageKeys } from '../../../src/constants/storageKeys';
import { IApptentiveSdkOptions } from '../../../src/interfaces/sdk/IApptentiveSdkOptions';
import { _apiToken, _appId, _conversationId, _conversationToken, _host } from '../data/shared-constants';

export default class ApptentiveBaseBuilder {
  private _cacheExpirationTime;
  private _options = {
    id: _appId,
    token: _apiToken,
    host: _host,
    interactions: [] as any,
    targeted_events: [] as any,
  } as IApptentiveSdkOptions;
  private _sdkInstance!: ApptentiveBase;

  constructor() {
    const cacheExpirationDate = new Date();
    cacheExpirationDate.setMinutes(cacheExpirationDate.getMinutes() + 30);

    this._cacheExpirationTime = cacheExpirationDate.getTime().toString();
  }

  get sdk() {
    if (!this._sdkInstance) {
      throw Error('The build() method must be run before accessing the SDK instance!');
    }

    return this._sdkInstance;
  }

  build() {
    this._sdkInstance = new ApptentiveBase(this._options);

    return this;
  }

  useCachedManifest(
    manifest: { interactions: []; targets: Record<string, unknown> } = { interactions: [], targets: {} },
    cacheExpirationOverride = this._cacheExpirationTime
  ) {
    // Set an empty cached manifest to prevent the SDK from fetching it on initialization.
    window.sessionStorage.setItem(sessionStorageKeys.manifestCache, JSON.stringify(manifest));
    window.sessionStorage.setItem(sessionStorageKeys.manifestExpiration, cacheExpirationOverride);

    return this;
  }

  useOptions(options: Partial<IApptentiveSdkOptions>) {
    this._options = {
      ...this._options,
      ...options,
    };

    return this;
  }

  withConversation() {
    if (!this._sdkInstance) {
      throw Error('The build() method must be run before modifying the SDK instance!');
    }

    this._sdkInstance.conversation = {
      id: _conversationId,
      device_id: 'DEVICE_ID',
      person_id: 'PERSON_ID',
      sdk: {} as any, // TODO: Update this to a real SDK data object
      state: 'new',
      token: _conversationToken,
    };

    this._sdkInstance.api.conversation = { id: _conversationId, token: _conversationToken };

    return this;
  }
}
