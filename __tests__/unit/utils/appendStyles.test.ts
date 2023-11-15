import appendStyles from '../../../src/utils/appendStyles';

const _defaultOptions = {
  settings: {
    styles: {
      survey_header_color: 'ffffff',
      survey_header_icon_datauri: 'datauri',
    },
  },
};
const _logger = jest.fn();

describe('appendStyles', () => {
  beforeEach(() => {
    const baseStyles = document.querySelectorAll('#apptentive-base-styles');

    if (baseStyles.length > 0) {
      baseStyles.forEach((node) => node.remove());
    }

    const customStyles = document.querySelectorAll('#apptentive-custom-styles');

    if (customStyles.length > 0) {
      customStyles.forEach((node) => node.remove());
    }
  });

  test('properly appends a link element to the page', () => {
    appendStyles(_defaultOptions, _logger);

    expect(document.querySelectorAll<HTMLLinkElement>('#apptentive-base-styles').length).toBe(1);
    expect(document.querySelectorAll<HTMLLinkElement>('#apptentive-base-styles')[0].href).toBe(
      'http://sdk.apptentive.com/v1/styles/styles.css'
    );
  });

  test('properly appends a style element to the page', () => {
    appendStyles(_defaultOptions, _logger);

    expect(document.querySelectorAll('#apptentive-custom-styles').length).toBe(1);
  });

  test('properly skips adding a style element to the page when customStyles is true', () => {
    appendStyles({ customStyles: true }, _logger);

    expect(document.querySelectorAll('#apptentive-custom-styles').length).toBe(0);
  });

  test('properly skips adding a style element to the page when skipStyles is true', () => {
    appendStyles({ skipStyles: true }, _logger);

    expect(document.querySelectorAll('#apptentive-base-styles').length).toBe(0);
  });

  test('properly removes legacy settings when new ones are present', () => {
    appendStyles(
      {
        settings: {
          styles: {
            ..._defaultOptions.settings.styles,
            header_color: '#000000',
            header_icon_datauri: 'legacydatauri',
          },
        },
      },
      _logger
    );

    const customRules = document.querySelectorAll<HTMLStyleElement>('#apptentive-custom-styles')[0]?.sheet
      ?.cssRules as any;
    const headerColorRule = customRules.find(
      (rule: any) => rule.selectorText === 'apptentive-survey .apptentive-appbar'
    );
    const headerIconRule = customRules.find(
      (rule: any) => rule.selectorText === 'apptentive-survey .apptentive-appbar .apptentive-appbar__icon'
    );

    expect(headerColorRule.style['background-color']).toBe('rgba(255,255,255,1)');
    expect(headerIconRule.style['background-image']).toBe('url(datauri)');
  });

  test('properly changes protocol to "https:" when parent is "file:"', () => {
    const mockedLocation = {
      ...window.location,
      protocol: 'file:',
    };

    const locationMock = jest.spyOn(window, 'location', 'get').mockReturnValue(mockedLocation);

    document.querySelectorAll('#apptentive-base-styles').forEach((node) => node.remove());
    document.querySelectorAll('#apptentive-custom-styles').forEach((node) => node.remove());

    appendStyles(_defaultOptions, _logger);

    const styleElement = document.getElementById('apptentive-base-styles') as HTMLLinkElement;
    expect(styleElement.href).toBe('https://sdk.apptentive.com/v1/styles/styles.css');

    locationMock.mockRestore();
  });

  test('properly handles unknown rule', () => {
    const options = {
      settings: {
        styles: {
          ..._defaultOptions.settings.styles,
          unknown_rule: 'unknown',
        },
      },
    };

    expect(() => {
      appendStyles(options, _logger);
    }).not.toThrow();
  });

  test('properly catches error if the document is undefined', () => {
    const documentSpy = jest.spyOn(window, 'document', 'get').mockImplementation(() => undefined as any);

    expect(() => {
      appendStyles(_defaultOptions, _logger);
    }).not.toThrow();

    documentSpy.mockRestore();
  });

  test('properly catches error when stylesheet element cannot be created', () => {
    const stylesheetSpy = jest
      .spyOn(HTMLStyleElement.prototype, 'sheet', 'get')
      .mockImplementation(() => undefined as any);

    document.querySelectorAll('#apptentive-base-styles').forEach((node) => node.remove());
    document.querySelectorAll('#apptentive-custom-styles').forEach((node) => node.remove());

    expect(() => {
      appendStyles(_defaultOptions, _logger);
    }).not.toThrow();

    stylesheetSpy.mockRestore();
  });
});
