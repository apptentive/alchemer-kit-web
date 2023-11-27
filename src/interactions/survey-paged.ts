/* eslint-disable no-restricted-syntax */
import ApptentiveInteractionSurveyBase from './interaction-survey-base';

import browserEvent from '../browser-event';
import browserEvents from '../constants/browser-events';
import gguid from '../guid';
import internalEvents from '../constants/events';

import type ApptentiveBase from '../base';
import validateQuestionResponse from './components/survey/validateQuestionResponse';

import { IInteraction } from '../interfaces/manifest/IInteraction';
import { ISurveyBranchedConfiguration } from '../interfaces/interactions/ISurveyBranchedConfiguration';
import { IQuestionSet } from '../interfaces/interactions/survey/IQuestionSet';
import { IBaseInteractionOptions } from '../interfaces/interactions/IBaseInteractionOptions';
import { IAnswers } from '../interfaces/interactions/survey/answers/IAnswers';
import { IAnswer } from '../interfaces/interactions/survey/answers/IAnswer';
import { ISerializedAnswers } from '../interfaces/interactions/survey/answers/ISerializedAnswers';
import { IInvokes } from '../interfaces/interactions/survey/IInvokes';
import { QuestionType } from '../interfaces/interactions/survey/IQuestionType';
import { IStoreSurveyResponse } from '../interfaces/store/IStoreSurveyResponse';
import { IStoreAnswer } from '../interfaces/store/IStoreAnswer';
import { ISerializedAnswerState } from '../interfaces/interactions/survey/answers/ISerializedAnswerState';
import translateAnswers from './components/survey/translateAnswers';
import { IErrorResponse } from '../interfaces/api/IErrorResponse';
import renderProgressIndicator from './components/survey/renderProgressIndicator';
import updateProgressIndicator from './components/survey/updateProgressIndicator';
import renderDisclaimerText from './components/survey/renderDisclaimerText';
import renderIntroductionPage from './components/survey/renderIntroductionPage';
import renderAppbar from './components/shared/renderAppbar';
import renderThankYou from './components/shared/renderThankYou';
import { interactionSelectors, surveySelectors } from '../constants/elementSelectors';
import renderQuestion from './components/survey/renderQuestion';
import renderErrorMessage from './components/survey/renderErrorMessage';
import renderFooter from './components/survey/renderFooter';

export default class ApptentiveSurveyPaged extends ApptentiveInteractionSurveyBase {
  private isReadyForSubmit: boolean;
  private currentQuestionIndex: number;
  private currentQuestionSet: IQuestionSet;
  private questionCount: number;
  private questionSets: IQuestionSet[];
  private answers: IAnswers;
  private surveyAnswers: ISerializedAnswers;

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

    this.collectAnswers = this.collectAnswers.bind(this);
    this.submitSurvey = this.submitSurvey.bind(this);
    this.surveySubmitted = this.surveySubmitted.bind(this);
    this.surveyError = this.surveyError.bind(this);
    this.submitQuestionSet = this.submitQuestionSet.bind(this);
    this.getNextQuestion = this.getNextQuestion.bind(this);
    this.nextQuestion = this.nextQuestion.bind(this);

    this.determineNextQuestionSet = this.determineNextQuestionSet.bind(this);
    this.evaluateQuestionSetCriteria = this.evaluateQuestionSetCriteria.bind(this);

    this.handleClose = this.handleClose.bind(this);
    this.renderNextButton = this.renderNextButton.bind(this);
    this.renderQuestionForm = this.renderQuestionForm.bind(this);
    this.render = this.render.bind(this);

    // Internal
    this.questionSets = [] as IQuestionSet[];
    this.questionCount = 0;
    this.answers = {} as IAnswers;
    this.surveyAnswers = {} as ISerializedAnswers;
    this.isReadyForSubmit = false;

