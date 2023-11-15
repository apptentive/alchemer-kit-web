import browserEvents from '../../../src/constants/browser-events';
import ApptentiveNavigateToLink from '../../../src/interactions/navigate-to-link';
import ApptentiveBaseBuilder from '../../mocks/builders/ApptentiveBaseBuilder';

import NavigateToLinkGenerator from '../../mocks/generators/NavigateToLinkGenerator';
import { _appId, _apiToken, _domNode, _domNodeId, _host, _interactionOptions } from '../../mocks/data/shared-constants';

describe('NavigateToLink', () => {
  beforeEach(() => {
    const div = document.createElement('div');
    div.id = _domNodeId;
    document.body.append(div);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('render', () => {
    test('properly fires browser events in the case of an error', () => {
      const documentEventSpy = jest.fn();
      document.addEventListener(browserEvents.APPTENTIVE_NAVIGATE_TO_LINK_ERROR, documentEventSpy);

      const { config } = new NavigateToLinkGenerator().withEmptyConfiguration();
      const { sdk } = new ApptentiveBaseBuilder().build();
      const navigateToLink = new ApptentiveNavigateToLink(config, sdk, _interactionOptions);

      expect(documentEventSpy).toHaveBeenCalledTimes(1);

      navigateToLink.render();

      expect(documentEventSpy).toHaveBeenCalledTimes(2);
    });

    test('properly fires browser events in the case of a success & navigates to the url from the payload', () => {
      const mockWindowLocation = { ...window.location };
      Object.defineProperties(mockWindowLocation, {
        href: {
          set: jest.fn(),
        },
      });
      const locationSpy = jest.spyOn(window, 'location', 'get').mockReturnValue(mockWindowLocation);
      const documentEventSpy = jest.fn();
      document.addEventListener(browserEvents.APPTENTIVE_NAVIGATE_TO_LINK_NAVIGATE, documentEventSpy);

      const { config } = new NavigateToLinkGenerator({
        url: 'myapp://show_content/content_id_1234',
        target: 'self',
      });

      const { sdk } = new ApptentiveBaseBuilder().build();
      const navigateToLink = new ApptentiveNavigateToLink(config, sdk, _interactionOptions);
      navigateToLink.render();

      expect(documentEventSpy).toHaveBeenCalledTimes(1);

      document.removeEventListener(browserEvents.APPTENTIVE_NAVIGATE_TO_LINK_NAVIGATE, documentEventSpy);
      locationSpy.mockRestore();
    });

    test('properly fires browser events in the case of a success & opens a new browser window with the url from the payload', () => {
      const documentEventSpy = jest.fn();
      document.addEventListener(browserEvents.APPTENTIVE_NAVIGATE_TO_LINK_NAVIGATE, documentEventSpy);

      const { config } = new NavigateToLinkGenerator({
        url: 'myapp://show_content/content_id_2345',
        target: 'new',
      });

      const { sdk } = new ApptentiveBaseBuilder().build();
      const navigateToLink = new ApptentiveNavigateToLink(config, sdk, _interactionOptions);
      navigateToLink.render();

      expect(documentEventSpy).toHaveBeenCalledTimes(1);
    });

    test('properly warns of a blocked window / popup blocker when no window is recreated', () => {
      const documentEventSpy = jest.fn();
      document.addEventListener(browserEvents.APPTENTIVE_NAVIGATE_TO_LINK_NAVIGATE, documentEventSpy);

      const { config } = new NavigateToLinkGenerator({
        url: 'myapp://show_content/content_id_3456',
        target: 'new',
      });

      const { sdk } = new ApptentiveBaseBuilder().build();
      const navigateToLink = new ApptentiveNavigateToLink(config, sdk, _interactionOptions);
      navigateToLink.render((() => {}) as any);

      expect(documentEventSpy).toHaveBeenCalledTimes(1);

      navigateToLink.render(() => ({ focus: () => {} } as any));

      expect(documentEventSpy).toHaveBeenCalledTimes(2);
    });

    test('properly catches error when target is self and window.location does not exist', () => {
      const { config } = new NavigateToLinkGenerator({
        url: 'myapp://show_content/content_id_3456',
        target: 'self',
      });

      const { sdk } = new ApptentiveBaseBuilder().build();
      const navigateToLink = new ApptentiveNavigateToLink(config, sdk, _interactionOptions);
      const locationMock = jest.spyOn(window, 'location', 'get').mockImplementation(() => undefined as any);

      expect(() => {
        navigateToLink.render((() => {}) as any);
      }).not.toThrow();

      locationMock.mockRestore();
    });
  });

  describe('display', () => {
    test('properly fires browser events in the case of an error', () => {
      const documentEventSpy = jest.fn();
      document.addEventListener('apptentive:navigate-to-link:error', documentEventSpy);

      const { config } = new NavigateToLinkGenerator({
        url: 'myapp://show_content/content_id_4567',
      }).withEmptyConfiguration();

      const { sdk } = new ApptentiveBaseBuilder().build();
      ApptentiveNavigateToLink.display(config, sdk, _interactionOptions);

      expect(documentEventSpy).toHaveBeenCalledTimes(2);
    });

    test('properly fires browser events in the case of a success & opens a new browser window with the url from the payload', () => {
      const documentEventSpy = jest.fn();
      document.addEventListener(browserEvents.APPTENTIVE_NAVIGATE_TO_LINK_NAVIGATE, documentEventSpy);

      const { config } = new NavigateToLinkGenerator({
        url: 'myapp://show_content/content_id_4567',
      }).withoutTarget();

      const { sdk } = new ApptentiveBaseBuilder().build();

      ApptentiveNavigateToLink.display(config, sdk, _interactionOptions);

      expect(documentEventSpy).toHaveBeenCalledTimes(1);
    });

    test('properly catches error if no parameters are passed', () => {
      // @ts-expect-error test for passing invalid parameters
      expect(() => ApptentiveNavigateToLink.display()).not.toThrow();
    });
  });
});
