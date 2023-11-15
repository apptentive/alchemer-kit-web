import renderGreeting from '../../../../../src/interactions/components/message-center/renderGreeting';

const _titleText = 'Title';
const _bodyText = 'Body content';

describe('renderGreeting', () => {
  test('properly renders blank', () => {
    const output = renderGreeting(_titleText, _bodyText);

    expect(output).toMatchSnapshot();
  });
});
