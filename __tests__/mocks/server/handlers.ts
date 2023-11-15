import { rest } from 'msw';
import { identifyResponse } from './responses/identify';
import { _conversationId, _conversationToken, _deviceId, _personId } from '../data/shared-constants';

const conversationResponse = {
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

export default [
  rest.get('http://apptentive.com/v1/apps/:appId/manifest', (_, res, ctx) =>
    res(ctx.status(200), ctx.json({ interactions: [], targets: {} }))
  ),
  rest.post('http://apptentive.com/conversation', (_, res, ctx) =>
    res(ctx.status(201), ctx.json(conversationResponse))
  ),
  rest.put('http://apptentive.com/conversation', (_, res, ctx) => res(ctx.status(201), ctx.json(conversationResponse))),
  rest.post('http://apptentive.com/messages', (_, res, ctx) => res(ctx.status(201))),
  rest.post('http://apptentive.com/events', (_, res, ctx) => res(ctx.status(201), ctx.json({}))),
  rest.put('http://apptentive.com/people', (_, res, ctx) => res(ctx.status(201), ctx.json({}))),
  rest.put('http://apptentive.com/people/identify', (_, res, ctx) => res(ctx.status(201), ctx.json(identifyResponse))),
  rest.put('http://apptentive.com/devices', (_, res, ctx) => res(ctx.status(201), ctx.json({}))),
  rest.post('conversations/:conversationId/surveys/:interactionId/responses', (_, res, ctx) =>
    res(ctx.status(201), ctx.json({}))
  ),
  // Static responses
  rest.get('http://apptentive.com/200', (_, res, ctx) => res(ctx.status(200), ctx.json({ test: '200' }))),
  rest.get('http://apptentive.com/200', (_, res, ctx) => res(ctx.status(200), ctx.json({ test: '200' }))),
  rest.get('http://apptentive.com/204', (_, res, ctx) => res(ctx.status(204))),
  rest.get('http://apptentive.com/500', (_, res, ctx) => res(ctx.status(500))),
  rest.get('http://apptentive.com/504', (_, res, ctx) => res(ctx.status(504), ctx.json({ test: '504' }))),
  rest.post('http://apptentive.com/error', (_, res, ctx) => res(ctx.status(504))),
  rest.post('http://apptentive.com/500', (_, res, ctx) => res(ctx.status(500))),
];
