import renderProgressIndicator from '../../../../../src/interactions/components/survey/renderProgressIndicator';
import updateProgressIndicator from '../../../../../src/interactions/components/survey/updateProgressIndicator';

describe('updateProgressIndicator', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('properly updates step progress indicator', () => {
    document.body.append(renderProgressIndicator(5));
    updateProgressIndicator(5, 3);

    expect(document.body).toMatchSnapshot();
  });

  test('properly updates indeterminate progress indicator', () => {
    document.body.append(renderProgressIndicator(12));
    updateProgressIndicator(12, 3);

    expect(document.body).toMatchSnapshot();
  });

  test('properly handles a missing step progress indicator', () => {
    expect(() => updateProgressIndicator(5, 3)).not.toThrow();
  });

  test('properly handles a missing indeterminate progress indicator', () => {
    expect(() => updateProgressIndicator(12, 3)).not.toThrow();
  });

  test('properly handles a missing next index parameter for a step indicator', () => {
    expect(() => updateProgressIndicator(5)).not.toThrow();
  });

  test('properly handles a missing next index parameter for an indeterminate indicator', () => {
    expect(() => updateProgressIndicator(12)).not.toThrow();
  });
});
