import ApptentiveI18N from '../../src/i18n';

describe('i18n', () => {
  describe('constructor', () => {
    test('properly uses default options', () => {
      const i18n = new ApptentiveI18N();
      expect(i18n.debug).toBe(false);
      expect(i18n.defaultLanguage).toBe('en');
    });

    test('properly overwrites defaults', () => {
      const i18n = new ApptentiveI18N({ debug: true, defaultLanguage: 'ja' });
      expect(i18n.debug).toBe(true);
      expect(i18n.defaultLanguage).toBe('ja');
    });

    test('properly gets and sets debug', () => {
      const i18n = new ApptentiveI18N();
      expect(i18n.debug).toBe(false);

      i18n.debug = true;
      expect(i18n.debug).toBe(true);
    });
  });

  describe('translate', () => {
    test('properly handles translations for various edge cases', () => {
      const i18n = new ApptentiveI18N({ debug: false, defaultLanguage: 'en' });
      // Invalid key param
      // @ts-expect-error test for passing invalid key parameter
      expect(i18n.translate()).toBe('');

      // @ts-expect-error test for passing invalid key parameter
      expect(i18n.translate({})).toBe('');
      expect(i18n.translate('')).toBe('');

      // Invalid language param
      expect(i18n.translate('configuration.nested.1.value')).toBe('');

      // @ts-expect-error test for passing invalid language parameter
      expect(i18n.translate('configuration.nested.1.value', {})).toBe('');
      expect(i18n.translate('configuration.nested.1.value', '')).toBe('');
      expect(i18n.translate('configuration.nested.1.value', 'ja')).toBe('');

      // Success
      i18n.add('ja', { interactions: [{ id: '123', configuration: { nested: ['fail', { value: 'pass' }] } } as any] });
      expect(i18n.translate('123.configuration.nested.1.value', 'ja')).toBe('pass');

      // Invalid Key
      expect(i18n.translate('123.configuration.nested.1.zaddy', 'ja')).toBe('');

      // Not specific enough key
      expect(i18n.translate('123.configuration.nested.1', 'ja')).toBe('');
    });

    test('properly adds a language when the params are valid', () => {
      const i18n = new ApptentiveI18N({ debug: false, defaultLanguage: 'en' });
      // Invalid language param
      // @ts-expect-error test for passing invalid language and manifest parameter
      i18n.add();
      expect(i18n.languages.size).toBe(0);

      // @ts-expect-error test for passing invalid language and manifest parameter
      i18n.add({});
      expect(i18n.languages.size).toBe(0);

      // @ts-expect-error test for passing invalid manifest parameter
      i18n.add('en');
      expect(i18n.languages.size).toBe(0);

      // Invalid manifest param
      // @ts-expect-error test for passing invalid manifest parameter
      i18n.add('ja', NaN);
      expect(i18n.languages.size).toBe(0);

      // @ts-expect-error test for passing invalid manifest parameter
      i18n.add('ja', {});
      expect(i18n.languages.size).toBe(0);

      i18n.add('ja', { interactions: {} as any });
      expect(i18n.languages.size).toBe(0);

      // Success
      i18n.add('ja', { interactions: [{ id: 'test' } as any] });
      expect(i18n.languages.size).toBe(1);

      // Update
      i18n.add('ja', { interactions: [{ id: 'test-2' } as any] });
      expect(i18n.languages.size).toBe(1);
    });

    test('properly sets the default language when it is valid', () => {
      const i18n = new ApptentiveI18N({ debug: false, defaultLanguage: 'ja' });
      expect(i18n.defaultLanguage).toBe('ja');

      // Invalid params
      // @ts-expect-error test for passing invalid language parameter
      i18n.setDefaultLanguage();
      expect(i18n.defaultLanguage).toBe('ja');

      i18n.setDefaultLanguage({} as any);
      expect(i18n.defaultLanguage).toBe('ja');

      // French not yet added
      i18n.setDefaultLanguage('fr');
      expect(i18n.defaultLanguage).toBe('ja');

      // Success
      i18n.add('fr', { interactions: [] });
      i18n.setDefaultLanguage('fr');
      expect(i18n.defaultLanguage).toBe('fr');
    });
  });
});
