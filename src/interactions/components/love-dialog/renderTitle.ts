/**
 * Renders the Love Dialog header (title).
 *
 * @param {string} titleText - The text title to render.
 * @returns {HTMLDivElement} - The title container DOM Node.
 */
const renderTitle = (titleText: string) => {
  const titleElement = document.createElement('div');
  titleElement.className = 'apptentive-love-dialog-title';

  const headerElement = document.createElement('h1');
  headerElement.textContent = titleText || '';

  titleElement.append(headerElement);

  return titleElement;
};

export default renderTitle;
