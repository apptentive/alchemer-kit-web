/* exported ApptentiveNavigateToLink */
// https://apptentive.atlassian.net/wiki/display/APPTENTIVE/NavigateToLink+Interaction
import browserEvent from '../browser-event';
import browserEvents from '../constants/browser-events';
import internalEvents from '../constants/events';

import { IInteraction } from '../interfaces/manifest/IInteraction';
import { INavigateToLinkConfiguration } from '../interfaces/interactions/INavigateToLinkConfiguration';
import ApptentiveInteraction from './interaction-base';
import type ApptentiveBase from '../base';
import { IBaseInteractionOptions } from '../interfaces/interactions/IBaseInteractionOptions';

export default class ApptentiveNavigateToLink extends ApptentiveInteraction<INavigateToLinkConfiguration> {
  /**
   * @param {object} interaction - The NavigateToLink object.
   * @param {object} interaction.configuration - The configuration used to navigate with.
   * @param {string} interaction.configuration.url - The URL to navigate to.
   * @param {string} interaction.configuration.target - The type of navigation, 'new' for a new window or 'self' for reusing the current window.
   * @param {object} sdk - The Apptentive WebSDK object.
   * @param {object} [options] - Your configuration options.
   */
  constructor(
    interaction: IInteraction<INavigateToLinkConfiguration>,
    sdk: ApptentiveBase,
    options: IBaseInteractionOptions
  ) {
    super(interaction, sdk, options);

    this.render = this.render.bind(this);

    if (!interaction || (interaction.configuration && !interaction.configuration.url)) {
      const error = 'Invalid NavigateToLink provided.';
      browserEvent(browserEvents.APPTENTIVE_NAVIGATE_TO_LINK_ERROR, { error });
      this.sdk.console('error', error);
    }
  }

  /**
   * Renders a given NavigateToLink.
   *
   * @param {Function} [newWindow=window.open] - Function to create a new browser window.
   * @private
   */
  render(newWindow = window.open) {
    if (!this.interaction || !this.interaction.configuration || !this.interaction.configuration.url) {
      const error = 'You cannot render a NavigateToLink without providing a valid NavigateToLink configuration object.';
      browserEvent(browserEvents.APPTENTIVE_NAVIGATE_TO_LINK_ERROR, { error });
      this.sdk.console('error', `${error} You provided:`, this.interaction);
      return;
    }

    const { target = 'new', url } = this.interaction.configuration;

    browserEvent(browserEvents.APPTENTIVE_NAVIGATE_TO_LINK_NAVIGATE);
    this.sdk.engage(internalEvents.APPTENTIVE_NAVIGATE_TO_LINK_NAVIGATE, {
      id: this.interaction.id,
      interaction_id: this.interaction.id,
      url,
      target,
      success: true,
    });

    if (target === 'self') {
      try {
        window.location.href = url;
        browserEvent(browserEvents.APPTENTIVE_NAVIGATE_TO_LINK_NAVIGATED);
      } catch (error) {
        this.sdk.console('error', `${error} You provided:`, this.interaction);
      }
    } else {
      const win = newWindow(url, '_blank');

      if (win) {
        win.focus();
        browserEvent(browserEvents.APPTENTIVE_NAVIGATE_TO_LINK_NAVIGATED);
      } else {
        // Popup Blocked
        browserEvent(browserEvents.APPTENTIVE_NAVIGATE_TO_LINK_BLOCKED);
      }
    }
  }

  /**
   * Construct and render a NavigateToLink helper method.
   *
   * @param {object} interaction - The NavigateToLink object.
   * @param {object} interaction.configuration - The configuration used to navigate with.
   * @param {string} interaction.configuration.url - The URL to navigate to.
   * @param {string} interaction.configuration.target - The type of navigation, 'new' for a new window or 'self' for reusing the current window.
   * @param {object} sdk - The Apptentive WebSDK object.
   * @param {object} [options] - Your configuration options.
   * @static
   */
  static display(
    interaction: IInteraction<INavigateToLinkConfiguration>,
    sdk: ApptentiveBase,
    options: IBaseInteractionOptions
  ) {
    try {
      const navigateToLink = new ApptentiveNavigateToLink(interaction, sdk, options);
      navigateToLink.render();
    } catch (_) {}
  }
}
