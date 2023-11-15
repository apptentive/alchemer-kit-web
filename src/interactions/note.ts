/* exported ApptentiveNote */
// https://apptentive.atlassian.net/wiki/display/APPTENTIVE/TextModal+Interaction
import ApptentiveDisplay from '../display';
import browserEvent from '../browser-event';
import browserEvents from '../constants/browser-events';
import internalEvents from '../constants/events';

import type ApptentiveBase from '../base';
import ApptentiveInteraction from './interaction-base';
import { ITextModalConfiguration } from '../interfaces/interactions/ITextModalConfiguration';
import { IInteraction } from '../interfaces/manifest/IInteraction';
import { IBaseInteractionOptions } from '../interfaces/interactions/IBaseInteractionOptions';
import { ITextModalAction } from '../interfaces/interactions/text-modal/ITextModalAction';

export default class ApptentiveNote extends ApptentiveInteraction<ITextModalConfiguration> {
  private container!: HTMLElement;

  /**
   * @param {object} interaction - The Note object.
   * @param {object} sdk - The Apptentive WebSDK object.
   * @param {object} [options] - Your configuration options.
   */
  constructor(
    interaction: IInteraction<ITextModalConfiguration>,
    sdk: ApptentiveBase,
    options = {} as IBaseInteractionOptions
  ) {
    super(interaction, sdk, options);

    this.renderContainer = this.renderContainer.bind(this);
    this.renderTitle = this.renderTitle.bind(this);
    this.renderBody = this.renderBody.bind(this);
    this.noteOverlay = this.noteOverlay.bind(this);
    this.noteAction = this.noteAction.bind(this);
    this.renderNoteAction = this.renderNoteAction.bind(this);
    this.renderNoteActions = this.renderNoteActions.bind(this);
    this.render = this.render.bind(this);
    this.cancel = this.cancel.bind(this);
    this.dismiss = this.dismiss.bind(this);
    this.close = this.close.bind(this);

    if (
      !interaction ||
      !interaction.configuration ||
      !interaction.configuration.actions ||
      !Array.isArray(interaction.configuration.actions)
    ) {
      const error = 'You cannot render a Note without providing a valid Note configuration object. You provided:';
      browserEvent(browserEvents.APPTENTIVE_NOTE_ERROR, { error });
      this.sdk.console('error', error, interaction);
    }
  }

  /**
   * Renders the Note container and content (overlay, title, body, actions).
   * @returns {HTMLDivElement} - The DOM Node
   */
  renderContainer() {
    const overlay = document.createElement('div');
    overlay.className = 'apptentive-note-overlay';
    overlay.addEventListener('click', this.noteOverlay);

    const content = document.createElement('div');
    content.className = `apptentive-note-content fixed ${this.interaction.configuration.position || 'corner'}`;
    content.append(this.renderTitle());
    content.append(this.renderBody());
    content.append(this.renderNoteActions());

    const container = document.createElement('apptentive-note');
    container.id = `apptentive-note-${this.interaction.id}`;
    container.append(overlay);
    container.append(content);

    return container;
  }

  /**
   * Renders the Note header (title).
   * @returns {HTMLDivElement} - The DOM Node
   */
  renderTitle() {
    const title = document.createElement('div');
    title.className = 'apptentive-note-title';

    const header = document.createElement('h1');
    header.textContent = this.sdk.i18n.translate(`${this.interaction.id}.configuration.title`); // config && config.title ? config.title : '';

    title.append(header);

    return title;
  }

  /**
   * Renders the Note body text.
   * @returns {HTMLDivElement} - The DOM Node
   */
  renderBody() {
    const body = document.createElement('div');
    body.className = 'apptentive-note-body';
    body.textContent = this.sdk.i18n.translate(`${this.interaction.id}.configuration.body`);

    return body;
  }

  /**
   * Handle clicking on a given Note's overlay.
   * @param {object} event The browser event.
   */
  noteOverlay(event: Event) {
    browserEvent(browserEvents.APPTENTIVE_OVERLAY_CLICK, event);
    this.cancel(event);
  }

  /**
   * Handle clicking on a given Note's action button.
   * @param {object} action - The Note Action configuration.
   * @param {string} action.action - The action type.
   * @param {string} action.id - The action BSON ID.
   * @param {string} action.label - The action display text.
   * @param {object[]} action.invokes - The possible criterias & events the action could invoke.
   * @param {number} index - The Note Action index in the list of actions.
   * @returns {Function} Click handler.
   */
  noteAction(action: ITextModalAction, index: number) {
    const noop = (event: Event) => {
      browserEvent(browserEvents.APPTENTIVE_NOTE_CLICK, event);
      this.sdk.console('error', 'Unknown Action: ', action && action.action ? action.action : undefined);
    };

    if (!action || !action.action) {
      return noop;
    }

    switch (action.action) {
      case 'interaction':
        return (event: Event) => {
          this.sdk.console('info', 'Clicked Interaction:', action, index);
          browserEvent(browserEvents.APPTENTIVE_NOTE_CLICK, event);
          if (!action.invokes || !Array.isArray(action.invokes)) {
            return;
          }
          action.invokes.forEach((invocation) => {
            this.sdk.console('info', 'Checking invocation:', invocation);
            const interaction = this.sdk.logicEngine.interactionForInvocations([invocation]);

            if (interaction) {
              this.sdk.console('info', 'Found interaction:', interaction);
              this.sdk.engage(internalEvents.APPTENTIVE_NOTE_CLICK_INTERACTION, {
                id: this.interaction.id,
                interaction_id: this.interaction.id,
                action_id: action.id,
                invoked_interaction_id: interaction.id,
                label: action.label,
                position: index,
              });
              ApptentiveDisplay(interaction, this.sdk);
              this.close();
            }
          });
        };
      case 'dismiss':
        return (event: Event) => {
          this.sdk.console('info', 'Clicked Dismiss', action, index);
          browserEvent(browserEvents.APPTENTIVE_NOTE_CLICK, event);
          this.dismiss(action, index);
        };
      default:
        return noop;
    }
  }

