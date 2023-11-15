import { interactionSelectors } from '../../../constants/elementSelectors';

type BtnListener = (e: MouseEvent) => void;

const overlayListener = (e: MouseEvent) => {
  e.preventDefault();
  e.stopImmediatePropagation();
};

/**
 * Renders the confirmation exit block under interaction header.
 * @param {HTMLElement} interactionContainer - The root DOM node of interaction
 * @param {HTMLElement} container - The DOM node that will be disabled under overlay block
 * @param {string} title - The title to render in the confirmation exit block
 * @param {Function} onSbmt - The method to invoke when the OK button is clicked
 * @param {Function} onCancel - The method to invoke when the CANCEL button is clicked
 * @param {HTMLElement[]} wrapperList - The array of DOM nodes to which className with 0.5 opacity will be aded
 */
function renderConfirmBlock(
  interactionContainer: HTMLElement,
  container: HTMLElement,
  title: string,
  onSbmt: BtnListener,
  onCancel: BtnListener,
  wrapperList?: (HTMLElement | null)[]
) {
  const minimizeBtn = document.querySelector('.apptentive-appbar__action--minimize--active');
  if (minimizeBtn) {
    interactionContainer.className = 'fixed corner';
    minimizeBtn.classList.toggle('apptentive-appbar__action--minimize--active');
  }

  const overlay = document.createElement('div');
  overlay.classList.add('apptentive-interaction__overlay');

  overlay.addEventListener('click', overlayListener);
  container.append(overlay);

  wrapperList?.forEach((wrapper: HTMLElement | null) => wrapper?.classList.add(interactionSelectors.blocked));

  const confirmWrapper = document.querySelector<HTMLElement>(`.${interactionSelectors.confirmBlock}`);
  confirmWrapper?.classList.replace('closed', 'opened');

  const titleNode = document.createElement('span');
  titleNode.textContent = title;

  const okBtn = document.createElement('button');
  const cancelBtn = document.createElement('button');

  okBtn.classList.add('apptentive-interaction__confirm-wrapper__ok');
  okBtn.textContent = 'OK';
  okBtn.addEventListener('click', onSbmt);

  cancelBtn.classList.add('apptentive-interaction__confirm-wrapper__cancel');
  cancelBtn.textContent = 'CANCEL';

  const cleanUp = () => {
    overlay.remove();
    titleNode.remove();
    okBtn.remove();
    cancelBtn.remove();
  };

  cancelBtn.addEventListener('click', (e) => {
    onCancel(e);
    cleanUp();
  });

  confirmWrapper?.append(titleNode);
  confirmWrapper?.append(okBtn);
  confirmWrapper?.append(cancelBtn);
}

export default renderConfirmBlock;
