interface IFooterOptions {
  contactUrl?: string;
  contactUrlText?: string;
  termsAndConditionsUrl?: string;
  termsAndConditionsText?: string;
}

/**
 * Renders a given surveys footer.
 *
 * @param {object} configuration - The configuration object to drive the footer creation
 * @returns {HTMLElement} - The DOM Node
 */
const renderFooter = (configuration: IFooterOptions) => {
  const footer = document.createElement('footer');
  footer.className = 'apptentive-survey-footer';

  if (configuration.contactUrl && configuration.contactUrlText) {
    const contact = document.createElement('a');
    contact.className = 'apptentive-survey-footer__link';
    contact.textContent = configuration.contactUrlText;
    contact.href = configuration.contactUrl;
    contact.target = '_blank';

    footer.append(contact);
  }

  if (configuration.termsAndConditionsUrl && configuration.termsAndConditionsText) {
    const termsAndConditions = document.createElement('a');
    termsAndConditions.className = 'apptentive-survey-footer__link';
    termsAndConditions.textContent = configuration.termsAndConditionsText;
    termsAndConditions.href = configuration.termsAndConditionsUrl;
    termsAndConditions.target = '_blank';

    footer.append(termsAndConditions);
  }

  return footer;
};

export default renderFooter;
