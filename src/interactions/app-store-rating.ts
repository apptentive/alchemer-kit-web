import browserEvent from '../browser-event';
import browserEvents from '../constants/browser-events';
import internalEvents from '../constants/events';
import { IInteraction } from '../interfaces/manifest/IInteraction';
import { IAppStoreRatingConfiguration } from '../interfaces/interactions/IAppStoreRatingConfiguration';
import type ApptentiveBase from '../base';
import ApptentiveInteraction from './interaction-base';
import { IBaseInteractionOptions } from '../interfaces/interactions/IBaseInteractionOptions';
import buildStoreUrl, { StoreType } from '../utils/buildStoreUrl';

export default class ApptentiveAppStoreRating extends ApptentiveInteraction<IAppStoreRatingConfiguration> {
  /**
   * @param {object} interaction - The AppStoreRating object.
   * @param {object} interaction.configuration - The configuration used to attempt to rate with.
   * @param {string} interaction.configuration.method - The type of store to lookup, 'app_store' is iOS and anything else is Android.
   * @param {string} interaction.configuration.store_id - The application ID to look up in a given store.
   * @param {object} sdk - The Apptentive WebSDK object.
   * @param {object} [options] - Your configuration options.
   */
  constructor(
    interaction: IInteraction<IAppStoreRatingConfiguration>,
    sdk: ApptentiveBase,
    options?: IBaseInteractionOptions
  ) {
    super(interaction, sdk, options);

    this.render = this.render.bind(this);

    if (!interaction || (interaction.configuration && !interaction.configuration.store_id)) {
      const error = 'Invalid AppStoreRating provided.';
      browserEvent(browserEvents.APPTENTIVE_APP_STORE_RATING_ERROR, { error });
      this.sdk.console('error', error);
    }
  }

  /**
   * Renders a given AppStoreRating.
   *
   * @param {Function} [newWindow=window.open] - Function to open a new browser window
   * @param {string} [userAgent=window.navigator.userAgent] - Browser User Agent String
   * @private
   */
  render(newWindow = window.open, userAgent = window.navigator.userAgent) {
    if (!this.interaction || !this.interaction.configuration || !this.interaction.configuration.store_id) {
      const error = 'You cannot render a AppStoreRating without providing a valid AppStoreRating configuration object.';
      browserEvent(browserEvents.APPTENTIVE_APP_STORE_RATING_ERROR, { error });
      this.sdk.console('error', `${error} You provided:`, this.interaction);
      return;
    }

    this.sdk.engage(internalEvents.APPTENTIVE_APP_STORE_RATING_LAUNCH, {
      id: this.interaction.id,
      interaction_id: this.interaction.id,
    });

    // NOTE: Check which store.
    const { method, store_id: storeId } = this.interaction.configuration;
    const url = buildStoreUrl(method === 'app_store' ? StoreType.appStore : StoreType.playStore, storeId, userAgent);

    if (!url) {
      const error = 'No url to open because either the storeId or method type did not match supported inputs.';
      browserEvent(browserEvents.APPTENTIVE_APP_STORE_RATING_ERROR, { error });
      this.sdk.console('error', `${error} You provided:`, this.interaction);
      return;
    }

    const win = newWindow(url, '_blank');

    if (win) {
      win.focus();
      browserEvent(browserEvents.APPTENTIVE_APP_STORE_RATING_OPEN_APP_STORE_URL);
      this.sdk.engage(internalEvents.APPTENTIVE_APP_STORE_RATING_OPEN_APP_STORE_URL, {
        id: this.interaction.id,
        interaction_id: this.interaction.id,
        url,
      });
    } else {
      // Popup Blocked
      browserEvent(browserEvents.APPTENTIVE_APP_STORE_RATING_BLOCKED);
      this.sdk.engage(internalEvents.APPTENTIVE_APP_STORE_RATING_UNABLE_TO_RATE, {
        id: this.interaction.id,
        interaction_id: this.interaction.id,
        url,
      });
    }
  }

  /**
   * Construct and render a NavigateToLink helper method.
   *
   * @param {object} interaction - The AppStoreRating object.
   * @param {object} interaction.configuration - The configuration used to attempt to rate with.
   * @param {string} interaction.configuration.method - The type of store to lookup, 'app_store' is iOS and anything else is Android.
   * @param {string} interaction.configuration.store_id - The application ID to look up in a given store.
   * @param {object} sdk - The Apptentive WebSDK object.
   * @param {object} [options] - Your configuration options.
   * @static
   */
  static display(
    interaction: IInteraction<IAppStoreRatingConfiguration>,
    sdk: ApptentiveBase,
    options: IBaseInteractionOptions
  ) {
    try {
      const appStoreRating = new ApptentiveAppStoreRating(interaction, sdk, options);
      appStoreRating.render();
    } catch (_) {}
  }
}
