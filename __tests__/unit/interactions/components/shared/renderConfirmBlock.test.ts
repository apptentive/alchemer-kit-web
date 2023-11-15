import renderConfirmBlock from '../../../../../src/interactions/components/shared/renderConfirmBlock';
import ApptentiveBaseBuilder from '../../../../mocks/builders/ApptentiveBaseBuilder';
import { fullMessageCenterConfig } from '../../../../mocks/data/message-center';
import ApptentiveMessageCenter from '../../../../../src/interactions/message-center';
import { _interactionOptions } from '../../../../mocks/data/shared-constants';
import { messageCenterSelectors } from '../../../../../src/constants/elementSelectors';

const _title = 'Progress will be lost. Would you like to exit?';
const _onSbmt = jest.fn();
const _onCancel = jest.fn();

const buildInteraction = () => {
  const { sdk } = new ApptentiveBaseBuilder()
    .useCachedManifest()
    .useOptions({ interactions: [fullMessageCenterConfig] })
    .build();

  const messageCenter = new ApptentiveMessageCenter(fullMessageCenterConfig, sdk, _interactionOptions);
  messageCenter.render();

  return {
    interactionContainer: messageCenter.container,
    container: document.querySelector<HTMLElement>(messageCenterSelectors.content) as HTMLElement,
  };
};

describe('renderConfirmBlock', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    _onCancel.mockClear();
    _onSbmt.mockClear();
  });

  test('properly renders confirm block', () => {
    const { interactionContainer, container } = buildInteraction();
    renderConfirmBlock(interactionContainer, container, _title, _onSbmt, _onCancel);

    expect(interactionContainer).toMatchSnapshot();
  });

  test('properly attaches submit function', () => {
    const { interactionContainer, container } = buildInteraction();
    renderConfirmBlock(interactionContainer, container, _title, _onSbmt, _onCancel);

    const confirmWrapper = document.querySelector('.apptentive-interaction__confirm-wrapper') as HTMLElement;
    const okBtn = confirmWrapper.childNodes[1] as HTMLElement;
    okBtn.click();

    expect(_onSbmt).toHaveBeenCalledTimes(1);
  });

  test('properly attaches cancel function', () => {
    const { interactionContainer, container } = buildInteraction();
    renderConfirmBlock(interactionContainer, container, _title, _onSbmt, _onCancel);

    const confirmWrapper = document.querySelector('.apptentive-interaction__confirm-wrapper') as HTMLElement;
    const cancelBtn = confirmWrapper.childNodes[2] as HTMLElement;
    cancelBtn.click();

    expect(_onCancel).toHaveBeenCalledTimes(1);
  });

  test('open interaction with confirm exit block on cross btn click when was minimized', () => {
    const { interactionContainer, container } = buildInteraction();
    expect(interactionContainer.className).toBe('fixed corner');

    const minimizeBtn = document.querySelector('.apptentive-appbar__action--minimize') as HTMLElement;
    minimizeBtn.click();

    expect(interactionContainer.className).toBe('fixed corner corner--minimized');

    renderConfirmBlock(interactionContainer, container, _title, _onSbmt, _onCancel);
    expect(interactionContainer.className).toBe('fixed corner');
  });
});
