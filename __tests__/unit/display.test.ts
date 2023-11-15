import ApptentiveDisplay from '../../src/display';
import ApptentiveSurveyList from '../../src/interactions/survey-list';
import ApptentiveSurveyPaged from '../../src/interactions/survey-paged';

describe('display', () => {
  test('should warn about missing interactions', () => {
    const spy = jest.fn();
    // @ts-expect-error invalid interaction
    ApptentiveDisplay(undefined, { console: spy });
    expect(spy.mock.calls[0]).toEqual(['warn', 'ApptentiveDisplay called without interaction', undefined]);
  });

  test('should not throw an error when interaction and SDK are not passed in', () => {
    // @ts-expect-error invalid parameters
    expect(() => ApptentiveDisplay(null, null)).not.toThrow();
  });

  test('should warn about unknown types of interactions', () => {
    const spy = jest.fn();
    const interaction = { type: 'no-type' };

    // @ts-expect-error minimal interaction to validate an unknown type
    expect(() => ApptentiveDisplay(interaction, { console: spy })).not.toThrow();
    expect(spy.mock.calls[0]).toEqual(['warn', `Unknown Interaction: ${interaction.type}`, interaction]);
  });

  test('should warn about unsupported types of interactions: RatingDialog', () => {
    const spy = jest.fn();
    const interaction = { type: 'RatingDialog' };

    // @ts-expect-error minimal interaction to validate unsupported interactions
    ApptentiveDisplay(interaction, { console: spy });
    expect(spy.mock.calls[0]).toEqual(['warn', 'Unsupported Interaction: RatingDialog:', interaction]);
  });

  test('should warn about unsupported types of interactions: UpgradeMessage', () => {
    const spy = jest.fn();
    const interaction = { type: 'UpgradeMessage' };

    // @ts-expect-error minimal interaction to validate unsupported interactions
    ApptentiveDisplay(interaction, { console: spy });
    expect(spy.mock.calls[0]).toEqual(['warn', 'Unsupported Interaction: UpgradeMessage:', interaction]);
  });

  test('should not throw an error for valid interaction types: Survey (paged)', () => {
    const spy = jest.fn();
    const displayMock = jest.spyOn(ApptentiveSurveyPaged, 'display');
    const interaction = { type: 'Survey', api_version: 12, configuration: { render_as: 'paged' } };

    // @ts-expect-error minimal interaction to validate error handling for valid interaction types
    ApptentiveDisplay(interaction, { console: spy });

    expect(displayMock).toBeCalledTimes(1);
    expect(spy.mock.calls[0]).toEqual([
      'error',
      'You cannot render a Survey without providing a valid Survey configuration object. You provided:',
      interaction,
    ]);

    displayMock.mockRestore();
  });

  test('should not throw an error for valid interaction types: Survey (list)', () => {
    const spy = jest.fn();
    const displayMock = jest.spyOn(ApptentiveSurveyList, 'display');
    const interaction = { type: 'Survey', api_version: 12, configuration: { render_as: 'list' } };

    // @ts-expect-error minimal interaction to validate error handling for valid interaction types
    ApptentiveDisplay(interaction, { console: spy });

    expect(displayMock).toBeCalledTimes(1);
    expect(spy.mock.calls[0]).toEqual([
      'error',
      'You cannot render a Survey without providing a valid Survey configuration object. You provided:',
      interaction,
    ]);

    displayMock.mockRestore();
  });

  test('should not throw an error for valid interaction types: TextModal', () => {
    const spy = jest.fn();
    const interaction = { type: 'TextModal' };

    // @ts-expect-error minimal interaction to validate error handling for valid interaction types
    ApptentiveDisplay(interaction, { console: spy });
    expect(spy.mock.calls[0]).toEqual([
      'error',
      'You cannot render a Note without providing a valid Note configuration object. You provided:',
      interaction,
    ]);
  });

  test('should not throw an error for valid interaction types: EnjoymentDialog (no configuration)', () => {
    const spy = jest.fn();
    const interaction = { type: 'EnjoymentDialog' };

    // @ts-expect-error minimal interaction to validate error handling for valid interaction types
    ApptentiveDisplay(interaction, { console: spy });
    expect(spy.mock.calls[0]).toEqual(['error', 'Invalid Love Dialog provided.']);
  });

  test('should not throw an error for valid interaction types: EnjoymentDialog', () => {
    const spy = jest.fn();
    const interaction = { type: 'EnjoymentDialog', configuration: {} };

    // @ts-expect-error minimal interaction to validate error handling for valid interaction types
    ApptentiveDisplay(interaction, { console: spy });
    expect(spy.mock.calls[0]).toEqual([
      'error',
      'You cannot render a Love Dialog without providing a valid Love Dialog configuration object. You provided:',
      interaction,
    ]);
  });

  test('should not throw an error for valid interaction types: MessageCenter (no configuration)', () => {
    const spy = jest.fn();
    const interaction = { type: 'MessageCenter' };

    // @ts-expect-error minimal interaction to validate error handling for valid interaction types
    ApptentiveDisplay(interaction, { console: spy });
    expect(spy.mock.calls[0]).toEqual(['error', 'Invalid Message Center provided.']);
  });

  test('should not throw an error for valid interaction types: MessageCenter', () => {
    const spy = jest.fn();
    const interaction = { type: 'MessageCenter', configuration: {} };

    // @ts-expect-error minimal interaction to validate error handling for valid interaction types
    ApptentiveDisplay(interaction, { console: spy });
    expect(spy.mock.calls[0]).toEqual([
      'error',
      'You cannot render a Message Center without providing a valid Message Center configuration object. You provided:',
      interaction,
    ]);
  });

  test('should not throw an error for valid interaction types: NavigateToLink', () => {
    const spy = jest.fn();
    const interaction = { type: 'NavigateToLink' };

    // @ts-expect-error minimal interaction to validate error handling for valid interaction types
    ApptentiveDisplay(interaction, { console: spy });
    expect(spy.mock.calls[0]).toEqual([
      'error',
      'You cannot render a NavigateToLink without providing a valid NavigateToLink configuration object. You provided:',
      interaction,
    ]);
  });

  test('should not throw an error for valid interaction types: AppStoreRating', () => {
    const spy = jest.fn();
    const interaction = { type: 'AppStoreRating' };

    // @ts-expect-error minimal interaction to validate error handling for valid interaction types
    ApptentiveDisplay(interaction, { console: spy });
    expect(spy.mock.calls[0]).toEqual([
      'error',
      'You cannot render a AppStoreRating without providing a valid AppStoreRating configuration object. You provided:',
      interaction,
    ]);
  });

  test('should not throw an error for unsupported interaction types: RatingDialog', () => {
    const consoleSpy = jest.fn();
    const interaction = { type: 'RatingDialog' };

    // @ts-expect-error minimal interaction to validate error handling for unsupported interaction
    expect(() => ApptentiveDisplay(interaction, { console: consoleSpy })).not.toThrow();
    expect(consoleSpy.mock.calls[0]).toEqual(['warn', 'Unsupported Interaction: RatingDialog:', interaction]);
  });

  test('should not throw an error for unsupported interaction types: UpgradeMessage', () => {
    const consoleSpy = jest.fn();
    const interaction = { type: 'UpgradeMessage' };

    // @ts-expect-error minimal interaction to validate error handling for unsupported interaction type
    expect(() => ApptentiveDisplay(interaction, { console: consoleSpy })).not.toThrow();
    expect(consoleSpy.mock.calls[0]).toEqual(['warn', 'Unsupported Interaction: UpgradeMessage:', interaction]);
  });
});
