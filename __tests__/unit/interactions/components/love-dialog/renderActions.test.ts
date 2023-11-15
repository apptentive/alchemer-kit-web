import renderActions from '../../../../../src/interactions/components/love-dialog/renderActions';

const _yesButtonText = 'Love it!';
const _noButtonText = 'Hate it!';
const _yesClickHandler = jest.fn();
const _noClickHandler = jest.fn();

describe('renderActions', () => {
  afterEach(() => {
    _yesClickHandler.mockClear();
    _noClickHandler.mockClear();
  });

  test('properly renders actions', () => {
    const output = renderActions(_yesButtonText, _yesClickHandler, _noButtonText, _noClickHandler);

    expect(output).toMatchSnapshot();
  });

  test('properly renders without any options', () => {
    const output = renderActions(null as any, null as any, null as any, null as any);

    expect(output).toMatchSnapshot();
  });

  test('properly attaches click handlers', () => {
    document.body.append(renderActions(_yesButtonText, _yesClickHandler, _noButtonText, _noClickHandler));

    const yesButton = document.querySelector<HTMLButtonElement>('.apptentive-love-dialog-yes')!;
    const noButton = document.querySelector<HTMLButtonElement>('.apptentive-love-dialog-no')!;

    yesButton.click();
    noButton.click();

    expect(_yesClickHandler).toHaveBeenCalledTimes(1);
    expect(_noClickHandler).toHaveBeenCalledTimes(1);

    document.body.innerHTML = '';
  });
});
