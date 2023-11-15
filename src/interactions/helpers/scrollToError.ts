/**
 * Scrolls errors into view.
 *
 * @param {*} _event - Unused
 * @private
 */
const scrollToError = (_event: Event) => {
  const errors = document.querySelectorAll('.apptentive-survey-questions .invalid');

  if (errors.length > 0) {
    errors[0].scrollIntoView();
  }
};

export default scrollToError;
