import { rest } from 'msw';
import { _host, _apiToken, _appId, _conversationToken, _conversationId } from '../mocks/data/shared-constants';
import server from '../mocks/server/server';

import ApptentiveApi from '../../src/api.ts';
import { conversationRequest, _mockWebpage } from '../mocks/server/requests/conversation';
import { eventRequest } from '../mocks/server/requests/event';
import { responsesRequest } from '../mocks/server/requests/responses';

const _mockInteractionId = '425181392666624';
const _validateRequestParameters = (args, method, authType) => {
  expect(args.credentials).toBe('same-origin');
  expect(args.headers.get('accept')).toBe('application/json');

  if (authType === 'app' || authType === 'conversationToken') {
    expect(args.headers.get('authorization')).toBe(`OAuth ${authType === 'app' ? _apiToken : _conversationToken}`);
  }

  expect(args.method).toBe(method);
  expect(args.mode).toBe('cors');
};

const _scaffoldApi = (
  options = { conversationToken: '', conversationId: '', debug: false, logger: undefined, readonly: false }
) =>
  new ApptentiveApi(_appId, _apiToken, {
    prefixUrl: _host,
    conversationId: options.conversationId,
    conversationToken: options.conversationToken,
    debug: options.debug,
    logger: options.logger,
    readonly: options.readonly,
  });

