export const domSetChecked = (selector = '', checked = true) => {
  document.querySelector(selector).checked = checked;
};

export const domSetValue = (selector, value) => {
  document.querySelector(selector || '').value = value;
};

export const domFireEvent = (selector = '', type = 'click') => {
  const target = document.querySelector(selector);
  const mockClickEvent = document.createEvent('HTMLEvents');

  mockClickEvent.initEvent(type, true, true);
  target.dispatchEvent(mockClickEvent);
};

export const domSelectors = {
  answerChoice: 'answer-choice',
  answerChoices: 'answer-choices',
  apptentiveSurveyQuestion: 'apptentive-survey-question',
  invalidReason: 'invalid-reason',
  apptentiveSurveyButton: 'apptentive-survey button',
};
