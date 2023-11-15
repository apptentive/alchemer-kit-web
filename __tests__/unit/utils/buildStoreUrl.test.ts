import buildStoreUrl, { StoreType } from '../../../src/utils/buildStoreUrl';

const _androidUserAgent = '';
const _browserUserAgent =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36';
const _iPhoneUserAgent =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1';
const _storeId = '123456789';

describe('buildStoreUrl', () => {
  test('properly builds app store url when on an apple mobile device', () => {
    const output = buildStoreUrl(StoreType.appStore, _storeId, _iPhoneUserAgent);

    expect(output).toBe(`itms-apps://itunes.apple.com/app/id${_storeId}?action=write-review`);
  });

  test('properly builds app store url when not on an apple mobile device', () => {
    const output = buildStoreUrl(StoreType.appStore, _storeId, _browserUserAgent);

    expect(output).toBe(`https://itunes.apple.com/app/id${_storeId}?mt=8`);
  });

  test('properly builds play store url when on an android device', () => {
    const output = buildStoreUrl(StoreType.playStore, _storeId, _androidUserAgent);

    expect(output).toBe(`https://play.google.com/store/apps/details?id=${_storeId}`);
  });

  test('properly returns an empty string with an unknown method type', () => {
    const output = buildStoreUrl('unknown' as any, _storeId, _browserUserAgent);

    expect(output).toBe('');
  });
});
