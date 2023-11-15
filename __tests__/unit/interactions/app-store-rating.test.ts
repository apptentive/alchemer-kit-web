import ApptentiveAppStoreRating from '../../../src/interactions/app-store-rating';
import browserEvents from '../../../src/constants/browser-events';
import * as buildStoreUrl from '../../../src/utils/buildStoreUrl';

import { _appId, _apiToken, _domNode, _domNodeId, _host, _interactionOptions } from '../../mocks/data/shared-constants';
import AppStoreRatingGenerator from '../../mocks/generators/AppStoreRatingGenerator';
import ApptentiveBaseBuilder from '../../mocks/builders/ApptentiveBaseBuilder';

const scaffoldDom = () => {
  const div = document.createElement('div');
  div.id = _domNodeId;
  div.innerHTML = '';
  document.body.append(div);
};

describe('AppStoreRating', () => {
  beforeEach(() => {
    scaffoldDom();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('render', () => {
    test('properly fires browser events in the case of an error', () => {
      const documentEventSpy = jest.fn();
      document.addEventListener(browserEvents.APPTENTIVE_APP_STORE_RATING_ERROR, documentEventSpy);

      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build();
      const { config } = new AppStoreRatingGenerator().withEmptyConfiguration();
      const appStoreRating = new ApptentiveAppStoreRating(config, sdk, _interactionOptions);

      expect(documentEventSpy).toHaveBeenCalledTimes(1);
      appStoreRating.render();
      expect(documentEventSpy).toHaveBeenCalledTimes(2);

      document.removeEventListener(browserEvents.APPTENTIVE_APP_STORE_RATING_ERROR, documentEventSpy);
    });

    test('properly does not throw an error if configuration values are missing', () => {
      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build();
      const { config } = new AppStoreRatingGenerator().withEmptyConfiguration();
      const appStoreRating = new ApptentiveAppStoreRating(config, sdk, _interactionOptions);

      expect(() => {
        appStoreRating.render();
      }).not.toThrow();
    });

    test('properly fires browser events in the case of a success & opens a new browser window with the url from the payload with method set', () => {
      const documentEventSpy = jest.fn();
      document.addEventListener(browserEvents.APPTENTIVE_APP_STORE_RATING_OPEN_APP_STORE_URL, documentEventSpy);
      document.addEventListener(browserEvents.APPTENTIVE_APP_STORE_RATING_BLOCKED, documentEventSpy);

      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build();
      const { config } = new AppStoreRatingGenerator({ method: 'app_store' });
      const appStoreRating = new ApptentiveAppStoreRating(config, sdk, _interactionOptions);
      appStoreRating.render();

      expect(documentEventSpy).toHaveBeenCalledTimes(1);

      document.removeEventListener(browserEvents.APPTENTIVE_APP_STORE_RATING_OPEN_APP_STORE_URL, documentEventSpy);
      document.removeEventListener(browserEvents.APPTENTIVE_APP_STORE_RATING_BLOCKED, documentEventSpy);
    });

    test('properly fires browser events in the case of a success & opens a new browser window with the url from the payload without method set', () => {
      const documentEventSpy = jest.fn();
      document.addEventListener(browserEvents.APPTENTIVE_APP_STORE_RATING_OPEN_APP_STORE_URL, documentEventSpy);
      document.addEventListener(browserEvents.APPTENTIVE_APP_STORE_RATING_BLOCKED, documentEventSpy);

      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build();
      const { config } = new AppStoreRatingGenerator().withoutMethod();
      const appStoreRating = new ApptentiveAppStoreRating(config, sdk, _interactionOptions);
      appStoreRating.render();

      expect(documentEventSpy).toHaveBeenCalledTimes(1);

      document.removeEventListener(browserEvents.APPTENTIVE_APP_STORE_RATING_OPEN_APP_STORE_URL, documentEventSpy);
      document.removeEventListener(browserEvents.APPTENTIVE_APP_STORE_RATING_BLOCKED, documentEventSpy);
    });

    test('properly warns of a blocked window / popup blocker when no window is recreated', () => {
      const documentEventSpy = jest.fn();
      document.addEventListener(browserEvents.APPTENTIVE_APP_STORE_RATING_BLOCKED, documentEventSpy);

      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build();
      const { config } = new AppStoreRatingGenerator({
        method: 'app_store',
      });
      const appStoreRating = new ApptentiveAppStoreRating(config, sdk, _interactionOptions);

      appStoreRating.render((() => {}) as any);

      expect(documentEventSpy).toHaveBeenCalledTimes(1);

      document.removeEventListener(browserEvents.APPTENTIVE_APP_STORE_RATING_BLOCKED, documentEventSpy);
    });

    test('properly fires an event to on success', () => {
      const documentEventSpy = jest.fn();
      document.addEventListener(browserEvents.APPTENTIVE_APP_STORE_RATING_OPEN_APP_STORE_URL, documentEventSpy);

      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build();
      const { config } = new AppStoreRatingGenerator({
        method: 'app_store',
      });
      const appStoreRating = new ApptentiveAppStoreRating(config, sdk, _interactionOptions);

      appStoreRating.render((() => ({ focus: () => {} })) as any);

      expect(documentEventSpy).toHaveBeenCalledTimes(1);

      document.removeEventListener(browserEvents.APPTENTIVE_APP_STORE_RATING_OPEN_APP_STORE_URL, documentEventSpy);
    });

    test('properly attempts to open a window', () => {
      const open = jest.fn();
      (open as any).focus = () => {};

      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build();
      const { config } = new AppStoreRatingGenerator({
        method: 'app_store',
        storeId: 'content_id_1234',
      });
      const appStoreRating = new ApptentiveAppStoreRating(config, sdk, _interactionOptions);

      appStoreRating.render(open);
      expect(open.mock.calls[0]).toEqual(['https://itunes.apple.com/app/idcontent_id_1234?mt=8', '_blank']);

      (window as any).MSStream = true;
      appStoreRating.render(open, 'iPhone');
      expect(open.mock.calls[1]).toEqual(['https://itunes.apple.com/app/idcontent_id_1234?mt=8', '_blank']);

      delete (window as any).MSStream;
      appStoreRating.render(open, 'iPhone');
      expect(open.mock.calls[2]).toEqual([
        'itms-apps://itunes.apple.com/app/idcontent_id_1234?action=write-review',
        '_blank',
      ]);
    });
  });

  describe('display', () => {
    test('properly fires browser events in the case of an error', () => {
      const documentEventSpy = jest.fn();
      document.addEventListener(browserEvents.APPTENTIVE_APP_STORE_RATING_ERROR, documentEventSpy);

      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build();
      const { config } = new AppStoreRatingGenerator().withEmptyConfiguration();

      ApptentiveAppStoreRating.display(config, sdk, _interactionOptions);
      expect(documentEventSpy).toHaveBeenCalledTimes(2); // 1st is creation, 2nd is render

      document.removeEventListener(browserEvents.APPTENTIVE_APP_STORE_RATING_ERROR, documentEventSpy);
    });

    test('properly fires browser events in the case of a success & opens a new browser window with the url from the payload', () => {
      const documentEventSpy = jest.fn();
      document.addEventListener(browserEvents.APPTENTIVE_APP_STORE_RATING_OPEN_APP_STORE_URL, documentEventSpy);

      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build();
      const { config } = new AppStoreRatingGenerator();

      ApptentiveAppStoreRating.display(config, sdk, _interactionOptions);
      expect(documentEventSpy).toHaveBeenCalledTimes(0); // Would be 1 if window.open was avaliable to JSDOM

      document.removeEventListener(browserEvents.APPTENTIVE_APP_STORE_RATING_OPEN_APP_STORE_URL, documentEventSpy);
    });

    test('properly handles error if url cannot be generated correctly', () => {
      const buildStoreUrlSpy = jest.spyOn(buildStoreUrl, 'default').mockImplementation(() => null as any);

      const documentEventSpy = jest.fn();
      document.addEventListener(browserEvents.APPTENTIVE_APP_STORE_RATING_ERROR, documentEventSpy);

      const { sdk } = new ApptentiveBaseBuilder().useCachedManifest().build();
      const { config } = new AppStoreRatingGenerator({
        method: 'app_store',
      });

      ApptentiveAppStoreRating.display(config, sdk, _interactionOptions);
      expect(documentEventSpy).toHaveBeenCalledTimes(1);

      document.removeEventListener(browserEvents.APPTENTIVE_APP_STORE_RATING_ERROR, documentEventSpy);
      buildStoreUrlSpy.mockRestore();
    });

    test('properly does not throw when no parameters are passed', () => {
      // @ts-expect-error test to validate passing invalid parameters
      expect(() => ApptentiveAppStoreRating.display()).not.toThrow();
    });
  });
});
