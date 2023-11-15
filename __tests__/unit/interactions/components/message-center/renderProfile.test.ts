import renderProfile from '../../../../../src/interactions/components/message-center/renderProfile';

const _title = 'Profile Title';
const _namePlaceholder = 'Name placeholder';
const _nameValue = 'Suzy Creamcheese';
const _emailPlaceholder = 'Email placeholder';
const _emailValue = 'suzy.creamcheese@bakery.com';

const _defaultOptions = {
  isRequired: true,
  title: _title,
  name: {
    placeholder: _namePlaceholder,
    value: _nameValue,
  },
  email: {
    placeholder: _emailPlaceholder,
    value: _emailValue,
  },
};

describe('renderProfile', () => {
  test('properly renders profile that is required', () => {
    const output = renderProfile(_defaultOptions);

    expect(output).toMatchSnapshot();
  });

  test('properly renders profile that is optional', () => {
    const output = renderProfile({
      ..._defaultOptions,
      isRequired: false,
    });

    expect(output).toMatchSnapshot();
  });

  test('properly attaches blur event to email field', () => {
    document.body.append(renderProfile(_defaultOptions));

    const emailInput = document.querySelector<HTMLInputElement>('input[type="email"]')!;
    emailInput.classList.add('apptentive-textinput--error');
    emailInput.focus();
    emailInput.blur();

    expect(emailInput.classList.contains('apptentive-textinput--error')).toBe(false);

    document.body.innerHTML = '';
  });
});
