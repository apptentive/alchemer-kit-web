/**
 * Renders the Message Center greeting (icon, title, body, info link).
 *
 * @param {string} titleText - The text to use as the section title
 * @param {string} bodyText - The text to use for the section content
 * @returns {HTMLDivElement} - The greeting DOM Node
 */
const renderGreeting = (titleText: string, bodyText: string) => {
  // NOTE: Currently unused.
  // const icon = document.createElement('img');
  // icon.className = 'apptentive-message-center-greeting-icon';
  // icon.src = this.sdk.i18n.translate(`${this.interaction.id}.configuration.greeting.image_url`);
  // icon.alt = '';
  // icon.width = 80;
  // icon.height = 80;
  // greeting.appendChild(icon);

  const title = document.createElement('h2');
  title.classList.add('apptentive-message-center-greeting__title');
  title.classList.add('apptentive-typography__header');
  title.textContent = titleText;

  const body = document.createElement('p');
  body.classList.add('apptentive-typography__body');
  body.textContent = bodyText;

  const greeting = document.createElement('div');
  greeting.classList.add('apptentive-message-center-greeting');
  greeting.append(title);
  greeting.append(body);

  return greeting;
};

export default renderGreeting;
