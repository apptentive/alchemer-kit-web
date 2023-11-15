import { ITextModalConfiguration } from '../../../src/interfaces/interactions/ITextModalConfiguration';
import { ITextModalAction } from '../../../src/interfaces/interactions/text-modal/ITextModalAction';
import { IInteraction } from '../../../src/interfaces/manifest/IInteraction';
import NoteActionGenerator from './NoteActionGenerator';

interface INoteGeneratorOptions {
  id?: string;
  title?: string;
  body?: string;
  name?: string;
  actions?: ITextModalAction[];
}

export default class NoteGenerator {
  private _id = Math.floor(Math.random() * 100000);
  private _config = {
    api_version: 12,
    configuration: {},
    type: 'TextModal',
    version: 1,
  } as IInteraction<ITextModalConfiguration>;

  constructor(options = {} as INoteGeneratorOptions) {
    this._config.id = options.id ?? `note_${this._id}`;
    this._config.configuration.title = options.title ?? 'We would love your feedback!';
    this._config.configuration.body = options.body ?? 'Could you help with a quick 3 minute survey?';
    this._config.configuration.name = options.name ?? 'Mock Note';
    this._config.configuration.actions = [];

    if (options.actions) {
      options.actions.forEach((action) => {
        const actionConfig = new NoteActionGenerator(action).config;
        this._config.configuration.actions.push(actionConfig);
      });
    }
  }

  get config() {
    return this._config;
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
