/**
 * Check the text field before the other input textarea.
 *
 * @param {object} event - The event fired.
 */
const selectPreviousInput = (event: Event) => {
  if (!event || !event.target || !(event.target as HTMLElement).previousSibling) {
    return;
  }

  const target = event.target as HTMLInputElement;
  const otherInputNode = target.previousSibling as HTMLElement;

  if (otherInputNode instanceof HTMLInputElement) {
    otherInputNode.checked = !!target.value;
  }
};

export default selectPreviousInput;
