/**
 * Focuses the text field after the other input checkbox.
 *
 * @param {object} event - The event fired.
 */
const focusOtherInput = (event: Event) => {
  if (!event || !event.target || !(event.target as HTMLElement).nextSibling) {
    return;
  }

  const target = event.target as HTMLInputElement;
  const otherInputNode = target.nextSibling as HTMLInputElement;

  if (otherInputNode instanceof HTMLInputElement && target.checked) {
    otherInputNode.focus();
  }
};

export default focusOtherInput;
