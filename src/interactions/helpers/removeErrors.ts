import { surveySelectors } from '../../constants/elementSelectors';

/**
 * Removes validation errors from a survey question.
 *
 * @param {HTMLElement} questionNode - The Survey Question HTML node.
 * @returns {Function} - Cleans up validation errors
 */
const removeErrors = (questionNode: HTMLElement) => (_event: Event) => {
  questionNode.classList.remove('invalid');

  const invalidNode = questionNode.querySelector(surveySelectors.invalidReason);

  if (invalidNode) {
    invalidNode.remove();
  }
};

export default removeErrors;
