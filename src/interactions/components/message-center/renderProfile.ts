interface IProfileOptions {
  isRequired: boolean;
  title: string;
  name: {
    placeholder: string;
    value: string;
  };
  email: {
    placeholder: string;
    value: string;
  };
}

/**
 * Renders the Message Center greeting (title, name (label, input), email (label, input)).
 *
 * @param {object} options - The options object to render the profile input
 * @returns {HTMLDivElement} - The profile DOM Node.
 */
const renderProfile = (options: IProfileOptions) => {
  const required = options.isRequired;

  const header = document.createElement('h2');
  header.classList.add('apptentive-message-center-profile__title');
  header.classList.add('apptentive-typography__body');
  header.textContent = options.title;

  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.classList.add('apptentive-textinput');
  nameInput.placeholder = options.name.placeholder;

  nameInput.value = options.name.value;

  const nameLabel = document.createElement('label');
  nameLabel.classList.add('apptentive-message-center-profile__name');
  nameLabel.append(nameInput);

  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.classList.add('apptentive-textinput');
  emailInput.placeholder = options.email.placeholder;

  emailInput.value = options.email.value;
  emailInput.addEventListener('blur', (event) => {
    (event.target as HTMLInputElement).classList.remove('apptentive-textinput--error');
  });

  if (required) {
    emailInput.required = true;
  }

  const emailLabel = document.createElement('label');
  emailLabel.classList.add('apptentive-message-center-profile__email');
  emailLabel.append(emailInput);

  const profile = document.createElement('div');
  profile.classList.add('apptentive-message-center-profile');
  profile.append(header);
  profile.append(nameLabel);
  profile.append(emailLabel);

  return profile;
};

export default renderProfile;
