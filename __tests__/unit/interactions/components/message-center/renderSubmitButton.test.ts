import renderSubmitButton from '../../../../../src/interactions/components/message-center/renderSubmitButton';

const _buttonText = 'Click Me!';
const _onSubmit = jest.fn();

describe('renderSubmitButton', () => {
  test('properly renders submit button', () => {
    const output = renderSubmitButton(_buttonText, _onSubmit);

    expect(output).toMatchSnapshot();
  });

  test('properly attaches click event', () => {
    const output = renderSubmitButton(_buttonText, _onSubmit);
    const button = output.querySelector<HTMLButtonElement>('.apptentive-button--primary')!;
    button.click();

    expect(_onSubmit).toHaveBeenCalledTimes(1);
    _onSubmit.mockClear();
  });
});
