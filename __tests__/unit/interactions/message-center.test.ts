import { HTTPError } from 'ky';
import ApptentiveMessageCenter from '../../../src/interactions/message-center';
import ApptentiveBaseBuilder from '../../mocks/builders/ApptentiveBaseBuilder';
import { fullMessageCenterConfig, minimalMessageCenterConfig } from '../../mocks/data/message-center';
import { _domNode, _domNodeId, _host, _interactionOptions, _apiToken, _appId } from '../../mocks/data/shared-constants';
import browserEvents from '../../../src/constants/browser-events';
import ApptentiveApi from '../../../src/api';

const _mockErrorObject = new HTTPError(
  new Response(new Blob([JSON.stringify({}, null, 2)], { type: 'application/json' })),
  new Request('apptentive.com'),
  {
    method: 'GET',
    credentials: 'same-origin',
    retry: {},
    prefixUrl: '',
    onDownloadProgress: () => {},
  }
);
const setNameAndEmail = (name: string, email: string) => {
  document.querySelector<HTMLInputElement>('.apptentive-message-center-profile__name input')!.value = name;
  document.querySelector<HTMLInputElement>('.apptentive-message-center-profile__email input')!.value = email;
};

const getProfileDisplay = () => {
  const profileElement = document.querySelector<HTMLElement>('.apptentive-message-center-profile');

  if (profileElement) {
    return profileElement.style.display;
  }

  return 'none';
};

const getFeedbackDisplay = () =>
  document.querySelector<HTMLElement>('.apptentive-message-center-feedback')!.style.display;

beforeEach(() => {
  const div = document.createElement('div');
  div.id = _domNodeId;
  div.innerHTML = '';
  document.body.append(div);
});

afterEach(() => {
  document.body.innerHTML = '';
});

test('#constructor: has no side effect if no config is passed', () => {
  const { sdk } = new ApptentiveBaseBuilder()
    .useCachedManifest()
    .useOptions({ interactions: [fullMessageCenterConfig] })
    .build();

  // @ts-expect-error test validating missing configuration
  const messageCenter = new ApptentiveMessageCenter(undefined, sdk, _interactionOptions);
  messageCenter.render();

  expect(document.querySelector(_domNode)!.innerHTML).toBe('');
});

test('#constructor: has no side effect if version is less than 2', () => {
  const { sdk } = new ApptentiveBaseBuilder()
    .useCachedManifest()
    .useOptions({ interactions: [fullMessageCenterConfig] })
    .build();

  // @ts-expect-error test validating empty configuration
  const messageCenter = new ApptentiveMessageCenter({ configuration: {}, version: 1 }, sdk, _interactionOptions);
  messageCenter.render();

  expect(document.querySelector(_domNode)!.innerHTML).toBe('');
});

test('#render: should render a DOM element on the page', () => {
  const { sdk } = new ApptentiveBaseBuilder()
    .useCachedManifest()
    .useOptions({ interactions: [fullMessageCenterConfig] })
    .build();

  const messageCenter = new ApptentiveMessageCenter(fullMessageCenterConfig, sdk, _interactionOptions);
  messageCenter.render();

  expect(document.querySelector(_domNode)!.innerHTML).toMatchSnapshot();
});

test('#render: can be built as a static method', () => {
  const { sdk } = new ApptentiveBaseBuilder()
    .useCachedManifest()
    .useOptions({ interactions: [fullMessageCenterConfig] })
    .build();

  ApptentiveMessageCenter.display(fullMessageCenterConfig, sdk, _interactionOptions);
  expect(document.querySelector(_domNode)!.innerHTML).toMatchSnapshot();
});

test('#render: static method handles error when no sdk is passed', () => {
  // @ts-expect-error test validating missing sdk parameter
  expect(() => ApptentiveMessageCenter.display(fullMessageCenterConfig, null, _interactionOptions)).not.toThrow();
  expect(document.querySelector('apptentive-messsage-center')).toBeNull();
});

