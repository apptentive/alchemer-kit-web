import type ApptentiveBase from '../base';
import browserEvent from '../browser-event';
import browserEvents from '../constants/browser-events';
import { IApptentiveSdkOptions } from '../interfaces/sdk/IApptentiveSdkOptions';
import buildStyleRule from './buildStyleRule';

/**
 * Append the needed styles to the document.
 *
 * @param {object} options - Options
 * @param {boolean} options.skipStyles - Skip loading the external style sheet.
 * @param {boolean} options.customStyles - Using a custom style sheet, skip default style sheet and custom styles.
 * @param {object} options.settings - Options
 * @param {object} options.settings.styles - Key / Value custom styles to append.
 * @param {object} logger - A console logger in case of an error.
 */
const appendStyles = (
  options: Partial<Pick<IApptentiveSdkOptions, 'customStyles' | 'skipStyles' | 'settings'>>,
  logger: ApptentiveBase['console']
) => {
  // NOTE: No document, likely React Native, skip styles.
  if (typeof document === 'undefined') {
    return;
  }

  // Using custom styles based on the default styles, so no default styles or custom styles.
  if (options.customStyles) {
    return;
  }

  if (!options.skipStyles) {
    const link = document.createElement('link');
    link.id = 'apptentive-base-styles';
    link.rel = 'stylesheet';
    // NOTE: Causes the following error in Firefox:
    // Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at https://sdk.apptentive.com/v0/styles/styles.css. (Reason: CORS header ‘Access-Control-Allow-Origin’ missing).
    // NOTE: Otherwise throws the following warning:
    // Request to access cookie or storage on “https://sdk.apptentive.com/v0/styles/styles.css” was blocked because we are blocking all third-party storage access requests and content blocking is enabled.
    // link.setAttribute('crossorigin', 'anonymous');
    // Check for use in a local environment.
    let { protocol } = window.location;

    if (protocol === 'file:') {
      protocol = 'https:';
    }

    link.href = `${protocol}//sdk.apptentive.com/v1/styles/styles.css`;
    document.head.append(link);
  }

  if (options.settings && options.settings.styles) {
    const style = document.createElement('style');
    style.id = 'apptentive-custom-styles';
    style.media = 'screen';
    style.append(document.createTextNode('')); // WebKit Hack
    document.head.append(style);

    const { sheet } = style;

    // Add custom styles...
    if (sheet) {
      const styles = Object.keys(options.settings.styles);

      // Remove old styles if new survey styles are present
      if (styles.find((e) => e === 'survey_header_color')) {
        const index = styles.indexOf('header_color');

        if (index > -1) {
          styles.splice(index, 1);
        }
      }

      if (styles.find((e) => e === 'survey_header_icon_datauri')) {
        const index = styles.indexOf('header_icon_datauri');

        if (index > -1) {
          styles.splice(index, 1);
        }
      }

      for (let i = 0; i < styles.length; i++) {
        const rule = buildStyleRule(styles[i], options.settings.styles[styles[i]]);

        // If the rule returns an array, loop over it, otherwise just add it.
        if (Array.isArray(rule)) {
          for (let subRule = 0; subRule < rule.length; subRule++) {
            sheet.insertRule(rule[subRule], sheet.cssRules.length);
          }
        } else if (rule) {
          sheet.insertRule(rule, sheet.cssRules.length);
        }
      }
    } else {
      const error = 'Unable to create custom stylesheet.';
      browserEvent(browserEvents.APPTENTIVE_ERROR, { error });
      logger('error', error);
    }
  }
};

export default appendStyles;
