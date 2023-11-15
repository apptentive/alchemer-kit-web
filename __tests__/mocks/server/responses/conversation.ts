import { _conversationId, _conversationToken, _deviceId, _personId } from '../../data/shared-constants';

// eslint-disable-next-line import/prefer-default-export
export default {
  state: 'new',
  id: _conversationId,
  device_id: _deviceId,
  person_id: _personId,
  sdk: {
    version: '0.0.4',
    programming_language: 'JavaScript',
    author_name: 'Apptentive, Inc.',
    author_email: null,
    platform: 'Web',
    distribution: 'CDN',
    distribution_version: null,
  },
  app_release: { type: 'App::WebAppRelease', version: null, build_number: null },
  token: _conversationToken,
};
