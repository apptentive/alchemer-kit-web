import { surveySelectors } from '../../../../constants/elementSelectors';
import { IQuestionSingleline } from '../../../../interfaces/interactions/survey/IQuestionSingleline';

/**
 * Renders a given text line survey question.
 *
 * @param {object} question - The Survey Question configuration.
 * @returns {HTMLElement} - The DOM Node
 */
const renderSingleline = (question: IQuestionSingleline) => {
  const choicesNode = document.createElement(surveySelectors.answerChoices);
  const choiceNode = document.createElement(surveySelectors.answerChoice);
  choiceNode.className = 'choice-container';

  let inputNode;
  if (question.multiline) {
    inputNode = document.createElement('textarea');
    inputNode.rows = 4;
  } else {
    inputNode = document.createElement('input');
    inputNode.type = 'text';
  }

  inputNode.className = 'singleline';
  inputNode.name = question.id;
  inputNode.title = question.value;
  inputNode.setAttribute('tabindex', '0');
  inputNode.setAttribute('aria-label', question.value);

  if (question.freeform_hint) {
    inputNode.placeholder = question.freeform_hint;
  }

  choiceNode.append(inputNode);
  choicesNode.append(choiceNode);

  return choicesNode;
};

export default renderSingleline;
