import focusOtherInput from '../../../../src/interactions/helpers/focusOtherInput';

describe('focusOtherInput', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('properly selects the sibling textfield when event is fired (checkbox)', () => {
    const textField = document.createElement('input');
    textField.type = 'text';
    textField.value = 'test';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.addEventListener('change', focusOtherInput);

    const wrapper = document.createElement('div');
    wrapper.append(checkbox);
    wrapper.append(textField);

    document.body.append(wrapper);
    checkbox.click();

    expect(document.activeElement).toBe(textField);
  });

  test('properly selects the sibling textfield when event is fired (radio)', () => {
    const textField = document.createElement('input');
    textField.type = 'text';
    textField.value = 'test';

    const radioButton = document.createElement('input');
    radioButton.type = 'radio';
    radioButton.addEventListener('change', focusOtherInput);

    const wrapper = document.createElement('div');
    wrapper.append(radioButton);
    wrapper.append(textField);

    document.body.append(wrapper);

    radioButton.click();

    expect(document.activeElement).toBe(textField);
  });

  test('properly handles an invalid sibling when an event is fired', () => {
    const eventListenerMock = jest.fn((event) => focusOtherInput(event));
    const textField = document.createElement('input');
    textField.type = 'text';
    textField.value = 'test';

    const invalidSibling = document.createElement('div');
    invalidSibling.classList.add('invalid-sibling');
    invalidSibling.addEventListener('click', eventListenerMock);

    const wrapper = document.createElement('div');
    wrapper.append(invalidSibling);
    wrapper.append(textField);

    document.body.append(wrapper);

    invalidSibling.click();

    expect(eventListenerMock).toHaveBeenCalledTimes(1);
  });

  test('properly handles a missing sibling when event is fired', () => {
    const eventListenerMock = jest.fn((event) => focusOtherInput(event));
    const radioButton = document.createElement('input');
    radioButton.type = 'radio';
    radioButton.addEventListener('change', eventListenerMock);

    const wrapper = document.createElement('div');
    wrapper.append(radioButton);

    document.body.append(wrapper);

    radioButton.click();

    expect(eventListenerMock).toHaveBeenCalledTimes(1);
  });
});
