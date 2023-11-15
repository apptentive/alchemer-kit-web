import renderDisclaimerText from '../../../../../src/interactions/components/survey/renderDisclaimerText';

const _shortDisclaimerText = 'Short Disclaimer';
const _longDisclaimerText =
  'Long disclaimer text that is more than 160 characters and really should not be this long but sometimes it is unavoidable so we have to handle it gracefully and decrease the font size';

describe('renderDisclaimerText', () => {
  test('properly renders short disclaimer text', () => {
    const output = renderDisclaimerText(_shortDisclaimerText);

    expect(output).toMatchSnapshot();
  });

  test('properly renders long disclaimer text', () => {
    const output = renderDisclaimerText(_longDisclaimerText);

    expect(output).toMatchSnapshot();
  });
});