test('#render: renders only once', () => {
  const { sdk } = new ApptentiveBaseBuilder()
    .useCachedManifest()
    .useOptions({ interactions: [fullMessageCenterConfig] })
    .build();

  const messageCenter = new ApptentiveMessageCenter(fullMessageCenterConfig, sdk, _interactionOptions);
  messageCenter.render();
  messageCenter.render();
  messageCenter.render();

  const nodes = document.querySelectorAll('apptentive-message-center');
  expect(nodes.length).toBe(1);
});

test('#render: with a person who has a name & email should not show the profile entry area', () => {
  const { sdk } = new ApptentiveBaseBuilder()
    .useCachedManifest()
    .useOptions({ interactions: [fullMessageCenterConfig] })
    .build();

  sdk.logicEngine.person.name = 'Name';
  sdk.logicEngine.person.email = 'email@email.email';

  const messageCenter = new ApptentiveMessageCenter(fullMessageCenterConfig, sdk, _interactionOptions);
  messageCenter.render();

  const profile = getProfileDisplay();
  const feedback = getFeedbackDisplay();

  expect(profile).toBe('none');
  expect(feedback).toBe('');
});

test('#render: with a person who has a name but no email should show the profile entry area', () => {
  const { sdk } = new ApptentiveBaseBuilder()
    .useCachedManifest()
    .useOptions({ interactions: [fullMessageCenterConfig] })
    .build();

  sdk.logicEngine.person.name = 'Name';
  sdk.logicEngine.person.email = '';

  const messageCenter = new ApptentiveMessageCenter(fullMessageCenterConfig, sdk, _interactionOptions);
  messageCenter.render();

  const profile = getProfileDisplay();
  const feedback = getFeedbackDisplay();

  expect(profile).toBe('');
  expect(feedback).toBe('');
});

test('#render: with a person who has no name but an email should show the profile entry area', () => {
  const { sdk } = new ApptentiveBaseBuilder()
    .useCachedManifest()
    .useOptions({ interactions: [fullMessageCenterConfig] })
    .build();

  sdk.logicEngine.person.name = '';
  sdk.logicEngine.person.email = 'email@email.email';

  const messageCenter = new ApptentiveMessageCenter(fullMessageCenterConfig, sdk, _interactionOptions);
  messageCenter.render();

  const profile = getProfileDisplay();
  const feedback = getFeedbackDisplay();

  expect(profile).toBe('');
  expect(feedback).toBe('');
});

test('#render: with a person who has no name and no email should show the profile entry area', () => {
  const { sdk } = new ApptentiveBaseBuilder()
    .useCachedManifest()
    .useOptions({ interactions: [fullMessageCenterConfig] })
    .build();

  sdk.logicEngine.person.name = '';
  sdk.logicEngine.person.email = '';

  const messageCenter = new ApptentiveMessageCenter(fullMessageCenterConfig, sdk, _interactionOptions);
  messageCenter.render();

  const profile = getProfileDisplay();
  const feedback = getFeedbackDisplay();

  expect(profile).toBe('');
  expect(feedback).toBe('');
});

test('#render: with a person who has no name and no email but not profile requested should not show the profile entry area', () => {
  const { sdk } = new ApptentiveBaseBuilder()
    .useCachedManifest()
    .useOptions({ interactions: [fullMessageCenterConfig] })
    .build();

  sdk.logicEngine.person.name = '';
  sdk.logicEngine.person.email = '';

  const config = {
    ...fullMessageCenterConfig,
    configuration: {
      ...fullMessageCenterConfig.configuration,
      profile: {
        ...fullMessageCenterConfig.configuration.profile,
        request: false,
        require: false,
      },
    },
  };

  const messageCenter = new ApptentiveMessageCenter(config, sdk, _interactionOptions);
  messageCenter.render();

  const profile = getProfileDisplay();
  const feedback = getFeedbackDisplay();

  expect(profile).toBe('none');
  expect(feedback).toBe('');
});

