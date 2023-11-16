/* exported ApptentiveMessageCenter */
import browserEvent from '../browser-event';
import browserEvents from '../constants/browser-events';
import internalEvents from '../constants/events';
import ApptentiveInteraction from './interaction-base';
import type ApptentiveBase from '../base';
import { IMessageCenterConfiguration } from '../interfaces/interactions/IMessageCenterConfiguration';
import { IInteraction } from '../interfaces/manifest/IInteraction';
import { IPerson } from '../interfaces/data/IPerson';
import { IBaseInteractionOptions } from '../interfaces/interactions/IBaseInteractionOptions';
import { IErrorResponse } from '../interfaces/api/IErrorResponse';
import renderFooter from './components/message-center/renderFooter';
import renderThankYou from './components/shared/renderThankYou';
import { interactionSelectors, messageCenterSelectors } from '../constants/elementSelectors';
import renderIntroduction from './components/message-center/renderIntroduction';
import renderGreeting from './components/message-center/renderGreeting';
import renderTextArea from './components/message-center/renderTextArea';
import renderSubmitButton from './components/message-center/renderSubmitButton';
import renderProfile from './components/message-center/renderProfile';
import renderAppbar from './components/shared/renderAppbar';
import renderConfirmBlock from './components/shared/renderConfirmBlock';

export default class ApptentiveMessageCenter extends ApptentiveInteraction<IMessageCenterConfiguration> {
  private missingPersonInfo!: boolean;
  private wantProfile!: boolean;
  private isConfirmBlock: boolean;

  public container!: HTMLElement;
  /**
   * @param {object} interaction - The Message Center object.
   * @param {object} interaction.configuration - The configuration used to attempt to show the Message Center.
   * @param {object} interaction.configuration.automated_message - Automatic Message configuration.
   * @param {string} interaction.configuration.automated_message.body - Automatic Message body text.
   * @param {object} interaction.configuration.greeting - The configuration used to customize the greeting section.
   * @param {string} interaction.configuration.greeting.image_url - URL to the image to show, usually an avatar. (Unused)
   * @param {string} interaction.configuration.greeting.title - The text title to render for the greeting section.
   * @param {string} interaction.configuration.greeting.body - The text body to render for the greeting section
   * @param {string} interaction.configuration.position - The placement CSS classname to position the dialog.
   * @param {object} interaction.configuration.profile - The configuration specific to profile (name & email) collection.
   * @param {boolean} interaction.configuration.profile.require - Requires the profile collection.
   * @param {boolean} interaction.configuration.profile.request - Requests the profile collection, but is not required.
   * @param {object} interaction.configuration.profile.edit - Default labels for editing profile information.
   * @param {string} interaction.configuration.profile.edit.title - Default label for editing profile information section title.
   * @param {string} interaction.configuration.profile.edit.name_hint - Default label for editing profile information name hint text.
   * @param {string} interaction.configuration.profile.edit.email_hint - Default label for editing profile information email hint text.
   * @param {string} interaction.configuration.profile.edit.skip_button - Default label for editing profile information skip button.
   * @param {string} interaction.configuration.profile.edit.save_button - Default label for editing profile information save button.
   * @param {object} interaction.configuration.profile.initial - Default labels for initial collection of profile information.
   * @param {string} interaction.configuration.profile.initial.title - Default label for initial collection of profile information section title.
   * @param {string} interaction.configuration.profile.initial.name_hint - Default label for initial collection of profile information name hint text.
   * @param {string} interaction.configuration.profile.initial.email_hint - Default label for initial collection of profile information email hint text.
   * @param {string} interaction.configuration.profile.initial.skip_button - Default label for initial collection of profile information skip button.
   * @param {string} interaction.configuration.profile.initial.save_button - Default label for initial collection of profile information save button.
   * @param {object} interaction.configuration.status - The configuration specific to status updates.
   * @param {string} interaction.configuration.status.body - The text status to render.
   * @param {string} interaction.configuration.title - The text title to render.
   * @param {number} interaction.version - The version of the interaction, 1 being legacy and 2 the most recent.
   * @param {object} sdk - The Apptentive WebSDK object.
   * @param {object} [options] - Your configuration options.
   */
  constructor(
    interaction: IInteraction<IMessageCenterConfiguration>,
    sdk: ApptentiveBase,
    options: IBaseInteractionOptions
  ) {
    super(interaction, sdk, options);

    this.renderContent = this.renderContent.bind(this);
    this.submit = this.submit.bind(this);
    this.submitted = this.submitted.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.errored = this.errored.bind(this);
    this.saveProfile = this.saveProfile.bind(this);
    this.render = this.render.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.close = this.close.bind(this);

    this.isConfirmBlock = false;

    if (!interaction || !interaction.configuration) {
      const error = 'Invalid Message Center provided.';
      browserEvent(browserEvents.APPTENTIVE_MESSAGE_CENTER_ERROR, { error });
      this.sdk.console('error', error);
      return;
    }

    if (interaction.version && interaction.version < 2) {
      const error = `Incompatible Message Center version provided: ${interaction.version}`;
      browserEvent(browserEvents.APPTENTIVE_MESSAGE_CENTER_ERROR, { error });
      this.sdk.console('error', error);
      return;
    }

    this.missingPersonInfo = !sdk.logicEngine?.person?.name || !sdk.logicEngine?.person?.email;
    this.wantProfile = interaction.configuration.profile?.require || interaction.configuration.profile?.request;
  }

