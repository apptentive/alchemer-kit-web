import renderTextArea from '../../../../../src/interactions/components/message-center/renderTextArea';

const _placeholderText = 'Hint text';

describe('renderTextArea', () => {
  test('properly renders textarea', () => {
    const output = renderTextArea(_placeholderText);

    expect(output).toMatchSnapshot();
  });

  test('properly attaches blue event', () => {
    document.body.append(renderTextArea(_placeholderText));

    const textarea = document.querySelector<HTMLTextAreaElement>('.apptentive-textinput')!;
    textarea.classList.add('apptentive-textinput--error');
    textarea.focus();
    textarea.blur();

    expect(textarea.classList.contains('apptentive-textinput--error')).toBe(false);

    document.body.innerHTML = '';
  });
});
