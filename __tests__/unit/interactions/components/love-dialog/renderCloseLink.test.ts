import renderCloseLink from '../../../../../src/interactions/components/love-dialog/renderCloseLink';

const _onClickHandler = jest.fn();

describe('renderCloseLink', () => {
  afterEach(() => {
    _onClickHandler.mockClear();
  });

  test('properly renders close link', () => {
    const output = renderCloseLink(_onClickHandler);

    expect(output).toMatchSnapshot();
  });

  test('properly attaches click handler', () => {
    document.body.append(renderCloseLink(_onClickHandler));

    const closeButton = document.querySelector<HTMLButtonElement>('.close-love-dialog')!;
    closeButton.click();

    expect(_onClickHandler).toHaveBeenCalledTimes(1);

    document.body.innerHTML = '';
  });
});
