import getLogicEngineOptions from '../../../src/utils/getLogicEngineOptions';

const _mockInteractionCounts = {
  survey: {
    invokes: {
      total: 6,
      version: 6,
      build: 6,
    },
    last_invoked_at: 1668014495463,
  },
};
const _mockCodePoint = {
  'local#app#testEvent': {
    invokes: {
      total: 6,
      version: 6,
      build: 6,
    },
    last_invoked_at: 1668014495463,
  },
};
const _mockDevice = {
  vendor: 'Apple',
};
const _mockPerson = {
  age: 42,
};
const _mockRandom = {
  random: 'value',
};

const _mockLogger = jest.fn();

const createMockDb = (options = {}) => {
  const mergedOptions = {
    interactionCounts: _mockInteractionCounts,
    codePoint: _mockCodePoint,
    device: _mockDevice,
    person: _mockPerson,
    random: _mockRandom,
    ...options,
  };

  return {
    get: jest.fn((key) => {
      switch (key) {
        case 'interaction_counts':
          return mergedOptions.interactionCounts;
        case 'code_point':
          return mergedOptions.codePoint;
        case 'device':
          return mergedOptions.device;
        case 'person':
          return mergedOptions.person;
        case 'random':
          return mergedOptions.random;
        default:
          return {};
      }
    }),
  } as any;
};

describe('getLogicEngineOptions', () => {
  afterEach(() => {
    _mockLogger.mockClear();
  });

  test('properly returns options stored locally', () => {
    const options = getLogicEngineOptions(false, createMockDb(), _mockLogger);

    expect(options.interaction_counts).toStrictEqual(_mockInteractionCounts);
    expect(options.code_point).toStrictEqual(_mockCodePoint);
    expect(options.device).toStrictEqual(_mockDevice);
    expect(options.person).toStrictEqual(_mockPerson);
    expect(options.random).toStrictEqual(_mockRandom);
  });

  test('properly returns default options when ignoring local storage is true', () => {
    const options = getLogicEngineOptions(true, createMockDb(), _mockLogger);

    expect(options.interaction_counts).toStrictEqual({});
    expect(options.code_point).toStrictEqual({});
    expect(options.device).toStrictEqual({});
    expect(options.person).toStrictEqual({});
    expect(options.random).toStrictEqual({});
  });

  test('properly returns default options when no data is stored', () => {
    const options = getLogicEngineOptions(
      false,
      createMockDb({
        interactionCounts: undefined,
        codePoint: undefined,
        device: undefined,
        person: undefined,
        random: undefined,
      }),
      _mockLogger
    );

    expect(options.interaction_counts).toStrictEqual({});
    expect(options.code_point).toStrictEqual({});
    expect(options.device).not.toBeFalsy();
    expect(options.person).toStrictEqual({});
    expect(options.random).toStrictEqual({});
  });

  test('properly deserializes device and person data into JSON', () => {
    const options = getLogicEngineOptions(
      false,
      createMockDb({
        device: JSON.stringify(_mockDevice),
        person: JSON.stringify(_mockPerson),
      }),
      _mockLogger
    );

    expect(options.device).toStrictEqual(_mockDevice);
    expect(options.person).toStrictEqual(_mockPerson);
  });

  test('properly catches error when device and person data are malformed', () => {
    let options;

    expect(() => {
      options = getLogicEngineOptions(
        false,
        createMockDb({
          device: '{[]',
          person: '{[]',
        }),
        _mockLogger
      );
    }).not.toThrow();

    expect((options as any).device).toStrictEqual({});
    expect((options as any).person).toStrictEqual({});
    expect(_mockLogger).toHaveBeenCalledTimes(3);
    expect(_mockLogger.mock.calls[1][0]).toBe('error');
    expect(_mockLogger.mock.calls[2][0]).toBe('error');
  });
});
