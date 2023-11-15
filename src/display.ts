/* eslint-disable import/no-cycle */
import ApptentiveNavigateToLink from './interactions/navigate-to-link';
import ApptentiveNote from './interactions/note';
import ApptentiveSurveyList from './interactions/survey-list';
import ApptentiveSurveyPaged from './interactions/survey-paged';
import ApptentiveLoveDialog from './interactions/love-dialog';
import ApptentiveAppStoreRating from './interactions/app-store-rating';
import ApptentiveMessageCenter from './interactions/message-center';
import type ApptentiveBase from './base';

import { IInteraction } from './interfaces/manifest/IInteraction';
import { IAppStoreRatingConfiguration } from './interfaces/interactions/IAppStoreRatingConfiguration';
import { IBaseInteractionOptions } from './interfaces/interactions/IBaseInteractionOptions';
import { INavigateToLinkConfiguration } from './interfaces/interactions/INavigateToLinkConfiguration';
import { IMessageCenterConfiguration } from './interfaces/interactions/IMessageCenterConfiguration';
import { ITextModalConfiguration } from './interfaces/interactions/ITextModalConfiguration';
import { ISurveyBranchedConfiguration } from './interfaces/interactions/ISurveyBranchedConfiguration';
import { ILoveDialogConfiguration } from './interfaces/interactions/ILoveDialogConfiguration';

/**
 * Attempt to display an Apptentive Interaction.
 *
 * @param {object} interaction - The Interaction configuration.
 * @param {object} sdk - The SDK object used in the interactions.
 * @param {object} options - The Interaction options.
 * @param {string} [options.domNode] - HTML DOM Node to insert into.
 */
export default function ApptentiveDisplay(
  interaction: IInteraction,
  sdk: ApptentiveBase,
  options = {} as IBaseInteractionOptions
) {
  if (interaction) {
    switch (interaction.type) {
      case 'Survey': {
        if ((interaction as IInteraction<ISurveyBranchedConfiguration>).configuration.render_as === 'paged') {
          ApptentiveSurveyPaged.display(interaction as IInteraction<ISurveyBranchedConfiguration>, sdk, options);
          break;
        }

        ApptentiveSurveyList.display(interaction as IInteraction<ISurveyBranchedConfiguration>, sdk, options);
        break;
      }
      case 'TextModal': {
        ApptentiveNote.display(interaction as IInteraction<ITextModalConfiguration>, sdk, options);
        break;
      }
      case 'EnjoymentDialog': {
        ApptentiveLoveDialog.display(interaction as IInteraction<ILoveDialogConfiguration>, sdk, options);
        break;
      }
      case 'MessageCenter': {
        ApptentiveMessageCenter.display(interaction as IInteraction<IMessageCenterConfiguration>, sdk, options);
        break;
      }
      case 'NavigateToLink': {
        // NOTE: There is nothing displayed here, only navigating or opening a new link.
        ApptentiveNavigateToLink.display(interaction as IInteraction<INavigateToLinkConfiguration>, sdk, options);
        break;
      }
      case 'AppStoreRating': {
        // NOTE: There is nothing displayed here, only navigating or opening a new link.
        ApptentiveAppStoreRating.display(interaction as IInteraction<IAppStoreRatingConfiguration>, sdk, options);
        break;
      }
      case 'RatingDialog': {
        if (sdk && sdk.console) {
          sdk.console('warn', 'Unsupported Interaction: RatingDialog:', interaction);
        }
        break;
      }
      case 'UpgradeMessage': {
        if (sdk && sdk.console) {
          sdk.console('warn', 'Unsupported Interaction: UpgradeMessage:', interaction);
        }
        break;
      }
      default: {
        if (sdk && sdk.console) {
          sdk.console('warn', `Unknown Interaction: ${interaction.type}`, interaction);
        }
        break;
      }
    }
  } else if (sdk && sdk.console) {
    sdk.console('warn', 'ApptentiveDisplay called without interaction');
  }
}
