import selectPreviousInput from '../../../../src/interactions/helpers/selectPreviousInput';

describe('selectPreviousInput', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('properly selects the sibling checkbox when event is fired', () => {
    const textField = document.createElement('input');
    textField.type = 'text';
    textField.value = 'test';
    textField.addEventListener('focus', selectPreviousInput);

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';

    const wrapper = document.createElement('div');
    wrapper.append(checkbox);
    wrapper.append(textField);

    document.body.append(wrapper);

    textField.focus();

    expect(checkbox.checked).toBe(true);
  });

  test('properly selects the sibling radio button when event is fired', () => {
    const textField = document.createElement('input');
    textField.type = 'text';
    textField.value = 'test';
    textField.addEventListener('focus', selectPreviousInput);

    const radioButton = document.createElement('input');
    radioButton.type = 'radio';

    const wrapper = document.createElement('div');
    wrapper.append(radioButton);
    wrapper.append(textField);

    document.body.append(wrapper);

    textField.focus();

    expect(radioButton.checked).toBe(true);
  });

  test('properly handles an invalid sibling when an event is fired', () => {
    const eventListenerMock = jest.fn((event) => selectPreviousInput(event));
    const textField = document.createElement('input');
    textField.type = 'text';
    textField.value = 'test';
    textField.addEventListener('focus', eventListenerMock);

    const invalidSibling = document.createElement('div');
    invalidSibling.classList.add('invalid-sibling');

    const wrapper = document.createElement('div');
    wrapper.append(invalidSibling);
    wrapper.append(textField);

    document.body.append(wrapper);

    textField.focus();

    expect(eventListenerMock).toHaveBeenCalledTimes(1);
  });

  test('properly handles a missing sibling when event is fired', () => {
    const eventListenerMock = jest.fn((event) => selectPreviousInput(event));
    const textField = document.createElement('input');
    textField.type = 'text';
    textField.value = 'test';
    textField.addEventListener('focus', eventListenerMock);

    const wrapper = document.createElement('div');
    wrapper.append(textField);

    document.body.append(wrapper);

    textField.focus();

    expect(eventListenerMock).toHaveBeenCalledTimes(1);
  });
});
