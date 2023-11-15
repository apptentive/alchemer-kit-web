import { surveySelectors } from '../../../constants/elementSelectors';
import scrollToError from '../../helpers/scrollToError';

/**
 * Renders a given surveys error container.
 *
 * @returns {HTMLElement} - The DOM Node
 */
const renderErrorMessage = () => {
  const errors = document.createElement(surveySelectors.errorMessage);
  errors.className = 'apptentive-errors';
  errors.textContent = '';
  errors.addEventListener('click', scrollToError);
  errors.style.display = 'none';

  return errors;
};

export default renderErrorMessage;
