import { INavigateToLinkConfiguration } from '../../../src/interfaces/interactions/INavigateToLinkConfiguration';
import { IInteraction } from '../../../src/interfaces/manifest/IInteraction';

type NavigateToLinkTarget = 'self' | 'new';

interface INavigateToLinkGeneratorOptions {
  id?: string;
  target?: NavigateToLinkTarget;
  url?: string;
}

export default class NavigateToLinkGenerator {
  private _id = Math.floor(Math.random() * 100000);
  private _config = {
    api_version: 12,
    configuration: {},
    type: 'NavigateToLink',
    version: 1,
  } as IInteraction<INavigateToLinkConfiguration>;

  constructor(options = {} as INavigateToLinkGeneratorOptions) {
    this._config.id = options.id ?? `navigate_to_link_${this._id}`;
    this._config.configuration.url = options.url ?? 'myapp://show_content/mock_content_id';
    this._config.configuration.target = options.target ?? 'self';
  }

  get config() {
    return this._config;
  }

  withoutTarget() {
    delete (this._config.configuration as any).target;

    return this;
  }

  withoutUrl() {
    delete (this._config.configuration as any).url;

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
