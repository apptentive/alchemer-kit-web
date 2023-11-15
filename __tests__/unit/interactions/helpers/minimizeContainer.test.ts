import minimizeContainer from '../../../../src/interactions/helpers/minimizeContainer';

describe('minimizeContainer', () => {
  test('properly adds minimize class to a container', () => {
    const element = document.createElement('div');

    minimizeContainer(element);

    expect(element.classList.contains('corner--minimized')).toBe(true);
  });

  test('properly prefixes minimize class when a position is passed in', () => {
    const element = document.createElement('div');

    minimizeContainer(element, 'custom-position');

    expect(element.classList.contains('custom-position--minimized')).toBe(true);
  });

  test('properly removes minimize class when it already exists on element', () => {
    const element = document.createElement('div');
    element.classList.add('corner--minimized');

    minimizeContainer(element);

    expect(element.classList.contains('corner--minimized')).toBe(false);
  });
});
