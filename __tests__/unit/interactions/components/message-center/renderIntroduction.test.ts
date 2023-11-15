import renderIntroduction from '../../../../../src/interactions/components/message-center/renderIntroduction';

const _introText = 'Introduction';

describe('renderIntroduction', () => {
  test('properly renders introduction', () => {
    const output = renderIntroduction(_introText);

    expect(output).toMatchSnapshot();
  });

  test('properly renders introduction with no text', () => {
    const output = renderIntroduction();

    expect(output).toMatchSnapshot();
  });
});