describe('ApptentiveApi', () => {
  afterEach(() => {
    window.localStorage.clear();
  });

  describe('constructor', () => {
    test('properly throws error when appId is not passed in', () => {
      expect(() => new ApptentiveApi(null, _apiToken)).toThrow();
    });

    test('properly throws error when apiToken is not passed in', () => {
      expect(() => new ApptentiveApi(_appId, null)).toThrow();
    });

    test('properly sets defaults when options are not passed in', () => {
      const api = new ApptentiveApi(_appId, _apiToken);

      expect(api._apiVersion).toBe(12);
      expect(api._conversationId).toBe('');
      expect(api._conversationToken).toBe('');
      expect(api._host).toBe('https://api.apptentive.com');
      expect(api._isDebug).toBe(false);
      expect(api._isReadonly).toBe(false);
    });

    test('properly sets pageName when passed as an option', () => {
      const api = new ApptentiveApi(_appId, _apiToken, { pageName: 'test_page' });

      expect(api.pageName).toBe('test_page');
    });

    test('properly sets timeout when passed as an option', () => {
      const api = new ApptentiveApi(_appId, _apiToken, { timeout: 4242 });

      expect(api._defaultRequestOptions.timeout).toBe(4242);
    });
  });

  describe('logger', () => {
    test('properly logs messages when debug is true', () => {
      const consoleSpy = jest.spyOn(window.console, 'info');
      _scaffoldApi({ debug: true });

      const firstLog = consoleSpy.mock.calls[0][2];
      const secondLog = consoleSpy.mock.calls[1][2];

      expect(firstLog).toBe('API has been successfully initialized with options:');
      expect(secondLog).toBe('{ apiVersion: 12, apiToken: FAKE_API_TOKEN, host: http://apptentive.com }');

      consoleSpy.mockRestore();
    });

    test('properly logs messages when invalid method is passed', () => {
      const consoleSpy = jest.spyOn(window.console, 'info');
      const api = _scaffoldApi();

      api._isDebug = true;
      api._logger('invalid', 'invalid method message');

      expect(consoleSpy.mock.calls[0][2]).toBe('invalid');

      consoleSpy.mockRestore();
    });

    test('properly uses custom logger when passed into constructor', () => {
      const mockLogger = jest.fn();

      _scaffoldApi({ debug: true, logger: mockLogger });

      const firstLog = mockLogger.mock.calls[0];
      const secondLog = mockLogger.mock.calls[1];

      expect(firstLog[0]).toBe('info');
      expect(firstLog[1]).toBe('API has been successfully initialized with options:');
      expect(secondLog[0]).toBe('info');
      expect(secondLog[1]).toBe('{ apiVersion: 12, apiToken: FAKE_API_TOKEN, host: http://apptentive.com }');
      expect(mockLogger).toHaveBeenCalledTimes(2);
    });
  });

  describe('getWebpageData', () => {
    test('properly creates webpage data', () => {
      const api = _scaffoldApi();
      const webpageData = api._getWebpageData();

      expect(webpageData).toStrictEqual({
        name: '',
        path: '/',
        search: '',
        title: '',
        url: 'http://apptentive.com/',
      });
    });

    test('properly uses stored page name', () => {
      const api = _scaffoldApi();
      api.pageName = 'Example';

      const webpageData = api._getWebpageData();

      expect(webpageData).toStrictEqual({
        name: 'Example',
        path: '/',
        search: '',
        title: '',
        url: 'http://apptentive.com/',
      });
    });

    test('properly builds webpage data in environments without window.location', () => {
      const locationSpy = jest.spyOn(window, 'location', 'get').mockImplementation(() => undefined);

      const api = _scaffoldApi();
      const webpageData = api._getWebpageData();

      expect(webpageData).toStrictEqual({
        name: '',
        path: '',
        search: '',
        title: '',
        url: '',
      });

      locationSpy.mockRestore();
    });

    test('properly builds webpage data in environments without document.title', () => {
      const locationSpy = jest.spyOn(document, 'title', 'get').mockImplementation(() => undefined);

      const api = _scaffoldApi();
      const webpageData = api._getWebpageData();

      expect(webpageData).toStrictEqual({
        name: '',
        path: '/',
        search: '',
        title: '',
        url: 'http://apptentive.com/',
      });

      locationSpy.mockRestore();
    });

    test('properly builds webpage data in environments without document', () => {
      const documentClone = window.document;
      delete window.document;

      const api = _scaffoldApi();
      const webpageData = api._getWebpageData();

      expect(webpageData).toStrictEqual({
        name: '',
        path: '/',
        search: '',
        title: '',
        url: 'http://apptentive.com/',
      });

      window.document = documentClone;
    });
  });

  describe('getters and setters', () => {
    test('properly gets and sets debug', () => {
      const api = _scaffoldApi();

      expect(api.debug).toBe(false);

      api.debug = true;

      expect(api.debug).toBe(true);
    });

    test('properly gets and sets pageName', () => {
      const api = _scaffoldApi();

      expect(api.pageName).toBe('');

      api.pageName = 'Title';

      expect(api.pageName).toBe('Title');
    });

    test('properly gets and sets readOnly', () => {
      const api = _scaffoldApi();

      expect(api.readOnly).toBe(false);

      api.readOnly = true;

      expect(api.readOnly).toBe(true);
    });
  });

  describe('utilities', () => {
    test('properly processes error data', async () => {
      const errorMessage = 'Mock Events Error';
      server.use(
        rest.post('http://apptentive.com/events', (_, res, ctx) => res(ctx.status(403), ctx.text(errorMessage)))
      );

      const api = _scaffoldApi({ conversationToken: _conversationToken });
      await api.createEvent().catch((error) => {
        expect(error.responseText).toBe(errorMessage);
      });
    });

    test('properly returns static response when readonly is true', async () => {
      const api = _scaffoldApi({ conversationToken: _conversationToken, readonly: true });
      const response = await api.createEvent();

      expect(response).toEqual({});
    });
  });

  describe('createConversation', () => {
    test('properly requests a conversation', async () => {
      const api = _scaffoldApi();
      const fetchSpy = jest.spyOn(window, 'fetch');

      await api.createConversation({
        hooks: {
          beforeRequest: [
            (request) => {
              expect(request._bodyText).toBe(JSON.stringify({ ...conversationRequest, web_page: _mockWebpage }));
            },
          ],
        },
        json: conversationRequest,
      });

      const args = fetchSpy.mock.calls[0][0];
      _validateRequestParameters(args, 'POST', 'app');
      expect(args.url).toBe(`${_host}/conversation?api_version=8`);
      expect(api._conversationToken).toBe(_conversationToken);
      expect(fetchSpy).toHaveBeenCalledTimes(1);

      fetchSpy.mockRestore();
    });

    test('properly clears queue if conversation id is different', async () => {
      const api = _scaffoldApi({ conversationToken: 'DIFFERENT_TOKEN' });
      api.queue.push({ queued: 'request' });

      expect(api.queue.length).toBe(1);

      await api.createConversation();

      // Ensure that the queue is not being processed and it was properly cleared
      expect(api._isProcessingRequest).toBe(false);
      expect(api.queue.length).toBe(0);
    });
  });

  describe('fetchManifest', () => {
    test('properly fetches a manifest', async () => {
      const api = _scaffoldApi();
      const fetchSpy = jest.spyOn(window, 'fetch');

      await api.fetchManifest();

      const args = fetchSpy.mock.calls[0][0];
      _validateRequestParameters(args, 'GET', 'noauth');
      expect(args.url).toBe(`${_host}/v1/apps/${_appId}/manifest?api_version=12&locale=en-US`);
      expect(fetchSpy).toHaveBeenCalledTimes(1);

      fetchSpy.mockRestore();
    });
  });

  describe('updateConversation', () => {
    test('properly updates a conversation', async () => {
      const api = _scaffoldApi({ conversationToken: _conversationToken });
      const fetchSpy = jest.spyOn(window, 'fetch');

      await api.updateConversation();

      const args = fetchSpy.mock.calls[0][0];
      _validateRequestParameters(args, 'PUT', 'conversationToken');
      expect(args.url).toBe(`${_host}/conversation?api_version=8`);
      expect(fetchSpy).toHaveBeenCalledTimes(1);

      fetchSpy.mockRestore();
    });
  });

  describe('identifyPerson', () => {
    test('properly identifies a person', async () => {
      const api = _scaffoldApi({ conversationToken: _conversationToken });
      const fetchSpy = jest.spyOn(window, 'fetch');

      await api.identifyPerson();

      const args = fetchSpy.mock.calls[0][0];
      _validateRequestParameters(args, 'PUT', 'conversationToken');
      expect(args.url).toBe(`${_host}/people/identify?api_version=12`);
      expect(fetchSpy).toHaveBeenCalledTimes(1);

      fetchSpy.mockRestore();
    });
  });
  describe('updatePerson', () => {
    test('properly updates a person', async () => {
      const api = _scaffoldApi({ conversationToken: _conversationToken });
      const fetchSpy = jest.spyOn(window, 'fetch');

      await api.updatePerson();

      const args = fetchSpy.mock.calls[0][0];
      _validateRequestParameters(args, 'PUT', 'conversationToken');
      expect(args.url).toBe(`${_host}/people?api_version=12`);
      expect(fetchSpy).toHaveBeenCalledTimes(1);

      fetchSpy.mockRestore();
    });
  });

  describe('updateDevice', () => {
    test('properly updates a device', async () => {
      const api = _scaffoldApi({ conversationToken: _conversationToken });
      const fetchSpy = jest.spyOn(window, 'fetch');

      await api.updateDevice();

      const args = fetchSpy.mock.calls[0][0];
      _validateRequestParameters(args, 'PUT', 'conversationToken');
      expect(args.url).toBe(`${_host}/devices?api_version=12`);
      expect(fetchSpy).toHaveBeenCalledTimes(1);

      fetchSpy.mockRestore();
    });
  });

  describe('createMessage', () => {
    test('properly creates a message', async () => {
      const api = _scaffoldApi({ conversationToken: _conversationToken, conversationId: _conversationId });
      const fetchSpy = jest.spyOn(window, 'fetch');

      await api.createMessage();

      const args = fetchSpy.mock.calls[0][0];
      _validateRequestParameters(args, 'POST', 'conversationToken');
      expect(args.url).toBe(`${_host}/messages?api_version=12`);
      expect(fetchSpy).toHaveBeenCalledTimes(1);

      fetchSpy.mockRestore();
    });

    test('properly throws an error if a conversation has not been created', async () => {
      const api = _scaffoldApi();
      const fetchSpy = jest.spyOn(window, 'fetch');

      await expect(() => api.createMessage()).rejects.toThrow();
      expect(fetchSpy).not.toHaveBeenCalled();

      fetchSpy.mockRestore();
    });
  });

  describe('createEvent', () => {
    test('properly creates an event', async () => {
      const api = _scaffoldApi({ conversationToken: _conversationToken });
      const fetchSpy = jest.spyOn(window, 'fetch');

      await api.createEvent();

      const args = fetchSpy.mock.calls[0][0];
      _validateRequestParameters(args, 'POST', 'conversationToken');
      expect(args.url).toBe(`${_host}/events?api_version=12`);
      expect(fetchSpy).toHaveBeenCalledTimes(1);

      fetchSpy.mockRestore();
    });
  });

  describe('submitSurvey', () => {
    test('properly submits a survey response', async () => {
      const api = _scaffoldApi({ conversationToken: _conversationToken, conversationId: _conversationId });
      const fetchSpy = jest.spyOn(window, 'fetch');

      await api.submitSurvey({ json: responsesRequest }, _mockInteractionId);

      const args = fetchSpy.mock.calls[0][0];
      _validateRequestParameters(args, 'POST', 'conversationToken');
      expect(args.url).toBe(
        `${_host}/conversations/${_conversationId}/surveys/${_mockInteractionId}/responses?api_version=12`
      );
      expect(fetchSpy).toHaveBeenCalledTimes(1);

      fetchSpy.mockRestore();
    });

    test('properly throws error if an interactionId is not passed in', async () => {
      const api = _scaffoldApi({ conversationToken: _conversationToken, conversationId: _conversationId });
      const fetchSpy = jest.spyOn(window, 'fetch');

      await expect(() => api.submitSurvey({ json: responsesRequest })).rejects.toThrow();
      expect(fetchSpy).not.toHaveBeenCalled();

      fetchSpy.mockRestore();
    });
  });

  describe('queue', () => {
    test('properly queues a request before a conversation has been created', async () => {
      const api = _scaffoldApi();
      const fetchSpy = jest.spyOn(window, 'fetch');

      api.createEvent({ json: { event: { data: { cat: 'meow' } } } });

      expect(api.queue.length).toBe(1);
      expect(fetchSpy).not.toHaveBeenCalled();

      fetchSpy.mockRestore();
    });

    test('properly processes the queue after a conversation is created', async () => {
      const api = _scaffoldApi();
      const fetchSpy = jest.spyOn(window, 'fetch');

      const catPromise = api.createEvent({ json: { event: { data: { cat: 'meow' } } } });
      const cowPromise = api.createEvent({ json: { event: { data: { cow: 'moo' } } } });

      expect(api.queue.length).toBe(2);
      expect(fetchSpy).not.toHaveBeenCalled();

      await api.createConversation({ json: conversationRequest });
      await Promise.all([catPromise, cowPromise]);

      const args0 = fetchSpy.mock.calls[0][0];
      expect(args0.url).toBe(`${_host}/conversation?api_version=8`);
      expect(args0.method).toBe('POST');

      const args1 = fetchSpy.mock.calls[1][0];
      expect(args1.url).toBe(`${_host}/events?api_version=12`);
      expect(args1.method).toBe('POST');

      const args2 = fetchSpy.mock.calls[2][0];
      expect(args2.url).toBe(`${_host}/events?api_version=12`);
      expect(args2.method).toBe('POST');

      expect(api.queue.length).toBe(0);
      expect(fetchSpy).toHaveBeenCalledTimes(3);

      fetchSpy.mockRestore();
    });

    test('properly processes the queue when a conversation token is manually set', async () => {
      const api = _scaffoldApi();
      const fetchSpy = jest.spyOn(window, 'fetch');

      const catPromise = api.createEvent({ json: { event: { data: { cat: 'meow' } } } });
      const cowPromise = api.createEvent({ json: { event: { data: { cow: 'moo' } } } });

      expect(api.queue.length).toBe(2);
      expect(fetchSpy).not.toHaveBeenCalled();

      api.conversation = { id: _conversationId, token: _conversationToken };
      await Promise.all([catPromise, cowPromise]);

      const args0 = fetchSpy.mock.calls[0][0];
      expect(args0.url).toBe(`${_host}/events?api_version=12`);
      expect(args0.method).toBe('POST');

      const args1 = fetchSpy.mock.calls[1][0];
      expect(args1.url).toBe(`${_host}/events?api_version=12`);
      expect(args1.method).toBe('POST');

      expect(api.queue.length).toBe(0);
      expect(fetchSpy).toHaveBeenCalledTimes(2);

      fetchSpy.mockRestore();
    });

    test('properly processes the failed requests queue when a conversation token is passed to the constructor', async () => {
      const catEventJson = { event: { data: { cat: 'meow' } } };
      const cowEventJson = { event: { data: { cow: 'moo' } } };

      window.localStorage.setItem(
        'apptentiveFailedRequests',
        JSON.stringify([
          {
            url: `events?api_version=12`,
            options: {
              auth: 1,
              json: catEventJson,
              method: 'post',
            },
          },
        ])
      );

      const fetchSpy = jest.spyOn(window, 'fetch');
      const api = _scaffoldApi({ conversationToken: _conversationToken });

      // In order to wait for the 2 failed request to be processed, add another event
      // and wait for it to complete since it will be added to the end of the queue
      await api.createEvent({ json: cowEventJson });

      const args0 = fetchSpy.mock.calls[0][0];
      _validateRequestParameters(args0, 'POST', 'conversationToken');
      expect(args0.url).toBe(`${_host}/events?api_version=12`);
      expect(args0._bodyText).toEqual(JSON.stringify(catEventJson));

      const args1 = fetchSpy.mock.calls[1][0];
      expect(args1.url).toBe(`${_host}/events?api_version=12`);
      expect(args1._bodyText).toEqual(JSON.stringify({ ...cowEventJson, web_page: _mockWebpage }));

      expect(api.queue.length).toBe(0);
      expect(fetchSpy).toHaveBeenCalledTimes(2);

      fetchSpy.mockRestore();
    });

    test('properly removes failed requests when loaded in on initialization', () => {
      window.localStorage.setItem(
        'apptentiveFailedRequests',
        JSON.stringify([
          {
            url: `events?api_version=12`,
            options: {
              auth: 1,
              json: { event: { data: { cat: 'meow' } } },
              method: 'post',
            },
          },
          {
            url: `events?api_version=12`,
            options: {
              auth: 1,
              json: { event: { data: { cow: 'moo' } } },
              method: 'post',
            },
          },
        ])
      );

      _scaffoldApi();

      expect(window.localStorage.getItem('apptentiveFailedRequests')).toBe(null);
    });

    test('properly does not process queue when another request is in process', () => {
      const fetchSpy = jest.spyOn(window, 'fetch');
      const api = _scaffoldApi();
      api.createEvent({ json: eventRequest });
      api._isProcessingRequest = true;

      // With a request queued and isProcessingRequest set to true, the request should never be called
      api.conversation = { id: _conversationId, token: _conversationToken };

      expect(fetchSpy).not.toHaveBeenCalled();

      fetchSpy.mockRestore();
    });

    test('properly does not process queue when partial conversation is set', () => {
      const fetchSpy = jest.spyOn(window, 'fetch');
      const api = _scaffoldApi();
      api.createEvent({ json: eventRequest });
      api.conversation = { id: _conversationId };

      expect(fetchSpy).not.toHaveBeenCalled();

      fetchSpy.mockRestore();
    });

    test('properly rejects queued request when it fails', async () => {
      server.use(rest.post('http://apptentive.com/events', (_, res, ctx) => res(ctx.status(404))));

      const fetchSpy = jest.spyOn(window, 'fetch');
      const api = _scaffoldApi();

      const eventsPromise = api.createEvent({
        json: eventRequest,
      });

      api.conversation = { id: _conversationId, token: _conversationToken };

      await expect(eventsPromise).rejects.toThrow();
      expect(api._isProcessingRequest).toBe(false);

      fetchSpy.mockRestore();
    });
  });

  describe('retry', () => {
    test('properly retries a GET request on a failure', async () => {
      server.use(rest.get('http://apptentive.com/v1/apps/:appId/manifest', (_, res, ctx) => res.once(ctx.status(500))));

      const api = _scaffoldApi();
      const fetchSpy = jest.spyOn(window, 'fetch');

      await api.fetchManifest();

      expect(fetchSpy).toHaveBeenCalledTimes(2);

      fetchSpy.mockRestore();
    });

    test('properly retries a POST request on a failure', async () => {
      server.use(rest.post('http://apptentive.com/conversation', (_, res, ctx) => res.once(ctx.status(500))));

      const api = _scaffoldApi();
      const fetchSpy = jest.spyOn(window, 'fetch');

      await api.createConversation({
        json: conversationRequest,
      });

      expect(fetchSpy).toHaveBeenCalledTimes(2);

      fetchSpy.mockRestore();
    });

    test('properly retries a PUT request on a failure', async () => {
      server.use(rest.put('http://apptentive.com/conversation', (_, res, ctx) => res.once(ctx.status(500))));

      const api = _scaffoldApi({ conversationToken: _conversationToken });
      const fetchSpy = jest.spyOn(window, 'fetch');

      await api.updateConversation({
        json: conversationRequest,
      });

      expect(fetchSpy).toHaveBeenCalledTimes(2);

      fetchSpy.mockRestore();
    });

    test('properly retries when an endpoint returns a 408 status code', async () => {
      server.use(rest.post('http://apptentive.com/conversation', (_, res, ctx) => res(ctx.status(408))));

      const api = _scaffoldApi();
      const fetchSpy = jest.spyOn(window, 'fetch');

      await expect(() => api.createConversation({ json: conversationRequest })).rejects.toThrow();
      expect(fetchSpy).toHaveBeenCalledTimes(3);

      fetchSpy.mockRestore();
    });

    test('properly retries when an endpoint returns a 413 status code', async () => {
      server.use(
        rest.post('http://apptentive.com/conversation', (_, res, ctx) =>
          // 413 response codes require a Retry-After header to be retried
          res(ctx.status(413), ctx.headers.set('Retry-After', 1))
        )
      );

      const api = _scaffoldApi();
      const fetchSpy = jest.spyOn(window, 'fetch');

      await expect(() => api.createConversation({ json: conversationRequest })).rejects.toThrow();
      expect(fetchSpy).toHaveBeenCalledTimes(3);

      fetchSpy.mockRestore();
    });

    test('properly retries when an endpoint returns a 429 status code', async () => {
      server.use(rest.post('http://apptentive.com/conversation', (_, res, ctx) => res(ctx.status(429))));

      const api = _scaffoldApi();
      const fetchSpy = jest.spyOn(window, 'fetch');

      await expect(() => api.createConversation({ json: conversationRequest })).rejects.toThrow();
      expect(fetchSpy).toHaveBeenCalledTimes(3);

      fetchSpy.mockRestore();
    });

    test('properly retries when an endpoint returns a 500 status code', async () => {
      server.use(rest.post('http://apptentive.com/conversation', (_, res, ctx) => res(ctx.status(500))));

      const api = _scaffoldApi();
      const fetchSpy = jest.spyOn(window, 'fetch');

      await expect(() => api.createConversation({ json: conversationRequest })).rejects.toThrow();
      expect(fetchSpy).toHaveBeenCalledTimes(3);

      fetchSpy.mockRestore();
    });

    test('properly retries when an endpoint returns a 502 status code', async () => {
      server.use(rest.post('http://apptentive.com/conversation', (_, res, ctx) => res(ctx.status(502))));

      const api = _scaffoldApi();
      const fetchSpy = jest.spyOn(window, 'fetch');

      await expect(() => api.createConversation({ json: conversationRequest })).rejects.toThrow();
      expect(fetchSpy).toHaveBeenCalledTimes(3);

      fetchSpy.mockRestore();
    });

    test('properly retries when an endpoint returns a 503 status code', async () => {
      server.use(rest.post('http://apptentive.com/conversation', (_, res, ctx) => res(ctx.status(503))));

      const api = _scaffoldApi();
      const fetchSpy = jest.spyOn(window, 'fetch');

      await expect(() => api.createConversation({ json: conversationRequest })).rejects.toThrow();
      expect(fetchSpy).toHaveBeenCalledTimes(3);

      fetchSpy.mockRestore();
    });

    test('properly retries when an endpoint returns a 504 status code', async () => {
      server.use(rest.post('http://apptentive.com/conversation', (_, res, ctx) => res(ctx.status(504))));

      const api = _scaffoldApi();
      const fetchSpy = jest.spyOn(window, 'fetch');

      await expect(() => api.createConversation({ json: conversationRequest })).rejects.toThrow();
      expect(fetchSpy).toHaveBeenCalledTimes(3);

      fetchSpy.mockRestore();
    });

    test('properly skips retries when an endpoint returns an unrecoverable status code', async () => {
      server.use(rest.post('http://apptentive.com/conversation', (_, res, ctx) => res(ctx.status(404))));

      const api = _scaffoldApi();
      const fetchSpy = jest.spyOn(window, 'fetch');

      await expect(() => api.createConversation({ json: conversationRequest })).rejects.toThrow();
      expect(fetchSpy).toHaveBeenCalledTimes(1);

      fetchSpy.mockRestore();
    });

    test('properly stores failed events request when retries are exhausted', async () => {
      server.use(rest.post('http://apptentive.com/events', (_, res, ctx) => res(ctx.status(404))));

      const api = _scaffoldApi({ conversationToken: _conversationToken });

      await expect(() =>
        api.createEvent({
          json: eventRequest,
        })
      ).rejects.toThrow();

      const failedRequests = window.localStorage.getItem('apptentiveFailedRequests');
      const failedRequestsJson = JSON.parse(failedRequests);

      expect(failedRequestsJson.length).toBe(1);
      expect(failedRequestsJson[0].url).toBe('events?api_version=12');
      expect(failedRequestsJson[0].options.auth).toBe(1);
      expect(failedRequestsJson[0].options.method).toBe('POST');
      expect(failedRequestsJson[0].options.json).toEqual({ ...eventRequest, web_page: _mockWebpage });
    });

    test('properly stores multiple failed requests when retries are exhausted', async () => {
      const api = _scaffoldApi({ conversationToken: _conversationToken });

      server.use(rest.post('http://apptentive.com/events', (_, res, ctx) => res(ctx.status(404))));

      await expect(() =>
        api.createEvent({
          json: eventRequest,
        })
      ).rejects.toThrow();

      await expect(() =>
        api.createEvent({
          json: eventRequest,
        })
      ).rejects.toThrow();

      const failedRequests = window.localStorage.getItem('apptentiveFailedRequests');
      const failedRequestsJson = JSON.parse(failedRequests);

      expect(failedRequestsJson.length).toBe(2);
      expect(failedRequestsJson[0].url).toBe('events?api_version=12');
      expect(failedRequestsJson[1].url).toBe('events?api_version=12');
    });

    test('properly catches error when localStorage is not available for storing requests', async () => {
      const mockSetItem = jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw Error('No Storage');
      });

      const api = _scaffoldApi({ conversationToken: _conversationToken });

      expect(() => api._storeFailedRequest(new Request('events'), 1)).not.toThrow();

      mockSetItem.mockRestore();
    });

    test('properly catches error when localStorage is not available for processing failed requests', async () => {
      const mockSetItem = jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw Error('No Storage');
      });

      const api = _scaffoldApi({ conversationToken: _conversationToken });

      expect(() => api._processDeadLetterQueue()).not.toThrow();

      mockSetItem.mockRestore();
    });

    test('properly catches error when there is an error dequeuing a request', async () => {
      const api = _scaffoldApi();

      // When a request is processed from the queue that is missing a property such as a null resolve
      // the dequeue method should throw which will be caught in the try/catch block
      const badPromise = new Promise((_, reject) => {
        api.queue.push({
          promiseFunc: () => 42,
          resolve: null,
          reject,
        });
      });

      api.conversation = { id: _conversationId, token: _conversationToken };

      await expect(badPromise).rejects.toThrow();
      expect(api._isProcessingRequest).toBe(false);
    });
  });
});
