import { ITextModalAction } from '../../../src/interfaces/interactions/text-modal/ITextModalAction';
import { ITextModalActionInvoke } from '../../../src/interfaces/interactions/text-modal/ITextModalActionInvoke';

interface INoteActionGeneratorOptions {
  id?: string;
  action?: string;
  label?: string;
  invokes?: ITextModalActionInvoke[];
}

export default class NoteActionGenerator {
  private _id = Math.floor(Math.random() * 100000);
  private _config = {} as ITextModalAction;

  constructor(options = {} as INoteActionGeneratorOptions) {
    this._config.id = options.id ?? `note_action_${this._id}`;
    this._config.action = options.action ?? 'dismiss';
    this._config.label = options.label ?? 'Mock Label';
    this._config.invokes = options.invokes;
  }

  get config() {
    return this._config;
  }

  withInvokes(invokes: ITextModalActionInvoke[]) {
    this._config.invokes = invokes;

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
