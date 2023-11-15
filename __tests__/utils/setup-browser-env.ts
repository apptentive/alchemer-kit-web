import 'whatwg-fetch';
import server from '../mocks/server/server';

// Establish API mocking before all tests.
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests, so they don't affect other tests.
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished.
afterAll(() => server.close());

(global as any).navigator = {
  appCodeName: 'Mozilla',
  appName: 'Netscape',
  appVersion:
    '5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.60 Safari/537.36',
  cookieEnabled: true,
  deviceMemory: 8,
  doNotTrack: '1',
  hardwareConcurrency: 16,
  language: 'en-US',
  languages: ['en-US', 'en'],
  maxTouchPoints: 0,
  onLine: true,
  platform: 'MacIntel',
  product: 'Gecko',
  productSub: '20030107',
  userAgent:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.60 Safari/537.36',
  vendor: 'Google Inc.',
  vendorSub: '',
};

global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
};

// Polyfill JSDOM: https://github.com/jsdom/jsdom/issues/1695
window.HTMLElement.prototype.scrollIntoView = () => {};
window.open = () => null;
(window.screen as any).orientation = {
  angle: 0,
  type: 'landscape-primary',
};