    this.currentQuestionSet = {} as IQuestionSet;
    this.currentQuestionIndex = 0;
  }

  /**
   * Collects the answers from a rendered question and store them in the instance `answers` variable.
   */
  collectAnswers() {
    const form = this.surveyContainer.querySelector('form')!;
    const errors = this.surveyContainer.querySelector('.apptentive-errors');

    if (errors) {
      errors.textContent = '';
    }

    // Collect answers from the DOM
    const choices = form.querySelectorAll(surveySelectors.answerChoice);

    choices.forEach((choice) => {
      const fieldElement = choice.querySelector<HTMLInputElement>('input:not(.other-input), textarea');

      if (fieldElement) {
        const otherFieldElement = choice.querySelector<HTMLInputElement>('input.other-input');
        this.answers[fieldElement.name] = this.answers[fieldElement.name] || [];

        if (
          fieldElement.nodeName === 'TEXTAREA' ||
          (fieldElement.nodeName === 'INPUT' && (fieldElement.type === 'text' || fieldElement.checked))
        ) {
          const answer: IAnswer = { value: fieldElement.value };

          if (otherFieldElement) {
            answer.other = otherFieldElement.value;
          }

          this.answers[fieldElement.name].push(answer);
        }
      }
    });
  }

  /**
   * Submits the survey event and optionally shows the Thank You message.
   */
  submitSurvey() {
    // If the submit fails, we need to know that the survey is in a submission ready state in the case of a retry
    this.isReadyForSubmit = true;

    const button = this.surveyContainer.querySelector<HTMLButtonElement>(
      '.apptentive-survey__actions-wrapper .apptentive-survey__button'
    );

    if (button) {
      button.disabled = true;
    }

    // At submission time, if there isn't an answer for a question it means it was skipped
    // so we need to create an object that contains answers for all missing questions to add to the request
    const skippedQuestionsAnswers = this.questionSets.reduce(
      (agg, questionSet) => ({
        ...agg,
        ...questionSet.questions.reduce(
          (answers, question) =>
            // If this question is missing in the answers object, add it with a state of skipped
            this.surveyAnswers[question.id]
              ? answers
              : {
                  ...answers,
                  [question.id]: { state: 'skipped' } as ISerializedAnswerState,
                },
          {}
        ),
      }),
      {} as ISerializedAnswers
    );

    const nonce = gguid();
    const data = {
      response: {
        nonce,
        client_created_at: Date.now(),
        client_created_at_utc_offset: this.date.getTimezoneOffset(),
        id: this.interaction.id,
        answers: { ...this.surveyAnswers, ...skippedQuestionsAnswers },
      },
      session_id: this.sdk.session_id,
    };

    this.sdk.api
      .submitSurvey({ json: data }, this.interaction.id)
      .then((_response) => {
        this.surveySubmitted();
      })
      .catch((error: IErrorResponse) => {
        this.surveyError(error);
      });
  }

  /**
   * Handle a successful survey submission by showing a thank you message or dismissing the view.
   * @private
   */
  surveySubmitted() {
    // In order to properly be able to track the interaction counts with the legacy store format
    // we need to translate the new answers format into the old interface
    // TODO: Remove this when we decide how to store the sentinel values
    const legacyAnswerFormat = Object.keys(this.surveyAnswers).reduce((legacyAnswers, questionId) => {
      const answer = this.surveyAnswers[questionId];

      return answer.state === 'answered'
        ? {
            ...legacyAnswers,
            [questionId]: answer.value as IStoreAnswer[],
          }
        : legacyAnswers;
    }, {} as IStoreSurveyResponse['answers']);

    browserEvent(browserEvents.APPTENTIVE_SURVEY_SUBMIT, {
      interaction_id: this.interaction.id,
      answers: this.surveyAnswers,
    });

    this.sdk.engage(internalEvents.APPTENTIVE_SURVEY_SUBMIT, {
      id: this.interaction.id,
      interaction_id: this.interaction.id,
      answers: legacyAnswerFormat,
    });

    if (this.interaction.configuration.show_success_message) {
      this.surveyContainer.querySelector<HTMLFormElement>('form.apptentive-survey-questions')!.style.display = 'none';
      this.surveyContainer.querySelector<HTMLElement>(surveySelectors.thankYou)!.style.display = '';
      return;
    }

    this.surveyContainer.remove();
  }

  /**
   * Handle an unsuccessful survey submission by showing the error string.
   * @param {object} data - The failed response object.
   * @param {string} data.responseText - The response from the server.
   * @private
   */
  surveyError(data: IErrorResponse) {
    this.surveyContainer.querySelector<HTMLFormElement>('form.apptentive-survey-questions')!.style.display = '';
    this.surveyContainer.querySelector<HTMLElement>(surveySelectors.thankYou)!.style.display = 'none';

    const button = this.surveyContainer.querySelector<HTMLButtonElement>(
      '.apptentive-survey__actions-wrapper .apptentive-survey__button'
    );

    if (button) {
      button.disabled = false;
    }

    let response;
    try {
      response = data.responseText && JSON.parse(data.responseText);
    } catch (error) {
      this.sdk.console('error', 'Submission Error', error, data);
    }

    let errorText =
      response && response.error ? response.error : 'There was an error trying to submit the form, please try again.';
    errorText = errorText.trim();

    // Replace the current question with the error text
    const questionNode = this.surveyContainer.querySelector('question');

    if (questionNode) {
      const errorElement = document.createElement('div');
      errorElement.classList.add('apptentive-survey-message');

      const errorContentElement = document.createElement('p');
      errorContentElement.classList.add('apptentive-survey-message__content');
      errorContentElement.textContent = errorText;

      errorElement.append(errorContentElement);
      questionNode.parentNode?.replaceChild(errorElement, questionNode);
    }

    browserEvent(browserEvents.APPTENTIVE_SURVEY_ERROR, { error: errorText });
  }

  /**
   * Submit each question to be stored in the logic engine.
   */
  submitQuestionSet() {
    const serializedAnswers = translateAnswers(this.currentQuestionSet.questions, this.answers);

    // Collect answers for the final submission
    this.surveyAnswers = {
      ...this.surveyAnswers,
      ...serializedAnswers,
    };

    // Fire events
    browserEvent(browserEvents.APPTENTIVE_SURVEY_NEXT_QUESTION_SET, {
      id: this.currentQuestionSet?.id,
      interaction_id: this.interaction.id,
      answers: serializedAnswers,
    });

    // Update the Logic Engine with the QuestionSet answer data
    // This is used for IRT and being able to target against previous responses
    // Commenting this out for right now until we implement partial answer tracking
    // since right now we store all of the answers on survey submit
    // this.sdk.engage(internalEvents.APPTENTIVE_SURVEY_NEXT_QUESTION_SET, {
    //   id: this.currentQuestionSet.id,
    //   interaction_id: this.interaction.id,
    //   answers,
    // });
  }

  /**
   * Renders the current QuestionSet.
   * @param {boolean} hasIntroduction - Whether the survey has an introduction screen that should be displayed first
   * @returns {HTMLFormElement} - The DOM Node
   */
  renderQuestionForm(hasIntroduction: boolean) {
    const form = document.createElement('form');
    form.classList.add(surveySelectors.questionsForm);
    form.classList.add(`${surveySelectors.questionsForm}--paged`);
    form.action = 'https://apptentive.com';

    if (hasIntroduction) {
      form.style.display = 'none';
    }

    // Always default to the first question of the question set when rendering the initial form
    const questionNode = renderQuestion(
      this.currentQuestionSet.questions[this.currentQuestionIndex],
      this.sdk.console,
      this.sdk.i18n.translate(`${this.interaction.id}.configuration.required_text`) || 'Required'
    );

    if (!questionNode) {
      this.sdk.console('error', 'Question Not Found.');
      return undefined;
    }

    const confirmWrapper = document.createElement('div');
    confirmWrapper.classList.add(interactionSelectors.confirmBlock);
    confirmWrapper.classList.add('closed');
    confirmWrapper.append(questionNode);

    const questionWrapper = document.createElement('div');
    questionWrapper.classList.add(surveySelectors.questionsWrapper);
    questionWrapper.append(questionNode);

    const stepIndicator = renderProgressIndicator(this.questionCount);
    const actionsWrapper = document.createElement('div');
    actionsWrapper.classList.add(surveySelectors.actionsWrapper);
    actionsWrapper.append(this.renderNextButton());
    actionsWrapper.append(renderErrorMessage());

    actionsWrapper.append(stepIndicator);

    form.append(confirmWrapper);
    form.append(questionWrapper);
    form.append(actionsWrapper);

    return form;
  }

  evaluateQuestionSetCriteria(invokesArray: IInvokes[]) {
    if (!invokesArray) {
      return null;
    }

    // The internal answers object needs to be reformatted in order to match what the logic engine expects
    const answersFormatted = Object.keys(this.answers).reduce(
      (agg, item) => ({
        ...agg,
        [item]: {
          answers: this.surveyAnswers[item].value,
          current_answer: this.surveyAnswers[item].value,
        },
      }),
      {}
    );

    for (const invoke of invokesArray) {
      // If the criteria object is empty or null, we either return the next question set id or null depending on the behavior
      if (!invoke.criteria || Object.keys(invoke.criteria).length === 0) {
        return invoke.behavior === 'continue' ? invoke.next_question_set_id : null;
      }

      const evaluateResult = this.sdk.logicEngine.evaluateCriteria(invoke.criteria, answersFormatted);

      if (evaluateResult) {
        return invoke.behavior === 'continue' ? invoke.next_question_set_id : null;
      }
    }

    return null;
  }

  // eslint-disable-next-line consistent-return
  determineNextQuestionSet() {
    this.currentQuestionIndex = 0;

    // Make sure to submit the current question set before setting the new one;
    this.submitQuestionSet();

    const { invokes } = this.currentQuestionSet;
    const nextQuestionSetId = this.evaluateQuestionSetCriteria(invokes);
    const nextQuestionSet = this.questionSets.find((questionSet) => questionSet.id === nextQuestionSetId);

    if (!nextQuestionSet) {
      this.sdk.console('info', 'No next question set found, end of QuestionSets.');
      this.currentQuestionSet = {} as IQuestionSet;

      return;
    }

    this.currentQuestionSet = nextQuestionSet;
    this.sdk.console('info', 'Got next Question Set:', this.currentQuestionSet);

    // Commenting out until this event is added to the server otherwise it throws a 422 error
    // this.sdk.engage(internalEvents.APPTENTIVE_SURVEY_QUESTION_SET_SHOWN, {
    //   interaction_id: this.interaction.id,
    //   question_set_id: this.currentQuestionSet.id,
    // });
  }

  /**
   * Returns the next Survey Question DOM Node or undefined if it cannot be found.
   * @returns {HTMLElement|undefined} The DOM node or undefined
   */
  getNextQuestion() {
    // If there are more questions to display, return the next question in the set
    // otherwise find the next question set.
    if (this.currentQuestionIndex < (this.currentQuestionSet.questions?.length ?? 0) - 1) {
      this.currentQuestionIndex++;
    } else {
      this.determineNextQuestionSet();
    }

    if (!this.currentQuestionSet.id) {
      this.sdk.console('log', 'At the end of the survey');
      return null;
    }

    const questionNode = renderQuestion(
      this.currentQuestionSet.questions[this.currentQuestionIndex],
      this.sdk.console,
      this.sdk.i18n.translate(`${this.interaction.id}.configuration.required_text`)
    );

    if (!questionNode) {
      this.sdk.console('error', 'Could not render the next Question:', this.currentQuestionSet);
    }

    return questionNode;
  }

  /**
   * Validate and attempt to continue to the next question.
   */
  nextQuestion() {
    // If the survey is ready to be submitted, this means we are in a "retry" state and should go ahead with the submit
    // TODO: Figure out a way to change the button click handler instead of short circuiting here
    if (this.isReadyForSubmit) {
      this.submitSurvey();
      return;
    }

    const currentQuestion = this.currentQuestionSet.questions[this.currentQuestionIndex];

    // If there was a previous answer clear out the answers for this question before collecting them again.
    // This ensures that if there was a form error, we don't double collect answers or keep previously incorrect answers (e.g., an empty textfield)
    if (this.answers[currentQuestion.id]) {
      this.answers[currentQuestion.id] = [];
    }

    // Collect answers from the HTML input elements
    this.collectAnswers();

    const currentAnswer = this.answers[currentQuestion.id];
    const isQuestionValid = validateQuestionResponse(currentQuestion, currentAnswer);

    if (!isQuestionValid) {
      const errors = this.surveyContainer.querySelector<HTMLElement>('.apptentive-errors');

      if (errors) {
        errors.textContent = currentQuestion.error_message;
        errors.style.display = '';
      }

      return;
    }

    // Replace the old question with a new question
    const questionNode = this.surveyContainer.querySelector('question');
    const newQuestion = this.getNextQuestion();

    if (!newQuestion) {
      // We are out of questions, so we submit the answers.
      this.submitSurvey();
      return;
    }

    questionNode?.parentNode?.replaceChild(newQuestion, questionNode);

    const buttonElement = document.querySelector<HTMLButtonElement>(
      '.apptentive-survey-questions .apptentive-survey__button'
    );

    if (buttonElement) {
      const buttonText = this.currentQuestionSet.button_text || 'Next';

      buttonElement.textContent = buttonText;
      buttonElement.title = buttonText;
    }

    // If this is a question we need to move the indicator to the next step
    const { id: currentId } = this.currentQuestionSet.questions[this.currentQuestionIndex];

    const questionIndex = this.questionSets
      .reduce((agg, questionSet) => [...agg, ...questionSet.questions], [] as QuestionType[])
      .findIndex((question) => currentId === question.id);

    updateProgressIndicator(this.questionCount, questionIndex);

    // If the invokes object is null or there is no criteria that links to a new question
    // this is the last question and we need to add the disclaimer text
    const hasNextQuestion =
      this.currentQuestionSet.invokes !== null &&
      this.currentQuestionSet.invokes.find((invoke) => invoke.next_question_set_id);

    if (!hasNextQuestion) {
      // Hide the progress indicator and display the disclaimer text if is it available
      const actionsElement = document.querySelector<HTMLDivElement>('.apptentive-survey__actions-wrapper');
      const progressElement = document.querySelector<HTMLDivElement>('apptentive-survey .apptentive-progress__wrapper');

      if (actionsElement && progressElement && this.interaction.configuration.disclaimer_text) {
        progressElement.style.display = 'none';
        actionsElement.append(renderDisclaimerText(this.interaction.configuration.disclaimer_text));
      }
    }
  }

  /**
   * Renders a given SurveyBranched Next button.
   * @returns {HTMLButtonElement} - The DOM Node
   */
  renderNextButton() {
    const button = document.createElement('button');
    button.type = 'button';

    // If invokes is null, this means it's the last question in the set
    const buttonText = this.currentQuestionSet.button_text || 'Next';

    button.classList.add('apptentive-survey__button');
    button.textContent = buttonText;
    button.title = buttonText;
    button.setAttribute('tabindex', '0');
    button.addEventListener('click', this.nextQuestion.bind(this));

    return button;
  }

  /**
   * Renders a given SurveyBranched interaction.
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

    // Verify there is a QuestionSet and that it can be accessed.
    if (
      !Array.isArray(this.interaction.configuration.question_sets) ||
      this.interaction.configuration.question_sets.length === 0
    ) {
      const error = 'This Survey has no QuestionSets';

      browserEvent(browserEvents.APPTENTIVE_SURVEY_ERROR, { error });
      this.sdk.console('error', error);
      return;
    }

    // Store the full list of questionSets to access later
    this.questionSets = this.interaction.configuration.question_sets;
    this.questionCount = this.questionSets.reduce((count, questionSet) => count + questionSet.questions.length, 0);

    // Always use the first question set on initial render
    [this.currentQuestionSet] = this.questionSets;

    // Render the introduction if there is into text or disclaimer text to display.
    const hasIntroduction =
      !!this.interaction.configuration.description || !!this.interaction.configuration.disclaimer_text;
    const questionForm = this.renderQuestionForm(hasIntroduction);

    if (!questionForm) {
      this.sdk.console('warn', 'Failed to render the question form:', this.questionSets);
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
        () => this.handleClose(this.surveyContainer, this.answers)
      )
    );

    if (hasIntroduction) {
      this.surveyContainer.append(
        renderIntroductionPage(
          this.surveyContainer,
          this.interaction.configuration.description,
          this.interaction.configuration.intro_button_text,
          this.interaction.configuration.disclaimer_text
        )
      );
    }

    this.surveyContainer.append(questionForm);

    if (this.interaction.configuration.show_success_message) {
      this.surveyContainer.append(
        renderThankYou(
          () => this.handleClose(this.surveyContainer, this.answers),
          surveySelectors.thankYou,
          this.sdk.i18n.translate(`${this.interaction.id}.configuration.success_message`) || 'Thank you!',
          this.sdk.i18n.translate(`${this.interaction.id}.configuration.success_button_text`) || 'Close',
          true
        )
      );
    }

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
   * Construct and render a SurveyBranched helper method.
   * @param {object} config - The SurveyBranched object.
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
      const interaction = new ApptentiveSurveyPaged(config, sdk, options);
      interaction.render();
    } catch (_error) {}
  }
}
