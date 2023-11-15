import buildDeviceMetadata from '../../../src/utils/buildDeviceMetadata';

const metadataKeys = [
  'browser_height',
  'browser_languages',
  'browser_vendor',
  'browser_width',
  'cookie_enabled',
  'custom_data',
  'locale_language_code',
  'locale_raw',
  'orientation_angle',
  'orientation_type',
  'os_name',
  'screen_height',
  'screen_width',
  'user_agent',
  'uuid',
];

const metadataKeysWithoutWindow = ['browser_height', 'browser_width', 'custom_data', 'uuid'];

describe('buildDeviceMetadata', () => {
  test('should build a device object', () => {
    const device = buildDeviceMetadata();
    expect(Object.keys(device).sort()).toEqual(metadataKeys);
  });

  test('properly overwrites and extends a device object', () => {
    const device = buildDeviceMetadata({ popcorn: true });
    expect(Object.keys(device).sort()).toEqual([...metadataKeys, 'popcorn'].sort());
  });

  test('properly handles a missing window', () => {
    const windowHeightSpy = jest.spyOn(window, 'window', 'get').mockImplementation(() => undefined as any);

    // Because this is running in JSDOM, clientHeight and clientWidth are 0 by default
    // We need to mock them here to hit the if statement
    const clientHeightSpy = jest.spyOn(document.documentElement, 'clientHeight', 'get').mockImplementation(() => 42);

    const clientWidthSpy = jest.spyOn(document.documentElement, 'clientWidth', 'get').mockImplementation(() => 42);

    const device = buildDeviceMetadata();
    expect(Object.keys(device).sort()).toEqual(metadataKeysWithoutWindow);

    clientHeightSpy.mockRestore();
    clientWidthSpy.mockRestore();
    windowHeightSpy.mockRestore();
  });

  test('properly handles a missing window and missing document', () => {
    const windowHeightSpy = jest.spyOn(window, 'window', 'get').mockImplementation(() => undefined as any);

    const documentSpy = jest.spyOn(global, 'document', 'get').mockImplementation(() => undefined as any);

    const device = buildDeviceMetadata();
    expect(Object.keys(device).sort()).toEqual(metadataKeysWithoutWindow);

    documentSpy.mockRestore();
    windowHeightSpy.mockRestore();
  });

  test('properly handles a missing window and documentElement without clientHeight', () => {
    const windowHeightSpy = jest.spyOn(window, 'window', 'get').mockImplementation(() => undefined as any);

    const clientHeightSpy = jest
      .spyOn(document.documentElement, 'clientHeight', 'get')
      .mockImplementation(() => undefined as any);

    const device = buildDeviceMetadata();
    expect(Object.keys(device).sort()).toEqual(metadataKeysWithoutWindow);

    clientHeightSpy.mockRestore();
    windowHeightSpy.mockRestore();
  });

  test('properly handles a navigator without cookieEnabled', () => {
    const cookieEnabledSpy = jest
      .spyOn(window.navigator, 'cookieEnabled', 'get')
      .mockImplementation(() => undefined as any);

    const device = buildDeviceMetadata();
    expect(Object.keys(device).sort()).toEqual(metadataKeys);
    expect(device.cookie_enabled).toBe(false);

    cookieEnabledSpy.mockRestore();
  });

  test('properly handles a navigator without language', () => {
    const languageSpy = jest.spyOn(window.navigator, 'language', 'get').mockImplementation(() => undefined as any);

    const device = buildDeviceMetadata();
    expect(Object.keys(device).sort()).toEqual([
      'browser_height',
      'browser_languages',
      'browser_vendor',
      'browser_width',
      'cookie_enabled',
      'custom_data',
      'orientation_angle',
      'orientation_type',
      'os_name',
      'screen_height',
      'screen_width',
      'user_agent',
      'uuid',
    ]);

    languageSpy.mockRestore();
  });

  test('properly handles a window without screen orientation', () => {
    const screenSpy = jest.spyOn(window, 'screen', 'get').mockImplementation(
      () =>
        ({
          height: 900,
          width: 900,
        } as any)
    );

    const device = buildDeviceMetadata();
    expect(Object.keys(device).sort()).toEqual([
      'browser_height',
      'browser_languages',
      'browser_vendor',
      'browser_width',
      'cookie_enabled',
      'custom_data',
      'locale_language_code',
      'locale_raw',
      'os_name',
      'screen_height',
      'screen_width',
      'user_agent',
      'uuid',
    ]);

    screenSpy.mockRestore();
  });
});
