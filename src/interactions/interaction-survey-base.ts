import ApptentiveInteractionBase from './interaction-base';

import browserEvent from '../browser-event';
import browserEvents from '../constants/browser-events';
import internalEvents from '../constants/events';

import type ApptentiveBase from '../base';
import { IInteraction } from '../interfaces/manifest/IInteraction';
import { ISurveyBranchedConfiguration } from '../interfaces/interactions/ISurveyBranchedConfiguration';
import { IBaseInteractionOptions } from '../interfaces/interactions/IBaseInteractionOptions';
import { IAnswers } from '../interfaces/interactions/survey/answers/IAnswers';
import { interactionSelectors, surveySelectors } from '../constants/elementSelectors';
import renderConfirmBlock from './components/shared/renderConfirmBlock';

/* exported ApptentiveInteraction */
export default class ApptentiveInteractionSurveyBase extends ApptentiveInteractionBase<ISurveyBranchedConfiguration> {
  public surveyContainer!: HTMLElement;
  public isConfirmBlock: boolean;

  /**
   * The base class for all Apptentive WebSDK Survey Interactions.
   * @param {object} interaction - Your interaction object.
   * @param {object} sdk - The ApptentiveSDK instance.
   * @param {object} [options] - Your configuration options.
   */
  constructor(
    interaction: IInteraction<ISurveyBranchedConfiguration>,
    sdk: ApptentiveBase,
    options = {} as IBaseInteractionOptions
  ) {
    super(interaction, sdk, options);

    this.handleClose = this.handleClose.bind(this);
    this.dismiss = this.dismiss.bind(this);

    this.isConfirmBlock = false;
  }

  /**
   * Close the survey or render confirmation bar and engage required event.
   * @param container
   * @param answers
   */
  handleClose(container: HTMLElement, answers: IAnswers) {
    const isTYScreen = this.surveyContainer.querySelector<HTMLElement>(surveySelectors.thankYou)?.style.display === '';
    if (isTYScreen) {
      this.dismiss(internalEvents.APPTENTIVE_SURVEY_CLOSE);
      return;
    }

    const hasValidAnswer = Object.values(answers).some((answ) => answ.length > 0 && answ[0].value);
    if (!hasValidAnswer) {
      this.dismiss(internalEvents.APPTENTIVE_SURVEY_CANCEL);
      return;
    }

    const questionWrapper = document.querySelector<HTMLElement>(`.${surveySelectors.questionsWrapper}`) || null;
    const actionsWrapper = document.querySelector<HTMLElement>(`.${surveySelectors.actionsWrapper}`) || null;
    const confirmWrapper = document.querySelector<HTMLElement>(`.${interactionSelectors.confirmBlock}`) as HTMLElement;

    const onSbmt = (e?: MouseEvent) => {
      e?.preventDefault();
      this.dismiss(internalEvents.APPTENTIVE_SURVEY_CANCEL_PARTIALLY);
    };

    const onCancel = (e: MouseEvent) => {
      e.preventDefault();
      this.isConfirmBlock = false;
      questionWrapper?.classList.remove(interactionSelectors.blocked);
      actionsWrapper?.classList.remove(interactionSelectors.blocked);
      confirmWrapper?.classList.replace('opened', 'closed');
    };

    if (this.isConfirmBlock) {
      onSbmt();
      return;
    }

    this.isConfirmBlock = true;

    renderConfirmBlock(
      container,
      document.querySelector<HTMLElement>(`.${surveySelectors.questionsForm}`) as HTMLElement,
      'Progress will be lost. Would you like to exit?',
      onSbmt,
      onCancel,
      [questionWrapper, actionsWrapper]
    );
  }

  /**
   * Dismiss a rendered Survey from view.
   * @param eventName
   */
  dismiss(eventName: string) {
    if (this.surveyContainer) {
      this.surveyContainer.remove();
      browserEvent(browserEvents.APPTENTIVE_SURVEY_DISMISS);
    }

    if (this.sdk) {
      this.sdk.engage(eventName, {
        id: this.interaction.id,
        interaction_id: this.interaction.id,
      });
    }
  }
}
