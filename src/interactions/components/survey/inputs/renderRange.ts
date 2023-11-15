import { surveySelectors } from '../../../../constants/elementSelectors';
import { IQuestionRange } from '../../../../interfaces/interactions/survey/IQuestionRange';

/**
 * Renders a given range survey question.
 *
 * @param {object} question - The Survey Question configuration.
 * @returns {HTMLElement} - The DOM Node
 */
const renderRange = (question: IQuestionRange) => {
  const choiceLabels = document.createElement('answer-choice-labels');

  const minLabelNode = document.createElement('answer-min-label');
  minLabelNode.textContent = question.min_label;
  choiceLabels.append(minLabelNode);

  const maxLabelNode = document.createElement('answer-max-label');
  maxLabelNode.textContent = question.max_label;
  choiceLabels.append(maxLabelNode);

  const fieldset = document.createElement('fieldset');
  const legend = document.createElement('legend');
  legend.textContent = 'Options';
  fieldset.append(legend);

  const choicesNode = document.createElement(surveySelectors.answerChoices);
  for (let i = question.min; i <= question.max; i++) {
    const choiceNode = document.createElement(surveySelectors.answerChoice);
    choiceNode.id = `choice-container-${question.id}-${i}`;

    const inputNode = document.createElement('input');
    inputNode.id = `choice-input-${question.id}-${i}`;
    inputNode.type = 'radio';
    inputNode.className = 'range-option';
    inputNode.name = question.id;
    inputNode.value = i.toString();
    inputNode.setAttribute('tabindex', '0');

    const labelNode = document.createElement('label');
    labelNode.setAttribute('for', `choice-input-${question.id}-${i}`);
    labelNode.textContent = i.toString();

    choiceNode.append(inputNode);
    choiceNode.append(labelNode);

    choicesNode.append(choiceNode);
  }

  const group = document.createElement('answer-choice-container');
  fieldset.append(choicesNode);
  group.append(fieldset);
  group.append(choiceLabels);

  return group;
};

export default renderRange;
