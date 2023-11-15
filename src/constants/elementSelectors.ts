export enum surveySelectors {
  title = '.apptentive-appbar__title',
  answerChoice = 'answer-choice',
  answerChoices = 'answer-choices',
  errorMessage = 'apptentive-errors',
  invalidReason = 'invalid-reason',
  thankYou = 'apptentive-survey-thank-you',
  questionsForm = 'apptentive-survey-questions',
  questionsWrapper = 'apptentive-survey__question-wrapper',
  actionsWrapper = 'apptentive-survey__actions-wrapper',
}

export enum messageCenterSelectors {
  content = '.apptentive-message-center__content',
  feedback = '.apptentive-message-center-feedback',
  thankYou = 'apptentive-message-center-thank-you',
  profile = '.apptentive-message-center-profile',
  profileNameInput = '.apptentive-message-center-profile__name .apptentive-textinput',
  profileEmailInput = '.apptentive-message-center-profile__email .apptentive-textinput',
  submitButton = '.apptentive-message-center__actions .apptentive-button--primary',
}

export enum interactionSelectors {
  confirmBlock = 'apptentive-interaction__confirm-wrapper',
  blocked = 'apptentive-interaction__blocked',
}
