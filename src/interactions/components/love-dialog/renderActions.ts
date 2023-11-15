type EventHandler = (event: Event) => void;

/**
 * Renders a given Love Dialog's set of actions.
 *
 * @param {string} yesButtonText - The text to render for the 'Love' button.
 * @param {Function} yesClickHandler - The action to take when the 'Love' button is clicked.
 * @param {string} noButtonText - The text to render for the 'Do Not Love' button.
 * @param {Function} noClickHandler - The action to take when the 'Do Not Love' button is clicked.
 * @returns {HTMLDivElement} - The actions DOM Node.
 */
const renderActions = (
  yesButtonText: string,
  yesClickHandler: EventHandler,
  noButtonText: string,
  noClickHandler: EventHandler
) => {
  const actions = document.createElement('div');
  actions.className = 'apptentive-love-dialog-actions';

  // Yes
  const yesAction = document.createElement('button');
  yesAction.textContent = yesButtonText || 'Yes';
  yesAction.classList.add('apptentive-love-dialog-action');
  yesAction.classList.add('apptentive-love-dialog-yes');
  yesAction.addEventListener('click', yesClickHandler);

  // No
  const noAction = document.createElement('button');
  noAction.textContent = noButtonText || 'No';
  noAction.classList.add('apptentive-love-dialog-action');
  noAction.classList.add('apptentive-love-dialog-no');
  noAction.addEventListener('click', noClickHandler);

  actions.append(noAction);
  actions.append(yesAction);

  return actions;
};

export default renderActions;
