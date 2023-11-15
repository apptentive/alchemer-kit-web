import ApptentiveLoveDialog from '../../../src/interactions/love-dialog';
import ApptentiveBaseBuilder from '../../mocks/builders/ApptentiveBaseBuilder';

import { _appId, _apiToken, _domNode, _domNodeId, _host, _interactionOptions } from '../../mocks/data/shared-constants';

const loveDialogConfig = {
  id: '55bae8ef35878bc3c600057c',
  type: 'EnjoymentDialog',
  version: 1,
  configuration: {
    title: 'Do you love app?',
    yes_text: 'Yes!',
    no_text: 'No',
    show_dismiss_button: false,
  },
} as any;

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
  const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build();

  // @ts-expect-error test for passing invalid config
  const loveDialog = new ApptentiveLoveDialog(undefined, sdk);
  loveDialog.render();
  expect(document.querySelector(_domNode)!.innerHTML).toBe('');
});

test('#render: should render a DOM element on the page', () => {
  const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build();
  const loveDialog = new ApptentiveLoveDialog(loveDialogConfig, sdk, _interactionOptions);
  loveDialog.render();

  expect(document.querySelector(_domNode)!.innerHTML).toMatchSnapshot();
});

test('#render: should render properly if configured DOM node does not exist', () => {
  const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build();
  const loveDialog = new ApptentiveLoveDialog(loveDialogConfig, sdk, { domNode: '#existentialElement' });
  loveDialog.render();

  expect(document.querySelector('body > apptentive-love-dialog')).not.toBeNull();
});

test('#render: can be built as a static method', () => {
  const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build();

  ApptentiveLoveDialog.display(loveDialogConfig, sdk, _interactionOptions);
  expect(document.querySelector(_domNode)!.innerHTML).toMatchSnapshot();
});

test('#render: does not throw if no parameters are passed', () => {
  // @ts-expect-error test validating no error when missing parameters
  expect(() => ApptentiveLoveDialog.display()).not.toThrow();
});

test('#render: renders only once', () => {
  const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build();
  const loveDialog = new ApptentiveLoveDialog(loveDialogConfig, sdk, _interactionOptions);
  loveDialog.render();
  loveDialog.render();

  expect(document.querySelectorAll('apptentive-love-dialog').length).toBe(1);
});

test('#cancel: should not throw an error', () => {
  const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build();
  const loveDialog = new ApptentiveLoveDialog(loveDialogConfig, sdk, _interactionOptions);
  loveDialog.render();

  expect(() => {
    loveDialog.cancel(new Event('cancel'));
  }).not.toThrow();
});

test('#cancel: should handle error if no sdk is available', () => {
  // @ts-expect-error test for missing sdk and options
  const loveDialog = new ApptentiveLoveDialog(loveDialogConfig);

  expect(() => loveDialog.cancel(new Event('cancel'))).not.toThrow();
});

test('#dismiss: should not throw an error', () => {
  const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build();
  const loveDialog = new ApptentiveLoveDialog(loveDialogConfig, sdk, _interactionOptions);
  loveDialog.render();

  expect(() => {
    loveDialog.dismiss(new Event('dismiss'));
  }).not.toThrow();
});

test('#dismiss: should handle error if no sdk is available', () => {
  // @ts-expect-error test for missing sdk parameter
  const loveDialog = new ApptentiveLoveDialog(loveDialogConfig);

  expect(() => loveDialog.dismiss(new Event('dismiss'))).not.toThrow();
});

test('#dismiss: should remove the interaction from the DOM', () => {
  const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build();
  const loveDialog = new ApptentiveLoveDialog(loveDialogConfig, sdk, _interactionOptions);
  loveDialog.render();

  expect(document.querySelectorAll('apptentive-love-dialog').length).toBe(1);

  const dismiss = document.querySelector<HTMLButtonElement>('.close-love-dialog')!;
  dismiss.click();

  expect(document.querySelectorAll('apptentive-love-dialog').length).toBe(0);
});

test('#cancel: should engage a close and cancel event', () => {
  const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build();
  const loveDialog = new ApptentiveLoveDialog(loveDialogConfig, sdk, _interactionOptions);
  loveDialog.render();

  const apiSpy = jest.spyOn(loveDialog.sdk, 'engage');

  const cancel = document.querySelector<HTMLButtonElement>('.close-love-dialog')!;
  cancel.click();

  expect(apiSpy.mock.calls[0][0]).toBe('com.apptentive#EnjoymentDialog#cancel');
  expect(apiSpy.mock.calls[0][1]!.id).toBe('55bae8ef35878bc3c600057c');

  apiSpy.mockRestore();
});

test('Yes Button: should remove the interaction from the DOM', () => {
  const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build();
  const loveDialog = new ApptentiveLoveDialog(loveDialogConfig, sdk, _interactionOptions);
  loveDialog.render();

  expect(document.querySelectorAll('apptentive-love-dialog').length).toBe(1);

  const dismiss = document.querySelector<HTMLButtonElement>(
    '.apptentive-love-dialog-action.apptentive-love-dialog-yes'
  )!;
  dismiss.click();

  expect(document.querySelectorAll('apptentive-love-dialog').length).toBe(0);
});

test('Yes Button: should engage a close event', () => {
  const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build();
  const loveDialog = new ApptentiveLoveDialog(loveDialogConfig, sdk, _interactionOptions);
  loveDialog.render();

  const apiSpy = jest.spyOn(loveDialog.sdk, 'engage');
  const dismiss = document.querySelector<HTMLButtonElement>(
    '.apptentive-love-dialog-action.apptentive-love-dialog-yes'
  )!;
  dismiss.click();

  expect(apiSpy.mock.calls[0][0]).toBe('com.apptentive#EnjoymentDialog#yes');
  expect(apiSpy.mock.calls[0][1]!.id).toBe('55bae8ef35878bc3c600057c');
  expect(apiSpy.mock.calls[0][1]!.label).toBe('Yes!');

  apiSpy.mockRestore();
});

test('No Button: should remove the interaction from the DOM', () => {
  const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build();
  const loveDialog = new ApptentiveLoveDialog(loveDialogConfig, sdk, _interactionOptions);
  loveDialog.render();

  expect(document.querySelectorAll('apptentive-love-dialog').length).toBe(1);

  const dismiss = document.querySelector<HTMLButtonElement>(
    '.apptentive-love-dialog-action.apptentive-love-dialog-no'
  )!;
  dismiss.click();

  expect(document.querySelectorAll('apptentive-love-dialog').length).toBe(0);
});

test('No Button: should engage a close event', () => {
  const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build();
  const loveDialog = new ApptentiveLoveDialog(loveDialogConfig, sdk, _interactionOptions);
  loveDialog.render();

  const apiSpy = jest.spyOn(loveDialog.sdk, 'engage');

  const dismiss = document.querySelector<HTMLButtonElement>(
    '.apptentive-love-dialog-action.apptentive-love-dialog-no'
  )!;
  dismiss.click();

  expect(apiSpy.mock.calls[0][0]).toBe('com.apptentive#EnjoymentDialog#no');
  expect(apiSpy.mock.calls[0][1]!.id).toBe('55bae8ef35878bc3c600057c');
  expect(apiSpy.mock.calls[0][1]!.label).toBe('No');

  apiSpy.mockRestore();
});