test('#render: should render with a minimal configuration', () => {
  const { sdk } = new ApptentiveBaseBuilder()
    .useCachedManifest()
    .useOptions({ interactions: [minimalMessageCenterConfig] })
    .build();

  const messageCenter = new ApptentiveMessageCenter(minimalMessageCenterConfig, sdk, _interactionOptions);

  expect(() => messageCenter.render()).not.toThrow();
});

test('#render: should render without a person object', () => {
  const { sdk } = new ApptentiveBaseBuilder()
    .useCachedManifest()
    .useOptions({ interactions: [fullMessageCenterConfig] })
    .build();

  sdk.logicEngine.person = null as any;

  const messageCenter = new ApptentiveMessageCenter(fullMessageCenterConfig, sdk, _interactionOptions);

  expect(() => messageCenter.render()).not.toThrow();
});

test('#dismiss: should not throw an error', () => {
  const { sdk } = new ApptentiveBaseBuilder()
    .useCachedManifest()
    .useOptions({ interactions: [fullMessageCenterConfig] })
    .build();

  const messageCenter = new ApptentiveMessageCenter(fullMessageCenterConfig, sdk, _interactionOptions);
  messageCenter.render();

  expect(() => {
    messageCenter.handleClose();
  }).not.toThrow();
});

test('#dismiss: should remove the interaction from the DOM', () => {
  const { sdk } = new ApptentiveBaseBuilder()
    .useCachedManifest()
    .useOptions({ interactions: [fullMessageCenterConfig] })
    .build();

  const messageCenter = new ApptentiveMessageCenter(fullMessageCenterConfig, sdk, _interactionOptions);
  messageCenter.render();

  expect(document.querySelectorAll('apptentive-message-center').length).toBe(1);

  const closeButton = document.querySelector<HTMLButtonElement>(
    '.apptentive-appbar .apptentive-appbar__action--close'
  )!;
  closeButton.click();

  expect(document.querySelectorAll('apptentive-message-center').length).toBe(0);
});

test('#dismiss: should remove the interaction from the DOM even if the SDK dies', () => {
  const { sdk } = new ApptentiveBaseBuilder()
    .useCachedManifest()
    .useOptions({ interactions: [fullMessageCenterConfig] })
    .build();

  const messageCenter = new ApptentiveMessageCenter(fullMessageCenterConfig, sdk, _interactionOptions);
  messageCenter.render();

  delete (messageCenter as any).sdk;
  expect(document.querySelectorAll('apptentive-message-center').length).toBe(1);

  const button = document.querySelector<HTMLButtonElement>('.apptentive-appbar .apptentive-appbar__action--close')!;
  button.click();

  expect(document.querySelectorAll('apptentive-message-center').length).toBe(0);
});

test('#dismiss: should engage a close event', () => {
  const { sdk } = new ApptentiveBaseBuilder()
    .useCachedManifest()
    .useOptions({ interactions: [fullMessageCenterConfig] })
    .build();

  const messageCenter = new ApptentiveMessageCenter(fullMessageCenterConfig, sdk, _interactionOptions);
  messageCenter.render();

  const apiSpy = jest.spyOn(messageCenter.sdk, 'engage');

  const button = document.querySelector<HTMLButtonElement>('.apptentive-appbar .apptentive-appbar__action--close')!;
  button.click();

  expect(apiSpy.mock.calls[0][0]).toBe('com.apptentive#MessageCenter#close');
  expect(apiSpy.mock.calls[0][1]!.id).toBe('55bae8ef35878bc3c6000582');

  apiSpy.mockRestore();
});

test('#handleClose: should not throw an error', () => {
  const { sdk } = new ApptentiveBaseBuilder()
    .useCachedManifest()
    .useOptions({ interactions: [fullMessageCenterConfig] })
    .build();

  const messageCenter = new ApptentiveMessageCenter(fullMessageCenterConfig, sdk, _interactionOptions);
  messageCenter.render();

  delete (messageCenter as any).container;

  expect(() => {
    messageCenter.handleClose();
  }).not.toThrow();
});

