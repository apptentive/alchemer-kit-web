import renderAppbar from '../../../../../src/interactions/components/shared/renderAppbar';
import minimizeContainer from '../../../../../src/interactions/helpers/minimizeContainer';

jest.mock('../../../../../src/interactions/helpers/minimizeContainer.ts');

const _title = 'Title';
const _position = 'corner';
const _onDismiss = jest.fn();

describe('renderAppbar', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('properly renders appbar', () => {
    const output = renderAppbar(null as any, _title, _position, _onDismiss);

    expect(output).toMatchSnapshot();
  });

  test('properly attaches dismiss event', () => {
    document.body.append(renderAppbar(null as any, _title, _position, _onDismiss));

    const dismissButton = document.querySelector<HTMLButtonElement>(
      '.apptentive-appbar .apptentive-appbar__action--close'
    )!;

    dismissButton.click();

    expect(_onDismiss).toHaveBeenCalledTimes(1);

    _onDismiss.mockClear();
  });

  test('properly attaches minimize event', () => {
    const wrapperElement = document.createElement('div');
    wrapperElement.appendChild(renderAppbar(wrapperElement, _title, _position, _onDismiss));
    document.body.append(wrapperElement);

    const minimizeButton = document.querySelector<HTMLButtonElement>(
      '.apptentive-appbar .apptentive-appbar__action--minimize'
    )!;

    minimizeButton.click();

    expect(minimizeContainer).toHaveBeenCalledTimes(1);
    expect(minimizeButton.classList.contains('apptentive-appbar__action--minimize--active')).toBe(true);
  });
});