  /**
   * Renders the Message Center container and content (title, yes, no).
   * @returns {HTMLElement} - The entire container DOM Node.
   */
  renderContent() {
    const content = document.createElement('div');
    content.classList.add('apptentive-message-center__content');

    content.append(
      renderIntroduction(this.sdk.i18n.translate(`${this.interaction.id}.configuration.automated_message.body`))
    );

    content.append(
      renderGreeting(
        this.sdk.i18n.translate(`${this.interaction.id}.configuration.greeting.title`) || 'Hello!',
        this.sdk.i18n.translate(`${this.interaction.id}.configuration.greeting.body`)
      )
    );

    // NOTE: Messages can be shown, but given the restrictions of the web they are unused currently.
    // content.appendChild(this.renderMessages());

    content.append(renderTextArea(this.sdk.i18n.translate(`${this.interaction.id}.configuration.composer.hint_text`)));

    // Only render the profile section if the config requests it and we don't have that information already
    if (this.wantProfile && this.missingPersonInfo) {
      content.append(
        renderProfile({
          isRequired: this.interaction.configuration.profile.require,
          title: this.sdk.i18n.translate(`${this.interaction.id}.configuration.profile.initial.title`),
          name: {
            placeholder: this.sdk.i18n.translate(`${this.interaction.id}.configuration.profile.initial.name_hint`),
            value: this.sdk && this.sdk.logicEngine.person ? this.sdk.logicEngine.person.name || '' : '',
          },
          email: {
            placeholder: this.sdk.i18n.translate(`${this.interaction.id}.configuration.profile.initial.email_hint`),
            value: this.sdk && this.sdk.logicEngine.person ? this.sdk.logicEngine.person.email || '' : '',
          },
        })
      );
    }

    content.append(
      renderSubmitButton(
        this.sdk.i18n.translate(`${this.interaction.id}.configuration.composer.send_button`),
        this.submit
      )
    );

    return content;
  }

  /**
   * Validates the form is ready to be submitted.
   * @returns {boolean} - Whether the form is valid.
   */
  validateForm() {
    let isValid = true;

    // If email is required and there isn't an identified person, don't let the submit through if it isn't filled
    if (this.interaction.configuration.profile?.require && this.missingPersonInfo) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const emailElement = this.container.querySelector<HTMLInputElement>(messageCenterSelectors.profileEmailInput);
      const emailValue = emailElement?.value.trim();

      if ((!emailValue || !emailRegex.test(emailValue)) && emailElement) {
        isValid = false;
        emailElement.classList.add('apptentive-textinput--error');
      }
    }

    const messageElement = this.container.querySelector<HTMLTextAreaElement>(
      `${messageCenterSelectors.feedback} textarea`
    );

    if (messageElement && !messageElement.value) {
      isValid = false;
      messageElement.classList.add('apptentive-textinput--error');
    }

