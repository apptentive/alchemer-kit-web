import { surveySelectors } from '../../../../constants/elementSelectors';
import { IQuestionMultiselect } from '../../../../interfaces/interactions/survey/IQuestionMultiselect';
import focusOtherInput from '../../../helpers/focusOtherInput';
import selectPreviousInput from '../../../helpers/selectPreviousInput';

/**
 * Renders a given survey question choice.
 *
 * @param {object} question - The Survey Question configuration.
 * @returns {HTMLFieldSetElement} - The DOM Node
 */
const renderChoice = (question: IQuestionMultiselect) => {
  const typeMap = {
    multichoice: 'radio',
    multiselect: 'checkbox',
  };

  const fieldset = document.createElement('fieldset');
  const legend = document.createElement('legend');

  legend.textContent = 'Options';
  fieldset.append(legend);

  const choicesNode = document.createElement(surveySelectors.answerChoices);

  question.answer_choices.forEach((answer) => {
    const choiceNode = document.createElement(surveySelectors.answerChoice);
    choiceNode.id = `choice-container-${answer.id}`;

    const inputNode = document.createElement('input');
    inputNode.id = `choice-input-${answer.id}`;
    inputNode.className = `${question.type}`;
    inputNode.type = typeMap[question.type];
    inputNode.name = question.id;
    inputNode.value = answer.id;
    inputNode.title = answer.value;
    inputNode.setAttribute('tabindex', '0');

    choiceNode.append(inputNode);

    if (answer.type === 'select_other') {
      const otherInputNode = document.createElement('input');
      otherInputNode.className = 'other-input';
      otherInputNode.id = `choice-other-input-${answer.id}`;
      otherInputNode.type = 'text';
      otherInputNode.name = `${question.id}-other`;
      otherInputNode.title = answer.value;
      otherInputNode.setAttribute('tabindex', '0');
      otherInputNode.setAttribute('placeholder', answer.value);
      otherInputNode.addEventListener('input', selectPreviousInput);

      choiceNode.append(otherInputNode);

      inputNode.addEventListener('change', focusOtherInput);
    } else {
      const labelNode = document.createElement('label');
      labelNode.setAttribute('for', `choice-input-${answer.id}`);
      labelNode.textContent = answer.value;

      choiceNode.append(labelNode);
    }

    choicesNode.append(choiceNode);
  });

  fieldset.append(choicesNode);

  return fieldset;
};

export default renderChoice;
