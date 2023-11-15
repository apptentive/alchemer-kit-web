import { IAppStoreRatingConfiguration } from '../interactions/IAppStoreRatingConfiguration';
import { ILoveDialogConfiguration } from '../interactions/ILoveDialogConfiguration';
import { IMessageCenterConfiguration } from '../interactions/IMessageCenterConfiguration';
import { INavigateToLinkConfiguration } from '../interactions/INavigateToLinkConfiguration';
import { IRatingDialogConfiguration } from '../interactions/IRatingDialogConfiguration';
import { ISurveyBranchedConfiguration } from '../interactions/ISurveyBranchedConfiguration';
import { ISurveyConfiguration } from '../interactions/ISurveyConfiguration';
import { ITextModalConfiguration } from '../interactions/ITextModalConfiguration';
import { IUpgradeMessageConfiguration } from '../interactions/IUpgradeMessageConfiguration';

export type InteractionType =
  | 'Survey'
  | 'TextModal'
  | 'EnjoymentDialog'
  | 'AppStoreRating'
  | 'RatingDialog'
  | 'MessageCenter'
  | 'SurveyBranched'
  | 'NavigateToLink'
  | 'UpgradeMessage';

export type InteractionConfiguration =
  | IAppStoreRatingConfiguration
  | ILoveDialogConfiguration
  | IMessageCenterConfiguration
  | INavigateToLinkConfiguration
  | IRatingDialogConfiguration
  | ISurveyConfiguration
  | ISurveyBranchedConfiguration
  | ITextModalConfiguration
  | IUpgradeMessageConfiguration;

export interface IInteraction<T = InteractionConfiguration> {
  id: string;
  type: InteractionType;
  configuration: T;
  version?: number;
  api_version: number;
}
