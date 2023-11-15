const _mockAppRelease = {
  type: 'web',
  sdk_version: '0.0.4',
};

const _mockDevice = {
  uuid: '2eb9cf41-a3ca-45ea-e563-38bf64f9e396',
  custom_data: {},
  browser_height: 944,
  browser_width: 1168,
  cookie_enabled: true,
  browser_languages: ['en-US', 'en'],
  locale_language_code: 'en',
  locale_raw: 'en-US',
  user_agent:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
  browser_vendor: 'Google Inc.',
  screen_width: 1920,
  screen_height: 1080,
  orientation_angle: 0,
  orientation_type: 'landscape-primary',
};

const _mockSdkMetadata = {
  programming_language: 'JavaScript',
  author_name: 'Apptentive, Inc.',
  platform: 'Web',
  distribution: 'CDN',
  distribution_version: '',
  version: '0.0.4',
};

const _mockPerson = {
  unique_token: '73782445861765121963474410274816',
};

export const _mockWebpage = {
  name: '',
  path: '/',
  search: '',
  title: '',
  url: 'http://apptentive.com/',
};

// eslint-disable-next-line import/prefer-default-export
export const conversationRequest = {
  app_release: _mockAppRelease,
  device: _mockDevice,
  person: _mockPerson,
  sdk: _mockSdkMetadata,
  session_id: '5638a31e-4829-5f43-abd3-3f9b75ded0ff',
};
