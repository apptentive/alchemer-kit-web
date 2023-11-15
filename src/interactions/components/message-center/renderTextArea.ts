/**
 * Renders the Message Center textarea.
 *
 * @param {string} placeholderText - The text to use for the placeholder
 * @returns {HTMLDivElement} - The textarea container DOM Node.
 */
const renderTextArea = (placeholderText: string) => {
  const textarea = document.createElement('textarea');
  textarea.classList.add('apptentive-textinput');
  textarea.name = 'response';
  textarea.required = true;
  textarea.placeholder = placeholderText;
  textarea.rows = 4;
  textarea.addEventListener('blur', (event) => {
    (event.target as HTMLInputElement).classList.remove('apptentive-textinput--error');
  });

  const container = document.createElement('div');
  container.classList.add('apptentive-message-center-feedback');
  container.append(textarea);

  return container;
};

export default renderTextArea;
