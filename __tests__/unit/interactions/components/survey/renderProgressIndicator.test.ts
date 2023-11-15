import renderProgressIndicator from '../../../../../src/interactions/components/survey/renderProgressIndicator';

describe('renderProgressIndicator', () => {
  test('properly renders step progress indicator', () => {
    const element = renderProgressIndicator(5);

    expect(element).toMatchSnapshot();
  });

  test('properly renders indeterminate progress indicator', () => {
    const element = renderProgressIndicator(12);

    expect(element).toMatchSnapshot();
  });

  test('properly handles a question count of 0', () => {
    const element = renderProgressIndicator(0);

    expect(element).toMatchSnapshot();
  });
});
