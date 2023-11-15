import minimizeContainer from '../../helpers/minimizeContainer';

const renderButton = (options: { action: string; surveyTitle: string; onPress: () => void }): HTMLElement => {
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      options.onPress();
    }
  };

  const button = document.createElement('div');
  button.classList.add('apptentive-appbar__action');
  button.classList.add(`apptentive-appbar__action--${options.action}`);
  button.id = `${(options.surveyTitle || '').toLowerCase().replace(/ /g, '-')}__action--${options.action}`;
  button.style.width = '32px';
  button.style.height = '32px';
  button.addEventListener('click', options.onPress);
  button.addEventListener('keydown', onKeyDown);

  button.setAttribute('role', 'button');
  button.setAttribute('aria-label', options.action);
  button.tabIndex = 0;

  console.log(button);

  return button;
};

/**
 * Renders the survey header (icon, title, close).
 * @param {HTMLElement} minimizeTarget - The DOM node that will be used when the minimize action is invoked
 * @param {string} title - The title to render in the appbar
 * @param {string} position - The position type to be used in the minimize function
 * @param {Function} onDismiss - The method to invoke when the dismiss button is clicked
 * @returns {HTMLDivElement} - The DOM Node
 */
const renderAppbar = (minimizeTarget: HTMLElement, title: string, position: string, onDismiss: VoidFunction) => {
  // NOTE: Currently unused as an icon but needed to hold shape.
  const iconElement = document.createElement('div');
  iconElement.classList.add('apptentive-appbar__icon');

  const titleElement = document.createElement('h1');
  titleElement.classList.add('apptentive-appbar__title');
  titleElement.textContent = title;
  titleElement.tabIndex = 0;

  const minimizeAction = renderButton({
    action: 'minimize',
    surveyTitle: title,
    onPress() {
      minimizeContainer(minimizeTarget, position);
      minimizeAction.classList.toggle('apptentive-appbar__action--minimize--active');
    },
  });

  const closeAction = renderButton({
    action: 'close',
    surveyTitle: title,
    onPress: onDismiss,
  });

  const actionContainer = document.createElement('div');
  actionContainer.classList.add('apptentive-appbar__actions');
  actionContainer.append(minimizeAction);
  actionContainer.append(closeAction);

  const appbar = document.createElement('div');
  appbar.classList.add('apptentive-appbar');
  appbar.append(iconElement);
  appbar.append(titleElement);
  appbar.append(actionContainer);

  return appbar;
};

export default renderAppbar;
