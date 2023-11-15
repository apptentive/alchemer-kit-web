import hex2rgb from '../../../src/utils/hex2rgb';

describe('hex2rgb', () => {
  test('properly parses long hex string', () => {
    const longString = hex2rgb('#ffffff');

    expect(longString).toBe('rgba(255,255,255,1)');
  });

  test('properly parses long hex string without # prefix', () => {
    const longString = hex2rgb('ffffff');

    expect(longString).toBe('rgba(255,255,255,1)');
  });

  test('properly parses short hex string', () => {
    const shortString = hex2rgb('#fff');

    expect(shortString).toBe('rgba(255,255,255,1)');
  });

  test('properly parses short hex string without # prefix', () => {
    const shortString = hex2rgb('fff');

    expect(shortString).toBe('rgba(255,255,255,1)');
  });

  test('properly includes opacity if included', () => {
    const withOpactity = hex2rgb('#ffffff', 0.5);

    expect(withOpactity).toBe('rgba(255,255,255,0.5)');
  });

  test('properly handles invalid hex string', () => {
    const withOpactity = hex2rgb('#ff');

    expect(withOpactity).toBe('inherit');
  });

  test('properly handles undefined opacity', () => {
    const undefineOpacity = hex2rgb('#ffffff', undefined);

    expect(undefineOpacity).toBe('rgba(255,255,255,1)');
  });

  test('properly handles null opacity', () => {
    const nullOpacity = hex2rgb('#ffffff', null as any);

    expect(nullOpacity).toBe('rgba(255,255,255,1)');
  });
});