test('#handleClose: should show/hide confirm block', () => {
  const { sdk } = new ApptentiveBaseBuilder()
    .useCachedManifest()
    .useOptions({ interactions: [fullMessageCenterConfig] })
    .build();

  const messageCenter = new ApptentiveMessageCenter(fullMessageCenterConfig, sdk, _interactionOptions);
  messageCenter.render();

  const msgTextArea = document.querySelector<HTMLTextAreaElement>(
    '.apptentive-message-center-feedback textarea'
  ) as HTMLTextAreaElement;
  msgTextArea.value = 'test123';
  expect(msgTextArea.value).toEqual('test123');

  const crossBtn = document.querySelector<HTMLButtonElement>('.apptentive-appbar .apptentive-appbar__action--close')!;
  crossBtn.click();

  let confirmWrapper = document.querySelector('.apptentive-interaction__confirm-wrapper') as HTMLElement;

  const okBtn = confirmWrapper.childNodes[1] as HTMLElement;
  const cancelBtn = confirmWrapper.childNodes[2] as HTMLElement;

  expect(confirmWrapper.childElementCount).toEqual(3);
  expect(confirmWrapper.firstChild?.textContent).toEqual('Progress will be lost. Would you like to exit?');
  expect(okBtn.textContent).toEqual('OK');
  expect(cancelBtn.textContent).toEqual('CANCEL');

  cancelBtn.click();
  confirmWrapper = document.querySelector('.apptentive-interaction__confirm-wrapper') as HTMLElement;
  expect(confirmWrapper.childElementCount).toEqual(0);
});

test('#handleClose: should close confirm block on OK btn click', () => {
  const { sdk } = new ApptentiveBaseBuilder()
    .useCachedManifest()
    .useOptions({ interactions: [fullMessageCenterConfig] })
    .build();

  const messageCenter = new ApptentiveMessageCenter(fullMessageCenterConfig, sdk, _interactionOptions);
  messageCenter.render();

  const apiSpy = jest.spyOn(messageCenter.sdk, 'engage');

  const msgTextArea = document.querySelector<HTMLTextAreaElement>(
    '.apptentive-message-center-feedback textarea'
  ) as HTMLTextAreaElement;
  msgTextArea.value = 'test123';
  expect(msgTextArea.value).toEqual('test123');

  const crossBtn = document.querySelector<HTMLButtonElement>('.apptentive-appbar .apptentive-appbar__action--close')!;
  crossBtn.click();

  const confirmWrapper = document.querySelector('.apptentive-interaction__confirm-wrapper') as HTMLElement;
  const okBtn = confirmWrapper.childNodes[1] as HTMLElement;
  okBtn.click();

  expect(apiSpy.mock.calls[0][0]).toBe('com.apptentive#MessageCenter#close');
  expect(apiSpy.mock.calls[0][1]!.id).toBe('55bae8ef35878bc3c6000582');
});

test('#handleClose: should close confirm block on cross btn click', () => {
  const { sdk } = new ApptentiveBaseBuilder()
    .useCachedManifest()
    .useOptions({ interactions: [fullMessageCenterConfig] })
    .build();

  const messageCenter = new ApptentiveMessageCenter(fullMessageCenterConfig, sdk, _interactionOptions);
  messageCenter.render();

  const apiSpy = jest.spyOn(messageCenter.sdk, 'engage');

  const msgTextArea = document.querySelector<HTMLTextAreaElement>(
    '.apptentive-message-center-feedback textarea'
  ) as HTMLTextAreaElement;
  msgTextArea.value = 'test123';
  expect(msgTextArea.value).toEqual('test123');

  const crossBtn = document.querySelector<HTMLButtonElement>('.apptentive-appbar .apptentive-appbar__action--close')!;
  crossBtn.click();
  crossBtn.click();

  expect(apiSpy.mock.calls[0][0]).toBe('com.apptentive#MessageCenter#close');
  expect(apiSpy.mock.calls[0][1]!.id).toBe('55bae8ef35878bc3c6000582');
});

