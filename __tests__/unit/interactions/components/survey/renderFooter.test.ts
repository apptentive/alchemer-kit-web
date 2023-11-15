import renderFooter from '../../../../../src/interactions/components/survey/renderFooter';

const _contactUrl = 'https://test.com';
const _contactUrlText = 'Contact Us';
const _termsAndConditionsUrl = 'https://tandc.com';
const _termsAndConditionsText = 'Terms & Conditions';

describe('renderFooter', () => {
  test('properly renders footer', () => {
    const output = renderFooter({
      contactUrl: _contactUrl,
      contactUrlText: _contactUrlText,
      termsAndConditionsUrl: _termsAndConditionsUrl,
      termsAndConditionsText: _termsAndConditionsText,
    });

    expect(output).toMatchSnapshot();
  });

  test('properly renders footer without terms and conditions config', () => {
    const output = renderFooter({
      contactUrl: _contactUrl,
      contactUrlText: _contactUrlText,
    });

    expect(output).toMatchSnapshot();
  });

  test('properly renders footer with partial terms and conditions config', () => {
    const output = renderFooter({
      contactUrl: _contactUrl,
      contactUrlText: _contactUrlText,
      termsAndConditionsUrl: _termsAndConditionsUrl,
    });

    expect(output).toMatchSnapshot();
  });

  test('properly renders footer without contact config', () => {
    const output = renderFooter({
      termsAndConditionsUrl: _termsAndConditionsUrl,
      termsAndConditionsText: _termsAndConditionsText,
    });

    expect(output).toMatchSnapshot();
  });

  test('properly renders footer with partial contact config', () => {
    const output = renderFooter({
      contactUrl: _contactUrl,
      termsAndConditionsUrl: _termsAndConditionsUrl,
      termsAndConditionsText: _termsAndConditionsText,
    });

    expect(output).toMatchSnapshot();
  });
});
