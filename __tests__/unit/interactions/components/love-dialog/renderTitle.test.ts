import renderTitle from '../../../../../src/interactions/components/love-dialog/renderTitle';

const _titleText = 'Title';

describe('renderTitle', () => {
  test('properly renders title', () => {
    const output = renderTitle(_titleText);

    expect(output).toMatchSnapshot();
  });

  test('properly renders title when no text is passed in', () => {
    // @ts-expect-error test for passing invalid parameters
    const output = renderTitle();

    expect(output).toMatchSnapshot();
  });
});
