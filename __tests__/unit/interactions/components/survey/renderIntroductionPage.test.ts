import renderIntroductionPage from '../../../../../src/interactions/components/survey/renderIntroductionPage';

const _introText = 'Intro Text';
const _disclaimerText = 'Short Disclaimer';
const _buttonText = 'Button Text';

describe('renderIntroductionPage', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('properly renders the introduction', () => {
    const output = renderIntroductionPage(document.body, _introText, _buttonText, _disclaimerText);

    expect(output).toMatchSnapshot();
  });

  test('properly renders the introduction without intro text', () => {
    const output = renderIntroductionPage(document.body, undefined, _buttonText, _disclaimerText);

    expect(output).toMatchSnapshot();
  });

  test('properly renders the introduction without button text', () => {
    const output = renderIntroductionPage(document.body, _introText, undefined, _disclaimerText);

    expect(output).toMatchSnapshot();
  });

  test('properly renders the introduction without disclaimer text', () => {
    const output = renderIntroductionPage(document.body, _introText, _buttonText, undefined);

    expect(output).toMatchSnapshot();
  });

  test('properly unhides the element selector when the next button is clicked', () => {
    document.body.innerHTML = `
      <div class="parent-container">
        <form class="apptentive-survey-questions" style="display: none;">
          <p>Element to reveal</p>
        </form>
      </div>
    `;

    const parentContainer = document.body.querySelector<HTMLDivElement>('.parent-container')!;
    const introductionElement = renderIntroductionPage(parentContainer, _introText, _buttonText, _disclaimerText);
    parentContainer.append(introductionElement);

    const formElement = parentContainer.querySelector<HTMLElement>('.apptentive-survey-questions')!;
    const button = parentContainer.querySelector<HTMLButtonElement>('.apptentive-button--primary')!;
    button.click();

    expect(formElement.style.display).toBe('');
    expect(introductionElement.style.display).toBe('none');
  });

  test('properly uses the custom element selector when passed in', () => {
    document.body.innerHTML = `
      <div class="parent-container">
        <form class="custom-element-selector" style="display: none;">
          <p>Element to reveal</p>
        </form>
      </div>
    `;

    const parentContainer = document.body.querySelector<HTMLDivElement>('.parent-container')!;
    const introductionElement = renderIntroductionPage(
      parentContainer,
      _introText,
      _buttonText,
      _disclaimerText,
      '.custom-element-selector'
    );
    parentContainer.append(introductionElement);

    const formElement = parentContainer.querySelector<HTMLElement>('.custom-element-selector')!;
    const button = parentContainer.querySelector<HTMLButtonElement>('.apptentive-button--primary')!;
    button.click();

    expect(formElement.style.display).toBe('');
    expect(introductionElement.style.display).toBe('none');
  });

  test('properly handles invalid custom element selector', () => {
    document.body.innerHTML = `
      <div class="parent-container"></div>
    `;

    const parentContainer = document.body.querySelector<HTMLDivElement>('.parent-container')!;
    const introductionElement = renderIntroductionPage(
      parentContainer,
      _introText,
      _buttonText,
      _disclaimerText,
      '.invalid-element-selector'
    );
    parentContainer.append(introductionElement);

    const button = parentContainer.querySelector<HTMLButtonElement>('.apptentive-button--primary')!;
    button.click();

    expect(introductionElement.style.display).toBe('');
  });
});
