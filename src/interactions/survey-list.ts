import ApptentiveInteractionSurveyBase from './interaction-survey-base';

import gguid from '../guid';
import browserEvent from '../browser-event';
import browserEvents from '../constants/browser-events';
import internalEvents from '../constants/events';

import type ApptentiveBase from '../base';
import { IInteraction } from '../interfaces/manifest/IInteraction';
import { ISurveyBranchedConfiguration } from '../interfaces/interactions/ISurveyBranchedConfiguration';
import { IBaseInteractionOptions } from '../interfaces/interactions/IBaseInteractionOptions';
import { ISerializedAnswers } from '../interfaces/interactions/survey/answers/ISerializedAnswers';
import { IAnswers } from '../interfaces/interactions/survey/answers/IAnswers';
import validateQuestionResponse from './components/survey/validateQuestionResponse';
import translateAnswers from './components/survey/translateAnswers';
import { IStoreSurveyResponse } from '../interfaces/store/IStoreSurveyResponse';
import { IStoreAnswer } from '../interfaces/store/IStoreAnswer';
import { IErrorResponse } from '../interfaces/api/IErrorResponse';
import renderDisclaimerText from './components/survey/renderDisclaimerText';
import renderAppbar from './components/shared/renderAppbar';
import renderIntroductionSection from './components/survey/renderIntroductionSection';
import renderThankYou from './components/shared/renderThankYou';
import { interactionSelectors, surveySelectors } from '../constants/elementSelectors';
import renderQuestion from './components/survey/renderQuestion';
import renderErrorMessage from './components/survey/renderErrorMessage';
import renderFooter from './components/survey/renderFooter';

