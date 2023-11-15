import isLocalStorageAvailable from '../../../src/utils/isLocalStorageAvailable';

describe('isLocalStorageAvailable', () => {
  test('properly detects the availability of localStorage', () => {
    const isAvailable = isLocalStorageAvailable();

    expect(isAvailable).toBe(true);
  });

  test('properly catches error when localStorage is not available', () => {
    const storageSpy = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw Error('No Storage');
    });

    let isAvailable;

    expect(() => {
      isAvailable = isLocalStorageAvailable();
    }).not.toThrow();
    expect(isAvailable).toBe(false);

    storageSpy.mockRestore();
  });
});
