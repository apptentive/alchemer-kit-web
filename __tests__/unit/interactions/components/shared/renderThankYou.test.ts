import renderThankYou from '../../../../../src/interactions/components/shared/renderThankYou';
import { surveySelectors } from '../../../../../src/constants/elementSelectors';

const _contentText = 'Thank you for your feedback!';
const _buttonText = 'Close Survey';
const _onDismiss = jest.fn();

describe('renderThankYou', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    _onDismiss.mockClear();
  });

  test('properly renders tall thank you screen', () => {
    const output = renderThankYou(_onDismiss, surveySelectors.thankYou, _contentText, _buttonText, true);

    expect(output).toMatchSnapshot();
  });

  test('properly renders short thank you screen', () => {
    const output = renderThankYou(_onDismiss, surveySelectors.thankYou, _contentText, _buttonText, false);

    expect(output).toMatchSnapshot();
  });

  test('properly renders thank you with defaults', () => {
    const output = renderThankYou(_onDismiss, surveySelectors.thankYou);

    expect(output).toMatchSnapshot();
  });

  test('properly attaches dismiss function', () => {
    document.body.append(renderThankYou(_onDismiss, surveySelectors.thankYou, _contentText, _buttonText, false));

    const dismissButton = document.querySelector<HTMLButtonElement>('.apptentive-button--primary')!;
    dismissButton.click();

    expect(_onDismiss).toHaveBeenCalledTimes(1);
  });
});