    return isValid;
  }

  /**
   * Submits the message.
   */
  submit() {
    const isFormValid = this.validateForm();

    if (!isFormValid) {
      return;
    }

    if (this.wantProfile && this.missingPersonInfo) {
      this.saveProfile();
    }

    // The validateForm method makes sure this element exists and it has a value
    const message = this.container
      .querySelector<HTMLTextAreaElement>(`${messageCenterSelectors.feedback} textarea`)!
      .value.trim();

    this.container.querySelector<HTMLButtonElement>(messageCenterSelectors.submitButton)!.disabled = true;
    this.sdk.createMessage({
      body: message,
      success: this.submitted,
      failure: this.errored,
    });
  }

  /**
   * Handle a successful submission by showing a thank you message or dismissing the view.
   * @private
   */
  submitted() {
    this.sdk.engage(internalEvents.APPTENTIVE_MESSAGE_CENTER_SEND, {
      id: this.interaction.id,
      interaction_id: this.interaction.id,
    });

    if (this.interaction.configuration.status && this.interaction.configuration.status.body) {
      this.container.querySelector<HTMLElement>(messageCenterSelectors.content)!.style.display = 'none';
      this.container.querySelector<HTMLElement>(messageCenterSelectors.thankYou)!.style.display = '';
    } else {
      this.handleClose();
    }

    browserEvent(browserEvents.APPTENTIVE_MESSAGE_CENTER_SEND, { interaction_id: this.interaction.id });
  }

  /**
   * Handle an unsuccessful submission by showing the error string.
   * @param {object} data - The failed response object.
   * @param {string} data.responseText - The failed response text.
   * @private
   */
  errored(data: IErrorResponse) {
    this.container.querySelector<HTMLElement>(messageCenterSelectors.content)!.style.display = '';
    this.container.querySelector<HTMLElement>(messageCenterSelectors.thankYou)!.style.display = 'none';

    const errors = this.container.querySelector<HTMLElement>('apptentive-errors');
    let errorText = 'Please double check your message and try again.';

    if (data && data.responseText) {
      try {
        const response = JSON.parse(data.responseText);

        if (response && response.error) {
          errorText = response.error;
        }
      } catch (error) {
        this.sdk.console('error', `Error Submitting: ${error}`);
      }
    }

    // Clean up error text.
    errorText = errorText.trim();

    if (errors) {
      errors.textContent = errorText;
      errors.style.whiteSpace = 'inherit';
      errors.style.display = '';
      errors.scrollIntoView();
    }

    const submitButton = this.container.querySelector<HTMLButtonElement>(messageCenterSelectors.submitButton);

    if (submitButton) {
      submitButton.disabled = false;
    }

    browserEvent(browserEvents.APPTENTIVE_MESSAGE_CENTER_ERROR, { error: errorText });
  }

  /**
   * Updates the name and email for the person object on the server.
   */
  saveProfile() {
    const person = {} as IPerson;
    const name = this.container.querySelector<HTMLInputElement>(messageCenterSelectors.profileNameInput)?.value.trim();
    const email = this.container
      .querySelector<HTMLInputElement>(messageCenterSelectors.profileEmailInput)
      ?.value.trim();

    if (name) {
      person.name = name;
    }

    if (email) {
      person.email = email;
    }

    if (name || email) {
      this.sdk.updatePerson(person);
    }
  }

  /**
   * Renders a given Message Center.
   * @private
   */
  render() {
    if (!this.interaction || (this.interaction && (!this.interaction.id || !this.interaction.configuration))) {
      const error = 'You cannot render a Message Center without providing a valid Message Center configuration object.';
      browserEvent(browserEvents.APPTENTIVE_MESSAGE_CENTER_ERROR, { error });
      this.sdk.console('error', `${error} You provided:`, this.interaction);
      return;
    }

    if (document.querySelectorAll(`#apptentive-message-center-${this.interaction.id}`).length > 0) {
      this.sdk.console('warn', `Message Center ${this.interaction.id} is already rendered.`);
      return;
    }

    this.container = document.createElement('apptentive-message-center');
    this.container.className = `fixed ${this.interaction.configuration.position || 'corner'}`;
    this.container.id = `apptentive-message-center-${this.interaction.id}`;

    this.container.append(
      renderAppbar(
        this.container,
        this.sdk.i18n.translate(`${this.interaction.id}.configuration.title`) || 'Message Center',
        this.interaction.configuration.position,
        this.handleClose
      )
    );

    const confirmWrapper = document.createElement('div');
    confirmWrapper.classList.add(interactionSelectors.confirmBlock);
    confirmWrapper.classList.add('closed');
    this.container.append(confirmWrapper);

    this.container.append(this.renderContent());
    this.container.append(
      renderThankYou(
        this.handleClose,
        messageCenterSelectors.thankYou,
        this.sdk.i18n.translate(`${this.interaction.id}.configuration.status.body`) || 'Thank you!',
        this.sdk.i18n.translate(`${this.interaction.id}.configuration.composer.close_text`) || 'Close',
        false
      )
    );
    this.container.append(renderFooter());

    this.domNode.append(this.container);
    this.container.focus();

    browserEvent(browserEvents.APPTENTIVE_MESSAGE_CENTER_LAUNCH);
    this.sdk.engage(internalEvents.APPTENTIVE_MESSAGE_CENTER_LAUNCH, {
      id: this.interaction.id,
      interaction_id: this.interaction.id,
    });
  }

  /**
   * Close the Message Center or render confirmation bar and engage required event.
   */
  handleClose() {
    if (!this.container) {
      return;
    }

    const onSbmt = (e?: MouseEvent) => {
      e?.preventDefault();
      if (this.sdk) {
        browserEvent(browserEvents.APPTENTIVE_MESSAGE_CENTER_DISMISS);
      }

      this.close();
    };

    if (this.isConfirmBlock) {
      onSbmt();
      return;
    }

    const isTYScreen = this.container.querySelector<HTMLElement>(messageCenterSelectors.thankYou)!.style.display === '';
    const messageElement = this.container.querySelector<HTMLTextAreaElement>(
      `${messageCenterSelectors.feedback} textarea`
    );

    const msgValue = messageElement?.value.trim();

    if (msgValue && !isTYScreen) {
      this.isConfirmBlock = true;

      const contentWrapper = document.querySelector<HTMLElement>(messageCenterSelectors.content) || null;
      const confirmWrapper = document.querySelector<HTMLElement>(
        `.${interactionSelectors.confirmBlock}`
      ) as HTMLElement;

      const onCancel = (e: MouseEvent) => {
        e.preventDefault();
        this.isConfirmBlock = false;
        contentWrapper?.classList.remove(interactionSelectors.blocked);
        confirmWrapper?.classList.replace('opened', 'closed');
      };

      renderConfirmBlock(
        this.container,
        contentWrapper as HTMLElement,
        'Progress will be lost. Would you like to exit?',
        onSbmt,
        onCancel,
        [contentWrapper]
      );

      return;
    }

    if (this.sdk) {
      browserEvent(browserEvents.APPTENTIVE_MESSAGE_CENTER_DISMISS);
    }

    this.close();
  }

  /**
   * Dismiss a rendered Message Center from view.
   */
  close() {
    if (this.container) {
      if (this.sdk) {
        browserEvent(browserEvents.APPTENTIVE_MESSAGE_CENTER_CLOSE);
        this.sdk.engage(internalEvents.APPTENTIVE_MESSAGE_CENTER_CLOSE, {
          id: this.interaction.id,
          interaction_id: this.interaction.id,
        });
      }
      this.container.remove();
    }
  }

  /**
   * Construct and render a Message Center helper method.
   * @param {object} interaction - The Message Center object.
   * @param {object} interaction.configuration - The configuration used to attempt to show the Message Center.
   * @param {object} interaction.configuration.automated_message - Automatic Message configuration.
   * @param {string} interaction.configuration.automated_message.body - Automatic Message body text.
   * @param {object} interaction.configuration.greeting - The configuration used to customize the greeting section.
   * @param {string} interaction.configuration.greeting.image_url - URL to the image to show, usually an avatar. (Unused)
   * @param {string} interaction.configuration.greeting.title - The text title to render for the greeting section.
   * @param {string} interaction.configuration.greeting.body - The text body to render for the greeting section
   * @param {string} interaction.configuration.position - The placement CSS classname to position the dialog.
   * @param {object} interaction.configuration.profile - The configuration specific to profile (name & email) collection.
   * @param {boolean} interaction.configuration.profile.require - Requires the profile collection.
   * @param {boolean} interaction.configuration.profile.request - Requests the profile collection, but is not required.
   * @param {object} interaction.configuration.profile.edit - Default labels for editing profile information.
   * @param {string} interaction.configuration.profile.edit.title - Default label for editing profile information section title.
   * @param {string} interaction.configuration.profile.edit.name_hint - Default label for editing profile information name hint text.
   * @param {string} interaction.configuration.profile.edit.email_hint - Default label for editing profile information email hint text.
   * @param {string} interaction.configuration.profile.edit.skip_button - Default label for editing profile information skip button.
   * @param {string} interaction.configuration.profile.edit.save_button - Default label for editing profile information save button.
   * @param {object} interaction.configuration.profile.initial - Default labels for initial collection of profile information.
   * @param {string} interaction.configuration.profile.initial.title - Default label for initial collection of profile information section title.
   * @param {string} interaction.configuration.profile.initial.name_hint - Default label for initial collection of profile information name hint text.
   * @param {string} interaction.configuration.profile.initial.email_hint - Default label for initial collection of profile information email hint text.
   * @param {string} interaction.configuration.profile.initial.skip_button - Default label for initial collection of profile information skip button.
   * @param {string} interaction.configuration.profile.initial.save_button - Default label for initial collection of profile information save button.
   * @param {object} interaction.configuration.status - The configuration specific to status updates.
   * @param {string} interaction.configuration.status.body - The text status to render.
   * @param {string} interaction.configuration.title - The text title to render.
   * @param {number} interaction.version - The version of the interaction, 1 being legacy and 2 the most recent.
   * @param {object} sdk - The Apptentive WebSDK object.
   * @param {object} [options] - Your configuration options.
   * @static
   */
  static display(
    interaction: IInteraction<IMessageCenterConfiguration>,
    sdk: ApptentiveBase,
    options: IBaseInteractionOptions
  ) {
    try {
      const messageCenter = new ApptentiveMessageCenter(interaction, sdk, options);
      messageCenter.render();
    } catch (_) {}
  }
}
