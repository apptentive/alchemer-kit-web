/**
 * Renders a given Love Dialog's set of actions.
 *
 * @param {Function} onClickHandler - The action to take when the close button is clicked.
 * @returns {HTMLDivElement} - The actions DOM Node.
 */
const renderCloseLink = (onClickHandler: (event: Event) => void) => {
  const closeLink = document.createElement('div');
  closeLink.classList.add('close-love-dialog');
  closeLink.textContent = '✕';
  closeLink.addEventListener('click', onClickHandler);

  return closeLink;
};

export default renderCloseLink;