  /**
   * Renders a given Note's actions as buttons.
   * @param {object} action - The Note Action configuration.
   * @param {string} action.action - The action type.
   * @param {string} action.id - The action BSON ID.
   * @param {string} action.label - The action display text.
   * @param {object[]} action.invokes - The possible criterias & events the action could invoke.
   * @param {number} index - The Note Action index in the list of actions.
   * @returns {HTMLDivElement} - The DOM Node
   */
  renderNoteAction(action: ITextModalAction, index: number) {
    const node = document.createElement('div');
    node.className = `apptentive-note-action ${action.action || ''}`;
    node.id = `action-${action.id || ''}`;

    const click = this.noteAction(action, index);
    node.addEventListener('click', click.bind(this));

    const label = document.createElement('h2');
    label.className = 'apptentive-note-label';
    label.textContent = action.label || '';

    node.append(label);

    return node;
  }

  /**
   * Renders a given Notes set of actions.
   * @returns {HTMLDivElement} - The DOM Node
   */
  renderNoteActions() {
    const actions = document.createElement('div');
    actions.className = 'apptentive-note-actions';

    if (!this.interaction.configuration || !Array.isArray(this.interaction.configuration.actions)) {
      return actions;
    }

    if (this.interaction.configuration.actions.length >= 3) {
      actions.className = 'apptentive-note-actions tall';
    }

    this.interaction.configuration.actions.forEach((action, index) => {
      const actionNode = this.renderNoteAction(action, index);
      if (actionNode) {
        actions.append(actionNode);
      }
    });

    return actions;
  }

  /**
   * Renders a given Note.
   * @private
   */
  render() {
    // Do not render if it is invalid.
    if (
      !this.interaction ||
      (this.interaction &&
        (!this.interaction.id ||
          !this.interaction.configuration ||
          !this.interaction.configuration.actions ||
          !Array.isArray(this.interaction.configuration.actions)))
    ) {
      const error = 'You cannot render a Note without providing a valid Note configuration object.';

      browserEvent(browserEvents.APPTENTIVE_NOTE_ERROR, { error });
      this.sdk.console('error', `${error} You provided:`, this.interaction);
      return;
    }

    if (document.querySelectorAll(`#apptentive-note-${this.interaction.id}`).length > 0) {
      this.sdk.console('warn', `Note ${this.interaction.id} is already rendered.`);
      return;
    }

    this.container = this.renderContainer();
    this.domNode.append(this.container);
    document.body.classList.add('apptentive-note-scroll-lock');
    this.container.focus();

    browserEvent(browserEvents.APPTENTIVE_NOTE_LAUNCH);
    this.sdk.engage(internalEvents.APPTENTIVE_NOTE_LAUNCH, {
      id: this.interaction.id,
      interaction_id: this.interaction.id,
    });
  }

  /**
   * Cancel a rendered Note from view.
   * @param {object} event - The browser event.
   * @private
   */
  cancel(event: Event) {
    if (this.sdk) {
      browserEvent(browserEvents.APPTENTIVE_NOTE_CANCEL, event);
      this.sdk.engage(internalEvents.APPTENTIVE_NOTE_CANCEL, {
        id: this.interaction.id,
        interaction_id: this.interaction.id,
      });
    }
    this.close();
  }

  /**
   * Dismiss a rendered Note from view.
   * @param {object} action - The Note Action configuration.
   * @param {number} index - The Note Action index in the list of actions.
   * @private
   */
  dismiss(action: ITextModalAction, index: number) {
    if (this.sdk) {
      browserEvent(browserEvents.APPTENTIVE_NOTE_DISMISS);
      this.sdk.engage(internalEvents.APPTENTIVE_NOTE_DISMISS, {
        id: this.interaction.id,
        interaction_id: this.interaction.id,
        action_id: action.id,
        label: action.label,
        position: index,
      });
    }

    this.close();
  }

  /**
   * Remove a rendered Note from view.
   * @private
   */
  close() {
    if (this.container) {
      browserEvent(browserEvents.APPTENTIVE_NOTE_CLOSE);
      this.container.remove();
      document.body.classList.remove('apptentive-note-scroll-lock');
    }
  }

  /**
   * Construct and render a Note helper method.
   * @param {object} config - The Note object.
   * @param {object} sdk - The Apptentive WebSDK object.
   * @param {object} [options] - Your configuration options.
   * @static
   */
  static display(
    config: IInteraction<ITextModalConfiguration>,
    sdk: ApptentiveBase,
    options = {} as IBaseInteractionOptions
  ) {
    try {
      const interaction = new ApptentiveNote(config, sdk, options);
      interaction.render();
    } catch (_) {}
  }
}