test('#handleClose: should remove the interaction from the DOM', () => {
  const { sdk } = new ApptentiveBaseBuilder()
    .useCachedManifest()
    .useOptions({ interactions: [fullMessageCenterConfig] })
    .build();

  const messageCenter = new ApptentiveMessageCenter(fullMessageCenterConfig, sdk, _interactionOptions);
  messageCenter.render();

  expect(document.querySelectorAll('apptentive-message-center').length).toBe(1);

  messageCenter.handleClose();

  expect(document.querySelectorAll('apptentive-message-center').length).toBe(0);
});

test('#handleClose: should remove the interaction from the DOM even if the SDK dies', () => {
  const { sdk } = new ApptentiveBaseBuilder()
    .useCachedManifest()
    .useOptions({ interactions: [fullMessageCenterConfig] })
    .build();

  const messageCenter = new ApptentiveMessageCenter(fullMessageCenterConfig, sdk, _interactionOptions);
  messageCenter.render();

  expect(document.querySelectorAll('apptentive-message-center').length).toBe(1);
  delete (messageCenter as any).sdk;
  messageCenter.handleClose();
  expect(document.querySelectorAll('apptentive-message-center').length).toBe(0);
});

test('#handleClose: should engage a close event', () => {
  const { sdk } = new ApptentiveBaseBuilder()
    .useCachedManifest()
    .useOptions({ interactions: [fullMessageCenterConfig] })
    .build();

  const messageCenter = new ApptentiveMessageCenter(fullMessageCenterConfig, sdk, _interactionOptions);
  messageCenter.render();

  const apiSpy = jest.spyOn(messageCenter.sdk, 'engage');

  messageCenter.handleClose();

  expect(apiSpy.mock.calls[0][0]).toBe('com.apptentive#MessageCenter#close');
  expect(apiSpy.mock.calls[0][1]!.id).toBe('55bae8ef35878bc3c6000582');

  apiSpy.mockRestore();
});

test('Submit Button: should not throw an error with no body', () => {
  const { sdk } = new ApptentiveBaseBuilder()
    .useCachedManifest()
    .useOptions({ interactions: [fullMessageCenterConfig] })
    .build();

  const messageCenter = new ApptentiveMessageCenter(fullMessageCenterConfig, sdk, _interactionOptions);
  messageCenter.render();

  expect(() => {
    messageCenter.submit();
  }).not.toThrow();
});

test('Submit Button: should not throw an error with a body', () => {
  const { sdk } = new ApptentiveBaseBuilder()
    .useCachedManifest()
    .useOptions({ interactions: [fullMessageCenterConfig] })
    .build();

  const messageCenter = new ApptentiveMessageCenter(fullMessageCenterConfig, sdk, _interactionOptions);
  messageCenter.render();

  document.querySelector<HTMLInputElement>('.apptentive-message-center-feedback textarea')!.value = 'Test';
  expect(() => {
    messageCenter.submit();
  }).not.toThrow();
});

