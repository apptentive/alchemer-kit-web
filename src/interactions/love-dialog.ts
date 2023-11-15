/* exported ApptentiveLoveDialog */
import browserEvent from '../browser-event';
import browserEvents from '../constants/browser-events';
import internalEvents from '../constants/events';
import type ApptentiveBase from '../base';
import ApptentiveInteraction from './interaction-base';

import { ILoveDialogConfiguration } from '../interfaces/interactions/ILoveDialogConfiguration';
import { IInteraction } from '../interfaces/manifest/IInteraction';
import { IBaseInteractionOptions } from '../interfaces/interactions/IBaseInteractionOptions';
import renderTitle from './components/love-dialog/renderTitle';
import renderActions from './components/love-dialog/renderActions';
import renderCloseLink from './components/love-dialog/renderCloseLink';

export default class ApptentiveLoveDialog extends ApptentiveInteraction<ILoveDialogConfiguration> {
  private container!: HTMLElement;

  /**
   * @param {object} interaction - The Love Dialog object.
   * @param {object} interaction.configuration - The configuration used to attempt to show the Love Dialog.
   * @param {string} interaction.configuration.position - The placement CSS classname to position the dialog.
   * @param {string} interaction.configuration.title - The text title to render.
   * @param {string} interaction.configuration.no_text - The text to render for the 'Do Not Love' button.
   * @param {string} interaction.configuration.yes_text - The text to render for the 'Love' button.
   * @param {object} sdk - The Apptentive WebSDK object.
   * @param {object} [options] - Your configuration options.
   */
  constructor(
    interaction: IInteraction<ILoveDialogConfiguration>,
    sdk: ApptentiveBase,
    options: IBaseInteractionOptions
  ) {
    super(interaction, sdk, options);

    this.renderContainer = this.renderContainer.bind(this);
    this.render = this.render.bind(this);
    this.cancel = this.cancel.bind(this);
    this.dismiss = this.dismiss.bind(this);
    this.close = this.close.bind(this);

    if (!interaction || !interaction.configuration) {
      const error = 'Invalid Love Dialog provided.';
      browserEvent(browserEvents.APPTENTIVE_LOVE_DIALOG_ERROR, { error });
      this.sdk.console('error', 'Invalid Love Dialog provided.');
    }
  }

  /**
   * Renders the Love Dialog container and content (title, yes, no).
   *
   * @param {string} id - The Love Dialog id.
   * @param {object} config - The Love Dialog configuration.
   * @param {string} config.position - The placement CSS classname to position the dialog.
   * @param {string} config.title - The text title to render.
   * @param {string} config.no_text - The text to render for the 'Do Not Love' button.
   * @param {string} config.yes_text - The text to render for the 'Love' button.
   * @returns {HTMLDivElement} - The container DOM Node.
   */
  renderContainer(id: string, config: ILoveDialogConfiguration) {
    const content = document.createElement('div');
    content.classList.add('apptentive-love-dialog-content');

    content.append(renderCloseLink(this.cancel));
    content.append(renderTitle(config.title));
    content.append(
      renderActions(
        config.yes_text,
        (event) => {
          browserEvent(browserEvents.APPTENTIVE_LOVE_DIALOG_YES, event);
          this.sdk.engage(internalEvents.APPTENTIVE_LOVE_DIALOG_YES, {
            id: this.interaction.id,
            interaction_id: this.interaction.id,
            label: config.yes_text,
          });
          this.close();
        },
        config.no_text,
        (event) => {
          browserEvent(browserEvents.APPTENTIVE_LOVE_DIALOG_NO, event);
          this.sdk.engage(internalEvents.APPTENTIVE_LOVE_DIALOG_NO, {
            id: this.interaction.id,
            interaction_id: this.interaction.id,
            label: config.no_text,
          });
          this.close();
        }
      )
    );

    const container = document.createElement('apptentive-love-dialog');
    container.id = `apptentive-love-dialog-${id}`;
    container.classList.add('fixed');
    container.classList.add(config.position || 'corner');
    container.append(content);

    return container;
  }

  /**
   * Renders a given Love Dialog.
   */
  render() {
    if (!this.interaction || (this.interaction && (!this.interaction.id || !this.interaction.configuration))) {
      const error = 'You cannot render a Love Dialog without providing a valid Love Dialog configuration object.';
      browserEvent(browserEvents.APPTENTIVE_LOVE_DIALOG_ERROR, { error });
      this.sdk.console('error', `${error} You provided:`, this.interaction);
      return;
    }

    if (document.querySelectorAll(`#apptentive-love-dialog-${this.interaction.id}`).length > 0) {
      this.sdk.console('warn', `Love Dialog ${this.interaction.id} is already rendered.`);
      return;
    }

    this.container = this.renderContainer(this.interaction.id, this.interaction.configuration);
    this.domNode.append(this.container);
    this.container.focus();

    browserEvent(browserEvents.APPTENTIVE_LOVE_DIALOG_LAUNCH);
    this.sdk.engage(internalEvents.APPTENTIVE_LOVE_DIALOG_LAUNCH, {
      id: this.interaction.id,
      interaction_id: this.interaction.id,
    });
  }

  /**
   * Cancel a rendered Love Dialog from view.
   *
   * @param {Event} event - The browser event.
   */
  cancel(event: Event) {
    if (this.sdk) {
      browserEvent(browserEvents.APPTENTIVE_LOVE_DIALOG_CANCEL, event);
      this.sdk.engage(internalEvents.APPTENTIVE_LOVE_DIALOG_CANCEL, {
        id: this.interaction.id,
        interaction_id: this.interaction.id,
      });
    }
    this.close();
  }

  /**
   * Dismiss a rendered Love Dialog from view.
   *
   * @param {Event} event - The browser event.
   */
  dismiss(event: Event) {
    if (this.sdk) {
      browserEvent(browserEvents.APPTENTIVE_LOVE_DIALOG_DISMISS, event);
      this.sdk.engage(internalEvents.APPTENTIVE_LOVE_DIALOG_DISMISS, {
        id: this.interaction.id,
        interaction_id: this.interaction.id,
      });
    }
    this.close();
  }

  /**
   * Dismiss a rendered Love Dialog from view.
   */
  close() {
    if (this.container) {
      browserEvent(browserEvents.APPTENTIVE_LOVE_DIALOG_CLOSE);
      this.container.remove();
    }
  }

  /**
   * Construct and render a Love Dialog helper method.
   *
   * @param {object} interaction - The Love Dialog object.
   * @param {object} interaction.configuration - The configuration used to attempt to show the Love Dialog.
   * @param {string} interaction.configuration.position - The placement CSS classname to position the dialog.
   * @param {string} interaction.configuration.title - The text title to render.
   * @param {string} interaction.configuration.no_text - The text to render for the 'Do Not Love' button.
   * @param {string} interaction.configuration.yes_text - The text to render for the 'Love' button.
   * @param {object} sdk - The Apptentive WebSDK object.
   * @param {object} [options] - Your configuration options.
   * @static
   */
  static display(
    interaction: IInteraction<ILoveDialogConfiguration>,
    sdk: ApptentiveBase,
    options: IBaseInteractionOptions
  ) {
    try {
      const loveDialog = new ApptentiveLoveDialog(interaction, sdk, options);
      loveDialog.render();
    } catch (_) {}
  }
}
