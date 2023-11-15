import getLocalSdkOptions from '../../../src/utils/getLocalSdkOptions';

const _mockLogger = jest.fn();
const _mockOptions = {
  debug: true,
  readOnly: true,
};

describe('getLocalSdkOptions', () => {
  afterEach(() => {
    _mockLogger.mockClear();
    window.localStorage.clear();
  });

  test('properly reads in options from localStorage', () => {
    window.localStorage.setItem('ApptentiveSDKOptions', JSON.stringify(_mockOptions));
    const options = getLocalSdkOptions(_mockLogger);

    expect(options.debug).toBe(true);
    expect(options.readOnly).toBe(true);
    expect(_mockLogger).not.toHaveBeenCalled();
  });

  test('properly returns empty object when no options are stored', () => {
    const options = getLocalSdkOptions(_mockLogger);

    expect(options).toStrictEqual({});
    expect(_mockLogger).not.toHaveBeenCalled();
  });

  test('properly handles error when stored data is malformed', () => {
    window.localStorage.setItem('ApptentiveSDKOptions', '{[]');
    let options;

    expect(() => {
      options = getLocalSdkOptions(_mockLogger);
    }).not.toThrow();

    expect(options).toStrictEqual({});
    expect(_mockLogger).toHaveBeenCalledTimes(1);
    expect(_mockLogger.mock.calls[0][0]).toBe('error');
  });

  test('properly handles error when storage is not accessible', () => {
    const storageMock = jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw Error('No Storage');
    });

    let options;

    expect(() => {
      options = getLocalSdkOptions(_mockLogger);
    }).not.toThrow();

    expect(options).toStrictEqual({});
    expect(_mockLogger).toHaveBeenCalledTimes(1);
    expect(_mockLogger.mock.calls[0][0]).toBe('error');

    storageMock.mockRestore();
  });
});
