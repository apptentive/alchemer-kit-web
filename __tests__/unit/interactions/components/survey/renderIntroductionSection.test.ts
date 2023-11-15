import renderIntroductionSection from '../../../../../src/interactions/components/survey/renderIntroductionSection';

const _introText = 'Introduction';

describe('renderIntroductionSection', () => {
  test('properly renders error message container', () => {
    const output = renderIntroductionSection(_introText);

    expect(output).toMatchSnapshot();
  });
});
