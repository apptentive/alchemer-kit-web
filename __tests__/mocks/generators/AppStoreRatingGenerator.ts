import { IAppStoreRatingConfiguration } from '../../../src/interfaces/interactions/IAppStoreRatingConfiguration';
import { IInteraction } from '../../../src/interfaces/manifest/IInteraction';

interface IAppStoreRatingGeneratorOptions {
  id?: string;
  storeId?: string;
  method?: string;
}

export default class AppStoreRatingGenerator {
  private _id = Math.floor(Math.random() * 100000);
  private _config = {
    api_version: 12,
    configuration: {},
    type: 'AppStoreRating',
    version: 1,
  } as IInteraction<IAppStoreRatingConfiguration>;

  constructor(options = {} as IAppStoreRatingGeneratorOptions) {
    this._config.id = options.id ?? `app_store_rating_${this._id}`;
    this._config.configuration.store_id = options.storeId ?? 'mock_store_id';
    this._config.configuration.method = options.method ?? 'app_store';
  }

  get config() {
    return this._config;
  }

  withoutStoreId() {
    delete (this._config.configuration as any).store_id;

    return this;
  }

  withoutMethod() {
    delete (this._config.configuration as any).method;

    return this;
  }

  withoutConfiguration() {
    delete (this._config as any).configuration;

    return this;
  }

  withEmptyConfiguration() {
    (this._config as any).configuration = {};

    return this;
  }
}
