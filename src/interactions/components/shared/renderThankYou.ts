/**
 * Renders a given surveys Success Message / 'Thank You' Message.
 *
 * @param {Function} onDismiss - The method to call when the dismiss button is clicked
 * @param {string} customElementName - The custom element to create for the content
 * @param {string} content - The text content to display on the thankyou screen
 * @param {string} buttonText - The text within the dismiss button
 * @param {boolean} isTall - Whether or not to increase the spacing between the bottom and button
 * @returns {HTMLElement} - The 'Thank You' DOM Node
 */
const renderThankYou = (
  onDismiss: VoidFunction,
  customElementName: string,
  content = 'Thank you!',
  buttonText = 'Close',
  isTall = false
) => {
  const thankYouContentElement = document.createElement('p');
  thankYouContentElement.classList.add('apptentive-message__content');
  thankYouContentElement.textContent = content;

  const thankYouWrapperElement = document.createElement('div');
  thankYouWrapperElement.classList.add('apptentive-message__content-wrapper');
  thankYouWrapperElement.append(thankYouContentElement);

  const dismissButtonText = buttonText;
  const thankYouDismissButton = document.createElement('button');
  thankYouDismissButton.classList.add('apptentive-button--primary');
  thankYouDismissButton.textContent = dismissButtonText;
  thankYouDismissButton.title = dismissButtonText;
  thankYouDismissButton.addEventListener('click', onDismiss);

  const thankYouActionsElement = document.createElement('div');
  thankYouActionsElement.classList.add('apptentive-message__actions');

  if (isTall) {
    thankYouActionsElement.classList.add('apptentive-message__actions--tall');
  }

  thankYouActionsElement.append(thankYouDismissButton);

  const thankYouElement = document.createElement(customElementName);
  thankYouElement.style.display = 'none';
  thankYouElement.classList.add('apptentive-message');
  thankYouElement.append(thankYouWrapperElement);
  thankYouElement.append(thankYouActionsElement);

  return thankYouElement;
};

export default renderThankYou;