export default class ApptentiveSurveyList extends ApptentiveInteractionSurveyBase {
  /**
   * @param {object} interaction - The Survey object.
   * @param {object} sdk - The Apptentive WebSDK object.
   * @param {object} [options] - Your configuration options.
   */
  constructor(
    interaction: IInteraction<ISurveyBranchedConfiguration>,
    sdk: ApptentiveBase,
    options = {} as IBaseInteractionOptions
  ) {
    super(interaction, sdk, options);

    this.submitSurvey = this.submitSurvey.bind(this);
    this.surveySubmitted = this.surveySubmitted.bind(this);
    this.surveyError = this.surveyError.bind(this);
    this.renderSurveyQuestions = this.renderSurveyQuestions.bind(this);
    this.renderSurveySubmit = this.renderSurveySubmit.bind(this);
    this.render = this.render.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  getSelectedQuestionAnswers() {
    const survey = document.querySelector<HTMLElement>('apptentive-survey')!;
    const form = survey.querySelector<HTMLFormElement>('form')!;
    const choices = form.querySelectorAll(surveySelectors.answerChoice);

    const answers = {} as IAnswers;
    choices.forEach((choice) => {
      const field = choice.querySelector<HTMLInputElement>('input:not(.other-input), textarea');

      if (typeof field !== 'undefined' && field !== null) {
        const otherField = choice.querySelector<HTMLInputElement>('input.other-input');

        answers[field.name] = answers[field.name] || [];

        if (field.nodeName === 'TEXTAREA' || (field.nodeName === 'INPUT' && (field.type === 'text' || field.checked))) {
          const answer: { value: string; other?: string } = { value: field.value };

          if (typeof otherField !== 'undefined' && otherField !== null) {
            answer.other = otherField.value;
          }

          answers[field.name].push(answer);
        }
      }
    });

    return answers;
  }

  /**
   * Submits the survey.
   */
  submitSurvey() {
    const survey = document.querySelector<HTMLElement>('apptentive-survey')!;
    const button = survey.querySelector<HTMLButtonElement>('button.submit');

    if (button) {
      button.disabled = true;
    }

    const errors = survey.querySelector<HTMLElement>('.apptentive-errors');

    if (errors) {
      errors.textContent = '';
    }

    const answers = this.getSelectedQuestionAnswers();

    let valid = true;
    let serializedAnswers = {} as ISerializedAnswers;

    this.interaction.configuration.question_sets.forEach((questionSet) => {
      serializedAnswers = { ...serializedAnswers, ...translateAnswers(questionSet.questions, answers) };

      // After serializing the answers, validate each question in the set.
      questionSet.questions.forEach((question) => {
        const isQuestionValid = validateQuestionResponse(question, answers[question.id]);

        if (!isQuestionValid) {
          const questionNode = document.querySelector(`question#question-${question.id}`)!;
          questionNode.classList.add('invalid');

          // Clean
          questionNode.querySelectorAll(surveySelectors.invalidReason).forEach((node) => {
            node.remove();
          });

          const invalidNode = document.createElement(surveySelectors.invalidReason);
          invalidNode.textContent = question.error_message || 'Required';

          questionNode.append(invalidNode);
        }

        valid = valid && isQuestionValid;
      });
    });

    if (valid) {
      if (errors) {
        errors.textContent = '';
        errors.style.display = 'none';
      }

      // Validate there is an interaction id before continuing since this is used to create the submission url
      if (!this.interaction || !this.interaction.id || !this.sdk) {
        this.sdk.console('warn', 'Cannot submit survey because the Interaction ID is missing.');

        // TODO: What should we do on the UI in this case? Right now the button remains disabled, but there is
        // no way for the consumer to recover from this state.
        return;
      }

      const nonce = gguid();
      const data = {
        response: {
          nonce,
          client_created_at: Date.now(),
          client_created_at_utc_offset: this.date.getTimezoneOffset(),
          id: this.interaction.id,
          answers: serializedAnswers,
        },
        session_id: this.sdk.session_id,
      };

      this.sdk.api
        .submitSurvey({ json: data }, this.interaction.id)
        .then((_response) => {
          this.surveySubmitted(serializedAnswers);
        })
        .catch((error: IErrorResponse) => {
          this.surveyError(error);
        });
    } else {
      if (errors) {
        errors.textContent =
          this.sdk.i18n.translate(`${this.interaction.id}.configuration.validation_error`) ||
          'Please fix the errors in your responses.';
        errors.style.whiteSpace = 'pre';
        errors.style.display = '';
        errors.scrollIntoView();

        if (button) {
          button.disabled = false;
        }
      }

      this.sdk.console('warn', 'Invalid Survey Format');
    }
  }

  /**
   * Handle a successful survey submission by showing a thank you message or dismissing the view.
   * @param {object} answers - The Survey answers.
   * @private
   */
  surveySubmitted(answers: ISerializedAnswers) {
    // In order to properly be able to track the interaction counts with the legacy store format
    // we need to translate the new answers format into the old interface
    // TODO: Remove this when we decide how to store the sentinel values
    const legacyAnswerFormat = Object.keys(answers).reduce((legacyAnswers, questionId) => {
      const answer = answers[questionId];

      return answer.state === 'answered'
        ? {
            ...legacyAnswers,
            [questionId]: answer.value as IStoreAnswer[],
          }
        : legacyAnswers;
    }, {} as IStoreSurveyResponse['answers']);

    if (this.interaction.configuration.show_success_message) {
      this.surveyContainer.querySelector<HTMLFormElement>('form.apptentive-survey-questions')!.style.display = 'none';
      this.surveyContainer.querySelector<HTMLElement>(surveySelectors.thankYou)!.style.display = '';
    } else {
      this.surveyContainer.remove();
    }

    browserEvent(browserEvents.APPTENTIVE_SURVEY_SUBMIT, { interaction_id: this.interaction.id, answers });
    this.sdk.engage(internalEvents.APPTENTIVE_SURVEY_SUBMIT, {
      id: this.interaction.id,
      interaction_id: this.interaction.id,
      answers: legacyAnswerFormat,
    });
  }

  /**
   * Handle an unsuccessful survey submission by showing the error string.
   * @param {object} data - The failed response object.
   * @param {string} data.responseText - The failed response text.
   * @private
   */
  surveyError(data: IErrorResponse) {
    this.surveyContainer.querySelector<HTMLFormElement>('form.apptentive-survey-questions')!.style.display = '';
    this.surveyContainer.querySelector<HTMLElement>(surveySelectors.thankYou)!.style.display = 'none';

    const errors = this.surveyContainer.querySelector<HTMLElement>('.apptentive-errors');
    let response;

    try {
      response = data.responseText && JSON.parse(data.responseText);
    } catch (error) {
      this.sdk.console('error', 'Submission Error', error, data);
    }

    let errorText = response && response.error ? response.error : 'Please double check your form and try again.';

    // Clean up error text.
    errorText = errorText.trim();
    errorText = errorText.replace('Invalid Survey Response: ', '');
    errorText = errorText.replace(/answers missing text/gi, 'Missing');

    // Look up question titles and replace BSON ID with "title".
    // NOTE: Surveys have GUID IDs, not BSON
    const questionIds = errorText.match(/[\da-f]{24}/gi);

    if (questionIds) {
      questionIds.forEach((question: string) => {
        const title = this.surveyContainer.querySelector(`#question-${question} h2`);

        if (title) {
          // eslint-disable-next-line security/detect-non-literal-regexp
          errorText = errorText.replace(new RegExp(question, 'ig'), `"${title.textContent}"`);
        }
      });
    }

    errorText = errorText.split(', ');
    errorText = errorText.join('\n');
    errorText = errorText.trim();

    if (errors) {
      errors.textContent = errorText;
      errors.style.whiteSpace = 'inherit';
      errors.style.display = '';
      errors.scrollIntoView();
    }

    const button = this.surveyContainer.querySelector<HTMLButtonElement>('button.submit');

    if (button) {
      button.disabled = false;
    }

    browserEvent(browserEvents.APPTENTIVE_SURVEY_ERROR, { error: errorText });
  }

  /**
   * Renders a given surveys set of questions.
   * @returns {HTMLFormElement} - The DOM Node
   */
  renderSurveyQuestions() {
    const form = document.createElement('form');
    form.classList.add('apptentive-survey-questions');
    form.classList.add('apptentive-survey-questions--list');
    form.action = 'https://apptentive.com';

    const questionsWrapper = document.createElement('div');
    questionsWrapper.classList.add(surveySelectors.questionsWrapper);
    form.append(questionsWrapper);

    questionsWrapper.append(
      renderIntroductionSection(this.sdk.i18n.translate(`${this.interaction.id}.configuration.description`))
    );

    this.interaction.configuration.question_sets.forEach((questionSet) => {
      questionSet.questions.forEach((question) => {
        const questionNode = renderQuestion(
          question,
          this.sdk.console,
          this.sdk.i18n.translate(`${this.interaction.id}.configuration.required_text`) || 'Required'
        );

        if (questionNode) {
          questionsWrapper.append(questionNode);
        }
      });
    });

    questionsWrapper.append(this.renderSurveySubmit());
    questionsWrapper.append(renderErrorMessage());

    if (this.interaction.configuration.disclaimer_text) {
      questionsWrapper.append(renderDisclaimerText(this.interaction.configuration.disclaimer_text));
    }

    return form;
  }

  /**
   * Renders a given surveys submit button.
   * @returns {HTMLButtonElement} - The DOM Node
   */
  renderSurveySubmit() {
    const questionSets = this.interaction.configuration.question_sets;
    const submitText = questionSets[questionSets.length - 1].button_text || 'Submit';
    const submit = document.createElement('button');

    submit.type = 'button';
    submit.className = 'submit';
    submit.textContent = submitText;
    submit.title = submitText;
    submit.setAttribute('tabindex', '0');
    submit.addEventListener('click', this.submitSurvey.bind(this));

    return submit;
  }

  /**
   * Renders a given survey.
   */
  render() {
    if (!this.interaction || (this.interaction && (!this.interaction.id || !this.interaction.configuration))) {
      const error = 'You cannot render a Survey without providing a valid Survey configuration object.';
      browserEvent(browserEvents.APPTENTIVE_SURVEY_ERROR, { error });
      this.sdk.console('error', `${error} You provided:`, this.interaction);
      return;
    }

    if (document.querySelectorAll(`#apptentive-survey-${this.interaction.id}`).length > 0) {
      this.sdk.console('warn', `Survey ${this.interaction.id} is already rendered.`);
      return;
    }

    this.surveyContainer = document.createElement('apptentive-survey');
    this.surveyContainer.className = `fixed ${this.interaction.configuration.position || 'corner'}`;
    this.surveyContainer.id = `apptentive-survey-${this.interaction.id}`;
    this.surveyContainer.setAttribute('role', 'dialog');
    this.surveyContainer.append(
      renderAppbar(
        this.surveyContainer,
        this.sdk.i18n.translate(`${this.interaction.id}.configuration.name`),
        this.interaction.configuration.position || 'corner',
        () => this.handleClose(this.surveyContainer, this.getSelectedQuestionAnswers())
      )
    );

    const confirmWrapper = document.createElement('div');
    confirmWrapper.classList.add(interactionSelectors.confirmBlock);
    confirmWrapper.classList.add('closed');
    this.surveyContainer.append(confirmWrapper);

    this.surveyContainer.append(this.renderSurveyQuestions());
    this.surveyContainer.append(
      renderThankYou(
        () => this.handleClose(this.surveyContainer, this.getSelectedQuestionAnswers()),
        surveySelectors.thankYou,
        this.sdk.i18n.translate(`${this.interaction.id}.configuration.success_message`) || 'Thank you!',
        this.sdk.i18n.translate(`${this.interaction.id}.configuration.success_button_text`) || 'Close',
        false
      )
    );
    this.surveyContainer.append(
      renderFooter({
        contactUrl: this.interaction.configuration.contact_url,
        contactUrlText: this.sdk.i18n.translate(`${this.interaction.id}.configuration.contact_url_text`),
        termsAndConditionsUrl: this.interaction.configuration.terms_and_conditions?.link,
        termsAndConditionsText: this.sdk.i18n.translate(
          `${this.interaction.id}.configuration.terms_and_conditions.label`
        ),
      })
    );

    this.domNode.append(this.surveyContainer);
    this.surveyContainer.querySelector<HTMLElement>(surveySelectors.title)!.focus();

    browserEvent(browserEvents.APPTENTIVE_SURVEY_LAUNCH);
    this.sdk.engage(internalEvents.APPTENTIVE_SURVEY_LAUNCH, {
      id: this.interaction.id,
      interaction_id: this.interaction.id,
    });
  }

  /**
   * Construct and render a Survey helper method.
   * @param {object} config - The Survey object.
   * @param {object} sdk - The Apptentive WebSDK object.
   * @param {object} options - Your configuration options.
   * @static
   */
  static display(
    config: IInteraction<ISurveyBranchedConfiguration>,
    sdk: ApptentiveBase,
    options = {} as IBaseInteractionOptions
  ) {
    try {
      const interaction = new ApptentiveSurveyList(config, sdk, options);
      interaction.render();
    } catch (_error) {}
  }
}