test('Submit Button: Success: should show the thank you message when provided with a body and applicable config', (done) => {
  const createMessageSpy = jest.spyOn(ApptentiveApi.prototype, 'createMessage').mockResolvedValue({} as any);
  const successEventListener = () => {
    expect(document.querySelector<HTMLElement>('apptentive-message-center-thank-you')!.style.display).toBe('');
    expect(document.querySelector<HTMLElement>('apptentive-errors')!.style.display).toBe('none');

    document.removeEventListener(browserEvents.APPTENTIVE_MESSAGE_CENTER_SEND, successEventListener);
    createMessageSpy.mockRestore();
    done();
  };

  document.addEventListener(browserEvents.APPTENTIVE_MESSAGE_CENTER_SEND, successEventListener);

  const { sdk } = new ApptentiveBaseBuilder()
    .useCachedManifest()
    .useOptions({ interactions: [fullMessageCenterConfig] })
    .build()
    .withConversation();

  const messageCenter = new ApptentiveMessageCenter(fullMessageCenterConfig, sdk, _interactionOptions);
  messageCenter.render();

  expect(document.querySelectorAll<HTMLElement>('apptentive-message-center').length).toBe(1);
  expect(document.querySelector<HTMLElement>('apptentive-message-center-thank-you')!.style.display).toBe('none');
  expect(document.querySelector<HTMLElement>('apptentive-errors')!.style.display).toBe('none');

  setNameAndEmail('John', 'john.doe@test.com');
  document.querySelector<HTMLInputElement>('.apptentive-message-center-feedback textarea')!.value = 'Test';

  const button = document.querySelector<HTMLButtonElement>('.apptentive-message-center__actions button')!;
  button.click();
});

test('Submit Button: Error: should show the errors', (done) => {
  const createMessageSpy = jest.spyOn(ApptentiveApi.prototype, 'createMessage').mockRejectedValue(new Error('error'));
  const errorEventListener = () => {
    expect(document.querySelector<HTMLElement>('apptentive-message-center-thank-you')!.style.display).toBe('none');
    expect(document.querySelector<HTMLElement>('apptentive-errors')!.style.display).toBe('');

    document.removeEventListener(browserEvents.APPTENTIVE_MESSAGE_CENTER_ERROR, errorEventListener);
    createMessageSpy.mockRestore();
    done();
  };

  document.addEventListener(browserEvents.APPTENTIVE_MESSAGE_CENTER_ERROR, errorEventListener);

  const { sdk } = new ApptentiveBaseBuilder()
    .useCachedManifest()
    .useOptions({ interactions: [fullMessageCenterConfig] })
    .build();

  const messageCenter = new ApptentiveMessageCenter(fullMessageCenterConfig, sdk, _interactionOptions);
  messageCenter.render();

  expect(document.querySelectorAll('apptentive-message-center').length).toBe(1);
  expect(document.querySelector<HTMLElement>('apptentive-message-center-thank-you')!.style.display).toBe('none');
  expect(document.querySelector<HTMLElement>('apptentive-errors')!.style.display).toBe('none');

  setNameAndEmail('John', 'john.doe@test.com');
  document.querySelector<HTMLInputElement>('.apptentive-message-center-feedback textarea')!.value = 'Test';

  const button = document.querySelector<HTMLButtonElement>('.apptentive-message-center__actions button')!;
  button.click();
});

test('#submit: should be able to submit with minimal configuration', () => {
  const { sdk } = new ApptentiveBaseBuilder()
    .useCachedManifest()
    .useOptions({ interactions: [minimalMessageCenterConfig] })
    .build();

  const messageCenter = new ApptentiveMessageCenter(minimalMessageCenterConfig, sdk, _interactionOptions);
  messageCenter.render();

  document.querySelector<HTMLInputElement>('.apptentive-message-center-feedback textarea')!.value = 'Test';

  expect(() => messageCenter.submit()).not.toThrow();
});

test('#submitted: Success: should engage a send event', () => {
  const { sdk } = new ApptentiveBaseBuilder()
    .useCachedManifest()
    .useOptions({ interactions: [fullMessageCenterConfig] })
    .build();

  const messageCenter = new ApptentiveMessageCenter(fullMessageCenterConfig, sdk, _interactionOptions);
  messageCenter.render();

  const apiSpy = jest.spyOn(messageCenter.sdk, 'engage');

  messageCenter.submitted();

  expect(apiSpy.mock.calls[0][0]).toBe('com.apptentive#MessageCenter#send');
  expect(apiSpy.mock.calls[0][1]!.id).toBe('55bae8ef35878bc3c6000582');

  apiSpy.mockRestore();
});

