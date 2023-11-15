import gguid from '../../src/guid';

describe('gguid', () => {
  test('should generate a GUID', () => {
    expect(gguid().length).toBe(36);
    expect(gguid()).toMatch(/[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[\da-f]{4}-[\da-f]{12}/);
  });
});
