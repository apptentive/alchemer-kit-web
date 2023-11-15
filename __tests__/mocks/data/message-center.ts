import { IMessageCenterConfiguration } from '../../../src/interfaces/interactions/IMessageCenterConfiguration';
import { IInteraction } from '../../../src/interfaces/manifest/IInteraction';

export const fullMessageCenterConfig: IInteraction<IMessageCenterConfiguration> = {
  id: '55bae8ef35878bc3c6000582',
  type: 'MessageCenter',
  version: 2,
  api_version: 12,
  configuration: {
    position: 'corner',
    title: 'Message Center',
    composer: {
      title: 'New Message',
      hint_text: 'Please leave detailed feedback',
      send_button: 'Send',
      send_start: 'Sending...',
      send_ok: 'Sent',
      send_fail: 'Failed',
      close_text: 'Close',
      close_confirm_body: 'Are you sure you want to discard this message?',
      close_discard_button: 'Discard',
      close_cancel_button: 'Cancel',
    },
    greeting: {
      title: 'Hello!',
      body: "We'd love to get feedback from you on our app. The more details you can provide, the better.",
      image_url: 'https://assets.apptentive.com/assets/app-icon/ribbon-79c9715222c1befe55a0110b9778b02e.png',
    },
    status: {
      body: 'We will get back to you soon!',
    },
    automated_message: {
      body: 'Please let us know how to make Apptentive better for you!',
    },
    error_messages: {
      http_error_body:
        "It looks like we're having trouble sending your message. We've saved it and will try sending it again soon.",
      network_error_body:
        "It looks like you aren't connected to the Internet right now. We've saved your message and will try again when we detect a connection.",
    },
    profile: {
      request: true,
      require: true,
      initial: {
        title: 'Who are we speaking with?',
        name_hint: 'Name',
        email_hint: 'Email',
        skip_button: 'Skip',
        save_button: "That's Me!",
      },
      edit: {
        title: 'Profile',
        name_hint: 'Name',
        email_hint: 'Email',
        skip_button: 'Cancel',
        save_button: 'Save',
      },
    },
  },
};

export const minimalMessageCenterConfig = {
  id: '55bae8ef35878bc3c6000582',
  type: 'MessageCenter',
  version: 2,
  api_version: 12,
  configuration: {
    composer: {
      title: 'New Message',
      hint_text: 'Please leave detailed feedback',
      send_button: 'Send',
      send_start: 'Sending...',
      send_ok: 'Sent',
      send_fail: 'Failed',
      close_confirm_body: 'Are you sure you want to discard this message?',
      close_discard_button: 'Discard',
      close_cancel_button: 'Cancel',
    },
    greeting: {
      body: "We'd love to get feedback from you on our app. The more details you can provide, the better.",
      image_url: 'https://assets.apptentive.com/assets/app-icon/ribbon-79c9715222c1befe55a0110b9778b02e.png',
    },
    automated_message: {
      body: 'Please let us know how to make Apptentive better for you!',
    },
    error_messages: {
      http_error_body:
        "It looks like we're having trouble sending your message. We've saved it and will try sending it again soon.",
      network_error_body:
        "It looks like you aren't connected to the Internet right now. We've saved your message and will try again when we detect a connection.",
    },
    profile: {
      request: false,
      require: false,
      initial: {
        title: 'Who are we speaking with?',
        name_hint: 'Name',
        email_hint: 'Email',
        skip_button: 'Skip',
        save_button: "That's Me!",
      },
      edit: {
        title: 'Profile',
        name_hint: 'Name',
        email_hint: 'Email',
        skip_button: 'Cancel',
        save_button: 'Save',
      },
    },
  },
} as IInteraction<IMessageCenterConfiguration>;