test('#submitted: should dismiss with no thank you configuration', () => {
  const { sdk } = new ApptentiveBaseBuilder()
    .useCachedManifest()
    .useOptions({ interactions: [minimalMessageCenterConfig] })
    .build();

  const messageCenter = new ApptentiveMessageCenter(minimalMessageCenterConfig, sdk, _interactionOptions);
  messageCenter.render();
  messageCenter.submitted();

  expect(document.querySelector('apptentive-message-center')).toBeNull();
});

test('#errored: should parse error test and show the error', () => {
  const { sdk } = new ApptentiveBaseBuilder()
    .useCachedManifest()
    .useOptions({ interactions: [fullMessageCenterConfig] })
    .build();

  const messageCenter = new ApptentiveMessageCenter(fullMessageCenterConfig, sdk, _interactionOptions);
  messageCenter.render();

  expect(document.querySelector<HTMLElement>('apptentive-errors')!.style.display).toBe('none');

  // @ts-expect-error test validating minimal error object
  messageCenter.errored({ responseText: '{ "error": "Error" }' });
  expect(document.querySelector<HTMLElement>('apptentive-errors')!.style.display).toBe('');
  expect(document.querySelector<HTMLElement>('apptentive-errors')!.innerHTML).toBe('Error');
});

test('#errored: should show a default error when no response is returned', () => {
  const { sdk } = new ApptentiveBaseBuilder()
    .useCachedManifest()
    .useOptions({ interactions: [fullMessageCenterConfig] })
    .build();

  const messageCenter = new ApptentiveMessageCenter(fullMessageCenterConfig, sdk, _interactionOptions);
  messageCenter.render();

  expect(document.querySelector<HTMLElement>('apptentive-errors')!.style.display).toBe('none');

  // @ts-expect-error test validating missing error object
  messageCenter.errored();
  expect(document.querySelector<HTMLElement>('apptentive-errors')!.style.display).toBe('');
  expect(document.querySelector<HTMLElement>('apptentive-errors')!.innerHTML).toBe(
    'Please double check your message and try again.'
  );
});

test('#errored: should show a default error when a different response is returned', () => {
  const { sdk } = new ApptentiveBaseBuilder()
    .useCachedManifest()
    .useOptions({ interactions: [fullMessageCenterConfig] })
    .build();

  const messageCenter = new ApptentiveMessageCenter(fullMessageCenterConfig, sdk, _interactionOptions);
  messageCenter.render();

  expect(document.querySelector<HTMLElement>('apptentive-errors')!.style.display).toBe('none');

  // @ts-expect-error test validating invalid error object
  messageCenter.errored({ responseText: '{ "errors": ["Error"] }' });
  expect(document.querySelector<HTMLElement>('apptentive-errors')!.style.display).toBe('');
  expect(document.querySelector<HTMLElement>('apptentive-errors')!.innerHTML).toBe(
    'Please double check your message and try again.'
  );
});

test('#errored: should show a default error when invalid response is returned', () => {
  const { sdk } = new ApptentiveBaseBuilder()
    .useCachedManifest()
    .useOptions({ interactions: [fullMessageCenterConfig] })
    .build();

  const messageCenter = new ApptentiveMessageCenter(fullMessageCenterConfig, sdk, _interactionOptions);
  messageCenter.render();

  expect(document.querySelector<HTMLElement>('apptentive-errors')!.style.display).toBe('none');

  // @ts-expect-error test validating invalid error object
  messageCenter.errored({ responseText: 'ERROR' });
  expect(document.querySelector<HTMLElement>('apptentive-errors')!.style.display).toBe('');
  expect(document.querySelector<HTMLElement>('apptentive-errors')!.innerHTML).toBe(
    'Please double check your message and try again.'
  );
});

