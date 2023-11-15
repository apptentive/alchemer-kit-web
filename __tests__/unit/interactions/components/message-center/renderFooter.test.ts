import renderFooter from '../../../../../src/interactions/components/message-center/renderFooter';

describe('renderFooter', () => {
  test('properly renders footer', () => {
    const output = renderFooter();

    expect(output).toMatchSnapshot();
  });
});
