import browserEvent from '../../src/browser-event';

const testEvent = 'apptentive:test';

describe('browserEvents', () => {
  test('should not throw when document is undefined', () => {
    const consoleSpy = jest.spyOn(window.console, 'error').mockImplementation();
    const documentSpy = jest.spyOn(window, 'document', 'get').mockImplementation(() => undefined as any);

    expect(() => browserEvent(testEvent)).not.toThrow();
    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith('document is not defined');

    consoleSpy.mockRestore();
    documentSpy.mockRestore();
  });

  test('should not throw when console is undefined', () => {
    const consoleErrorClone = window.console.error;

    window.console.error = undefined as any;

    expect(() => browserEvent(testEvent)).not.toThrow();

    window.console.error = consoleErrorClone;
  });

  test('should not throw when document and console are undefined', () => {
    const consoleErrorClone = window.console.error;
    const documentSpy = jest.spyOn(window, 'document', 'get').mockImplementation(() => undefined as any);

    window.console.error = undefined as any;

    expect(() => browserEvent(testEvent)).not.toThrow();

    window.console.error = consoleErrorClone;
    documentSpy.mockRestore();
  });

  test('should not throw if CustomEvent throws an error', () => {
    const customEventClone = window.CustomEvent;
    const consoleErrorClone = window.console.error;
    const documentSpy = jest.spyOn(window, 'document', 'get').mockImplementation(() => undefined as any);

    window.console.error = undefined as any;
    window.CustomEvent = jest.fn().mockImplementation(() => {
      throw new Error('Error');
    });

    expect(() => browserEvent(testEvent)).not.toThrow();

    documentSpy.mockRestore();
    window.console.error = consoleErrorClone;
    window.CustomEvent = customEventClone;
  });

  test('should not throw when CustomEvent is not available', () => {
    const customEventClone = window.CustomEvent;
    const consoleSpy = jest.spyOn(window.console, 'error').mockImplementation();

    window.CustomEvent = undefined as any;

    expect(() => browserEvent(testEvent)).not.toThrow();
    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith('CustomEvent is not a function:', 'undefined');

    consoleSpy.mockRestore();
    window.CustomEvent = customEventClone;
  });

  test('should not throw when CustomEvent and console are undefined', () => {
    const customEventClone = window.CustomEvent;
    const consoleErrorClone = window.console.error;

    window.CustomEvent = undefined as any;
    window.console.error = undefined as any;

    expect(() => browserEvent(testEvent)).not.toThrow();

    window.console.error = consoleErrorClone;
    window.CustomEvent = customEventClone;
  });

  test('should not throw when there is an error creating an Event', () => {
    const consoleSpy = jest.spyOn(window.console, 'error').mockImplementation();
    const customEventSpy = jest.spyOn(window, 'CustomEvent').mockImplementation(() => undefined as any);

    expect(() => browserEvent(testEvent)).not.toThrow();
    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith(
      'ApptentiveSDK failed to fire event:',
      'apptentive:test',
      undefined,
      TypeError("Failed to execute 'dispatchEvent' on 'EventTarget': parameter 1 is not of type 'Event'.")
    );

    consoleSpy.mockRestore();
    customEventSpy.mockRestore();
  });

  test('should not throw when there is an error creating an Event and console is undefined', () => {
    const consoleClone = window.console.error;
    const customEventSpy = jest.spyOn(window, 'CustomEvent').mockImplementation(() => undefined as any);

    window.console.error = undefined as any;

    expect(() => browserEvent(testEvent)).not.toThrow();

    customEventSpy.mockRestore();
    window.console.error = consoleClone;
  });

  test('should fire an event with a valid label and a valid details object', () => {
    const documentEventSpy = jest.fn();
    document.addEventListener(testEvent, documentEventSpy);
    browserEvent(testEvent, { test: '123-abc' });

    expect(documentEventSpy).toHaveBeenCalledTimes(1);
  });

  test('should fire an event with a valid label and no details object', () => {
    const documentEventSpy = jest.fn();
    document.addEventListener(testEvent, documentEventSpy);
    browserEvent(testEvent);

    expect(documentEventSpy).toHaveBeenCalledTimes(1);
  });

  test('should not fire an event without a label', () => {
    const documentEventSpy = jest.fn();
    document.addEventListener(testEvent, documentEventSpy);

    // @ts-expect-error testing invalid parameters
    browserEvent(undefined);
    // @ts-expect-error testing invalid parameters
    browserEvent(null);
    // @ts-expect-error testing invalid parameters
    browserEvent(false);
    // @ts-expect-error testing invalid parameters
    browserEvent(0);
    // @ts-expect-error testing invalid parameters
    browserEvent();
    browserEvent('');

    expect(documentEventSpy).not.toHaveBeenCalled();
  });
});