test('#errored: should handle a missing errors container', () => {
  const { sdk } = new ApptentiveBaseBuilder()
    .useCachedManifest()
    .useOptions({ interactions: [fullMessageCenterConfig] })
    .build();

  const messageCenter = new ApptentiveMessageCenter(fullMessageCenterConfig, sdk, _interactionOptions);
  messageCenter.render();

  document.querySelector('apptentive-errors')!.remove();

  expect(() => messageCenter.errored(_mockErrorObject)).not.toThrow();
});

test('#errored: should handle a missing submit button', () => {
  const { sdk } = new ApptentiveBaseBuilder()
    .useCachedManifest()
    .useOptions({ interactions: [fullMessageCenterConfig] })
    .build();

  const messageCenter = new ApptentiveMessageCenter(fullMessageCenterConfig, sdk, _interactionOptions);
  messageCenter.render();

  document.querySelector('.apptentive-message-center__actions .apptentive-button--primary')!.remove();

  expect(() => messageCenter.errored(_mockErrorObject)).not.toThrow();
});

test('#saveProfile: with a name and email should call updatePerson with a person object', () => {
  const { sdk } = new ApptentiveBaseBuilder()
    .useCachedManifest()
    .useOptions({ interactions: [fullMessageCenterConfig] })
    .build();

  const messageCenter = new ApptentiveMessageCenter(fullMessageCenterConfig, sdk, _interactionOptions);
  messageCenter.render();

  const apiSpy = jest.spyOn(messageCenter.sdk, 'updatePerson');

  const name = 'Name';
  const email = 'email@email.test1';
  setNameAndEmail(name, email);
  messageCenter.saveProfile();

  expect(apiSpy).toHaveBeenCalledTimes(1);
  expect(apiSpy.mock.calls[0][0]).toEqual({ name, email });

  apiSpy.mockRestore();
});

test('#saveProfile: with only a name and no email should call updatePerson with a person object', () => {
  const { sdk } = new ApptentiveBaseBuilder()
    .useCachedManifest()
    .useOptions({ interactions: [fullMessageCenterConfig] })
    .build();

  const messageCenter = new ApptentiveMessageCenter(fullMessageCenterConfig, sdk, _interactionOptions);
  messageCenter.render();

  const apiSpy = jest.spyOn(messageCenter.sdk, 'updatePerson');

  const name = 'Name';
  const email = '';
  setNameAndEmail(name, email);
  messageCenter.saveProfile();

  expect(apiSpy).toHaveBeenCalledTimes(1);
  expect(apiSpy.mock.calls[0][0]).toEqual({ name });

  apiSpy.mockRestore();
});

test('#saveProfile: with no name and only an email should call updatePerson with a person object', () => {
  const { sdk } = new ApptentiveBaseBuilder()
    .useCachedManifest()
    .useOptions({ interactions: [fullMessageCenterConfig] })
    .build();

  const messageCenter = new ApptentiveMessageCenter(fullMessageCenterConfig, sdk, _interactionOptions);
  messageCenter.render();

  const apiSpy = jest.spyOn(messageCenter.sdk, 'updatePerson');

  const name = '';
  const email = 'email@email.test2';
  setNameAndEmail(name, email);
  messageCenter.saveProfile();

  expect(apiSpy).toHaveBeenCalledTimes(1);
  expect(apiSpy.mock.calls[0][0]).toEqual({ email });

  apiSpy.mockRestore();
});

test('#saveProfile: with no name and no email should not call updatePerson', () => {
  const { sdk } = new ApptentiveBaseBuilder()
    .useCachedManifest()
    .useOptions({ interactions: [fullMessageCenterConfig] })
    .build();

  const messageCenter = new ApptentiveMessageCenter(fullMessageCenterConfig, sdk, _interactionOptions);
  messageCenter.render();

  const apiSpy = jest.spyOn(messageCenter.sdk, 'updatePerson');

  const name = '';
  const email = '';
  setNameAndEmail(name, email);
  messageCenter.saveProfile();

  expect(apiSpy).not.toHaveBeenCalled();

  apiSpy.mockRestore();
});
