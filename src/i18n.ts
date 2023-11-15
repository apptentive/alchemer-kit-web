import { IManifest } from './interfaces/data/IManifest';
import { IInteraction } from './interfaces/manifest/IInteraction';

interface I18NOptions {
  defaultLanguage: string;
  debug: boolean;
}

/**
 * Translation Utility
 *
 * @property {string} defaultLanguage The default language to use.
 * @property {boolean} debug Enables logging.
 */
class ApptentiveI18N {
  private _defaultLanguage: string;
  private _isDebug: boolean;
  private _languages: Map<string, { string: IInteraction }>;

  /**
   * Initialize the Translator by providing options.
   *
   * @param {object} [options={}] Options for priming the new ApptentiveI18N instance.
   * @param {string} [options.defaultLanguage='en'] The default language rather than detect from the browser.
   * @param {boolean} [options.debug=false] Optional flag to enable logging.
   */
  constructor(options = {} as I18NOptions) {
    this._defaultLanguage = options.defaultLanguage || 'en';
    this._isDebug = options.debug || false;
    this._languages = new Map<string, { string: IInteraction }>();

    this.translate = this.translate.bind(this);
    this.add = this.add.bind(this);
    this.setDefaultLanguage = this.setDefaultLanguage.bind(this);
  }

  get debug() {
    return this._isDebug;
  }

  set debug(value: boolean) {
    this._isDebug = value;
  }

  get defaultLanguage() {
    return this._defaultLanguage;
  }

  get languages() {
    return this._languages;
  }

  /**
   * Return a translation for a provided key in the provided language.
   * If a value is not found, a a default of English `en` value will be used.
   *
   * @param {string} key The key from the language file to translate
   * @param {string} [language=this.defaultLanguage] The target language
   * @returns {string} The translated string for the given key in the given language
   */
  translate(key: string, language: string = this._defaultLanguage) {
    if (typeof key !== 'string' || !key) {
      this.console('error', `Missing or invalid key "${key}".`);
      return '';
    }

    let determinedLanguage = language;

    if (typeof language !== 'string' || !this._languages.has(language)) {
      this.console('warn', `Missing or invalid language "${language}", defaulting to "${this._defaultLanguage}".`);
      determinedLanguage = this._defaultLanguage;
    }

    const json = this._languages.get(determinedLanguage);
    const text = key.split('.').reduce((agg: any, i: string) => (agg ? agg[i] : null), json);

    if (!text) {
      this.console('error', `Translation not found or invalid key "${key}".`);
      return '';
    }

    if (typeof text === 'object') {
      this.console('warn', 'Key not specific enough, JSON returned unexpectedly.');
      return '';
    }

    return text;
  }

  /**
   * Add or update a translation for a given language.
   *
   * @param {string} language The target language to add.
   * @param {object} manifest The manifest as an object.
   */
  add(language: string, manifest: Pick<IManifest, 'interactions'>) {
    this.console(`Adding '${language}' language:`);

    if (typeof language !== 'string' || !language) {
      this.console('error', `Missing or invalid language "${language}".`);
      return;
    }

    if (typeof manifest !== 'object' || Object.keys(manifest).length === 0 || !Array.isArray(manifest.interactions)) {
      this.console('error', `Manifest invalid for "${language}".`);
      return;
    }

    // Convert manifest to expected shape
    const input = this._languages.get(language) || ({} as { string: IInteraction });
    const output = manifest.interactions.reduce(
      (agg, item) =>
        // Key based off of the interaction ID
        ({
          ...agg,
          [item.id]: item,
        }),
      input
    );

    this.console(`${language} Language:`, output);
    this._languages.set(language, output);
  }

  /**
   * Sets the default language of the translator instance.
   *
   * @param {string} language The default language key to use.
   */
  setDefaultLanguage(language: string) {
    if (typeof language !== 'string' || !this._languages.has(language)) {
      this.console('error', `Missing or invalid language "${language}".`);
      return;
    }

    this._defaultLanguage = language;
  }

  /**
   * The internal console helper.
   *
   * @param {string} method - Either a valid console log method or the first param to be logged.
   * @param {...any} arguments_ - Other arguments to be logged.
   * @private
   */
  console(method: string, ...arguments_: any[]) {
    let consoleMethod = method;

    if (!['error', 'info', 'log', 'warn'].includes(method)) {
      arguments_.unshift(method);
      consoleMethod = 'info';
    }

    if (this._isDebug && typeof window !== 'undefined' && window.console) {
      // eslint-disable-next-line no-console
      (window.console as any)[consoleMethod]('%c[I18N]', 'color: #907093;', ...arguments_);
    }
  }
}

export default ApptentiveI18N;
