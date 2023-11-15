import prefixEventName from '../../../src/utils/prefixEventName';

describe('prefixEventName', () => {
  test('properly prefixes event name', () => {
    expect(prefixEventName('testEvent')).toBe('local#app#testEvent');
  });

  test('properly returns internal event name without prefixing', () => {
    expect(prefixEventName('com.apptentive#testEvent')).toBe('com.apptentive#testEvent');
  });

  test('properly returns custom event name if already prefixed', () => {
    expect(prefixEventName('local#app#testEvent')).toBe('local#app#testEvent');
  });

  test('properly escapes special characters "%", "/", and "#" in event name', () => {
    expect(prefixEventName('testEventLabelSeparators')).toBe('local#app#testEventLabelSeparators');
    expect(prefixEventName('test#Event#Label#Separators')).toBe('local#app#test%23Event%23Label%23Separators');
    expect(prefixEventName('test/Event/Label/Separators')).toBe('local#app#test%2FEvent%2FLabel%2FSeparators');
    expect(prefixEventName('test%Event/Label#Separators')).toBe('local#app#test%25Event%2FLabel%23Separators');
    expect(prefixEventName('test#Event/Label%Separators')).toBe('local#app#test%23Event%2FLabel%25Separators');
    expect(prefixEventName('test###Event///Label%%%Separators')).toBe(
      'local#app#test%23%23%23Event%2F%2F%2FLabel%25%25%25Separators'
    );
    expect(prefixEventName('test#%///#%//%%/#Event_!@#$%^&*(){}Label1234567890[]`~Separators')).toBe(
      'local#app#test%23%25%2F%2F%2F%23%25%2F%2F%25%25%2F%23Event_!@%23$%25^&*(){}Label1234567890[]`~Separators'
    );
    expect(prefixEventName('test%/#')).toBe('local#app#test%25%2F%23');
  });
});
