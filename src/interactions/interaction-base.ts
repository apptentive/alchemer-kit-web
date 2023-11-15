import type ApptentiveBase from '../base';
import { IInteraction } from '../interfaces/manifest/IInteraction';
import { IBaseInteractionOptions } from '../interfaces/interactions/IBaseInteractionOptions';

export default class ApptentiveInteraction<T> {
  public interaction: IInteraction<T>;
  public date: Date;
  public sdk: ApptentiveBase;
  public options: IBaseInteractionOptions;
  public domNode: HTMLElement;
  /**
   * The base class for all Apptentive WebSDK Interactions.
   *
   * @param {object} interaction - Your interaction object.
   * @param {object} sdk - The ApptentiveSDK instance.
   * @param {object} options - Your configuration options.
   * @param {string} options.domNode - HTML DOM Node to insert into.
   */
  constructor(interaction: IInteraction<T>, sdk: ApptentiveBase, options?: IBaseInteractionOptions) {
    this.interaction = interaction;
    this.date = new Date();
    this.sdk = sdk;
    this.options = options || ({} as IBaseInteractionOptions);
    this.domNode = document.querySelector('body')!;

    if (this.options.domNode) {
      const customDomNode = document.querySelector<HTMLElement>(this.options.domNode);

      if (customDomNode) {
        this.sdk.console('info', `Using DOM Node '${this.options.domNode}' for interactions`);
        this.domNode = customDomNode;
      } else {
        this.sdk.console('warn', `Missing DOM Node '${this.options.domNode}' for interactions, falling back to 'body'`);
      }
    }
  }
}
