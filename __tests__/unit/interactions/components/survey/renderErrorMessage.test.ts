import renderErrorMessage from '../../../../../src/interactions/components/survey/renderErrorMessage';
import scrollToError from '../../../../../src/interactions/helpers/scrollToError';

jest.mock('../../../../../src/interactions/helpers/scrollToError.ts');

describe('renderErrorMessage', () => {
  test('properly renders error message container', () => {
    const output = renderErrorMessage();

    expect(output).toMatchSnapshot();
  });

  test('properly attaches scroll event to container', () => {
    const output = renderErrorMessage();
    document.body.append(output);

    output.click();

    expect(scrollToError).toHaveBeenCalledTimes(1);

    document.body.innerHTML = '';
  });
});
