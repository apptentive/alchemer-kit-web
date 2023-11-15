import ApptentiveBase from '../../src/base';
import ApptentiveBaseBuilder from '../mocks/builders/ApptentiveBaseBuilder';
import { _host, _apiToken, _conversationToken, _conversationId } from '../mocks/data/shared-constants';

describe('sdk utilities', () => {
  test('#console: should output a debug message to the console when debug is true', () => {
    const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();
    const consoleSpy = jest.spyOn(console, 'info').mockClear().mockImplementation();

    sdk.debug = true;
    sdk.console('info', 'Hello!');

    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(consoleSpy.mock.calls[0][0]).toBe('%c[Base]');
    expect(consoleSpy.mock.calls[0][2]).toBe('Hello!');

    consoleSpy.mockRestore();
  });

  test('#console: should concat an unknown first type into the output arguments', () => {
    const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();
    const consoleSpy = jest.spyOn(console, 'info').mockClear().mockImplementation();

    sdk.debug = true;
    sdk.console('Bye', 'Felicia!');

    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(consoleSpy.mock.calls[0][0]).toBe('%c[Base]');
    expect(consoleSpy.mock.calls[0][2]).toBe('Bye');
    expect(consoleSpy.mock.calls[0][3]).toBe('Felicia!');

    consoleSpy.mockRestore();
  });

  test('#console: should not output a debug message when debug is false', () => {
    const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();
    const consoleSpy = jest.spyOn(console, 'info').mockClear().mockImplementation();

    sdk.options.debug = false;
    sdk.console('info', "You're fired.");

    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  test('#setPageName: should default to an empty string', () => {
    const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();
    expect(sdk.api.pageName).toBe('');
  });

  test('#setPageName: should set a new page name', () => {
    const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build().withConversation();
    const pageName = 'Survey Page 5';
    sdk.setPageName(pageName);
    expect(sdk.api.pageName).toBe(pageName);
  });

  test('#version: should return the version', () => {
    expect(ApptentiveBase.version()).not.toBe('');
  });
});
