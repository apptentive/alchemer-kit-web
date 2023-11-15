import ky, { HTTPError, Options as KyOptions } from 'ky';
import { KyInstance } from 'ky/distribution/types/ky';
import { merge } from '@corex/deepmerge';

import { IConversationResponse } from './interfaces/api/IConversationResponse';
import { ICreateConversationRequest } from './interfaces/api/ICreateConversationRequest';
import { ICreateEventRequest } from './interfaces/api/ICreateEventRequest';
import { ICreateMessageRequest } from './interfaces/api/ICreateMessageRequest';
import { ICreateMessageResponse } from './interfaces/api/ICreateMessageResponse';
import { IIdentifyPersonRequest } from './interfaces/api/IIdentifyPersonRequest';
import { IManifest } from './interfaces/data/IManifest';
import { IPersonResponse } from './interfaces/api/IPersonResponse';
import { IUpdateConversationRequest } from './interfaces/api/IUpdateConversationRequest';
import { IUpdateDeviceRequest } from './interfaces/api/IUpdateDeviceRequest';
import { IUpdateDeviceResponse } from './interfaces/api/IUpdateDeviceResponse';
import { IUpdatePersonRequest } from './interfaces/api/IUpdatePersonRequest';
import { ISubmitSurveyRequest } from './interfaces/api/ISubmitSurveyRequest';
import { IErrorResponse } from './interfaces/api/IErrorResponse';

const failedRequestsStorageKey = 'apptentiveFailedRequests';

// eslint-disable-next-line no-shadow
const enum AuthType {
  apiToken,
  conversationToken,
  unauthenticated,
}

interface IStoredOptions extends Pick<KyOptions, 'json' | 'method'> {
  auth: AuthType;
}

type StoredRequest = { url: string; options: IStoredOptions };
type QueuedRequest<T> = {
  promiseFunc: () => Promise<T>;
  resolve: (value: T) => void;
  reject: (error: Error) => void;
};

interface IRequestOptionsWithType<T> extends KyOptions {
  json: T;
}

type LoggerMethods = 'error' | 'info' | 'log' | 'warn';

export type Logger = (method: LoggerMethods, ...args: any[]) => void;

export interface IApptentiveApiOptions {
  apiVersion?: number;
  conversationId?: string;
  conversationToken?: string;
  debug: boolean;
  logger?: Logger;
  pageName?: string;
  prefixUrl?: string;
  readonly?: boolean;
  timeout?: number;
}

export default class ApptentiveApi {
  public executor: KyInstance;

  private _apiToken: string;
  private _apiVersion: number;
  private _appId: string;
  private _conversationId: string;
  private _conversationToken: string;
  private _defaultRequestOptions: Partial<KyOptions>;
  private _host: string;
  private _isDebug: boolean;
  private _isProcessingRequest = false;
  private _isReadonly: boolean;
  private _logger: Logger;
  private _pageName: string;
  private _queue: QueuedRequest<any>[] = [];

  constructor(appId: string, apiToken: string, options?: IApptentiveApiOptions) {
    if (!appId || !apiToken) {
      throw new Error('The API must be initialized with an appId and apiToken.');
    }

    this._apiToken = apiToken;
    this._apiVersion = options?.apiVersion ?? 12;
    this._appId = appId;
    this._conversationId = options?.conversationId || '';
    this._conversationToken = options?.conversationToken || '';
    this._host = options?.prefixUrl ?? 'https://api.apptentive.com';
    this._isDebug = options?.debug ?? false;
    this._isReadonly = options?.readonly ?? false;
    this._logger = options?.logger ?? this._consoleLogger;
    this._pageName = options?.pageName ?? '';

    this._defaultRequestOptions = {
      credentials: 'same-origin',
      mode: 'cors',
      prefixUrl: this._host,
      searchParams: {
        api_version: this._apiVersion,
      },
      referrerPolicy: 'no-referrer',
      retry: {
        // This limit is actually the total number of calls instead of number of retries
        limit: 3,
        methods: ['get', 'put', 'post', 'head', 'delete', 'options', 'trace'],
        statusCodes: [408, 413, 429, 500, 502, 503, 504],
      },
      timeout: options?.timeout ?? 15000,
    };

    this.executor = ky.create(this._defaultRequestOptions);

    this._logger('info', 'API has been successfully initialized with options:');
    this._logger('info', `{ apiVersion: ${this._apiVersion}, apiToken: ${this._apiToken}, host: ${this._host} }`);

    // Once the API has been created, process any failed requests and add them into the queue.
    this._processDeadLetterQueue();

    // If a conversationToken was passed into the constructor immediately dequeue requests
    if (this._conversationToken) {
      this._dequeue();
    }
  }

  set conversation({ id, token }: { id: string; token: string }) {
    this._conversationId = id;
    this._conversationToken = token;

    if (this._conversationId && this._conversationToken) {
      this._dequeue();
    }
  }

  get debug() {
    return this._isDebug;
  }

  set debug(value: boolean) {
    this._isDebug = value;
  }

  get queue() {
    return this._queue;
  }

  get pageName() {
    return this._pageName;
  }

  set pageName(name: string) {
    this._pageName = name;
  }

  get readOnly() {
    return this._isReadonly;
  }

  set readOnly(value: boolean) {
    this._isReadonly = value;
  }

  reset() {
    this._conversationId = '';
    this._conversationToken = '';
    this._queue = [];
    this._pageName = '';
  }

  private _consoleLogger(method: string, ...args: any[]) {
    let consoleMethod = method;

    if (!['error', 'info', 'log', 'warn'].includes(method)) {
      args.unshift(method);
      consoleMethod = 'info';
    }

    if (this._isDebug && typeof window !== 'undefined' && window.console) {
      // eslint-disable-next-line no-console, @typescript-eslint/no-explicit-any
      (window.console as any)[consoleMethod]('%c[API]', 'color: #ff414d;', ...args);
    }
  }

  private _getWebpageData() {
    // NOTE React Native does not expose window.location.
    if (typeof window === 'undefined' || typeof window.location === 'undefined') {
      return {
        name: this._pageName,
        path: '',
        search: '',
        title: '',
        url: '',
      };
    }

    return {
      name: this._pageName,
      path: window.location.pathname,
      search: window.location.search,
      title: window.document?.title ?? '',
      url: window.location.href,
    };
  }

  private _buildRequestOptions(
    endpointOptions: KyOptions,
    customOptions: KyOptions | null,
    authType: AuthType
  ): KyOptions {
    return merge([
      customOptions ?? {},
      endpointOptions,
      {
        hooks: {
          beforeRequest: [
            // Ignore the typescript rule since the return of the hook is only intended when overriding the
            // the request based on the readonly setting
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            // eslint-disable-next-line consistent-return
            (request: Request) => {
              if (authType === AuthType.apiToken) {
                request.headers.set('Authorization', `OAuth ${this._apiToken}`);
              }

              if (authType === AuthType.conversationToken) {
                request.headers.set('Authorization', `OAuth ${this._conversationToken}`);
              }

              this._logger('info', 'Sending request: ', request);

              // If readonly mode is enabled, return an empty JSON object response
              if (this._isReadonly) {
                return new Response(new Blob([JSON.stringify({}, null, 2)], { type: 'application/json' }), {
                  status: 200,
                  statusText: 'Success!',
                });
              }
            },
          ],
          beforeRetry: [
            ({ request, retryCount }: { request: Request; retryCount: number }) => {
              this._logger('warn', `Retrying request (attempt: ${retryCount}): ${request.url}`);
            },
          ],
          beforeError: [
            async (error: IErrorResponse) => {
              const { request, response } = error;

              // If a request to the events endpoint has failed, store the request to be sent later
              // This ensures that no data is lost in the case of network connectivity or server issues.
              if (request.url.includes('/events')) {
                this._storeFailedRequest(request, authType);
              }

              // Some error responses from the server have a custom error response in a responseText property
              // Attempt to parse that here and add it to the error object if it exists
              try {
                const responseJson = await response.text();

                if (responseJson) {
                  error.responseText = responseJson;
                }
              } catch (_) {}

              return error;
            },
          ],
          afterResponse: [
            (_request: Request, _options: KyOptions, response: Response) => {
              this._logger('info', response);
            },
          ],
        },
      },
    ]);
  }

  private _queueOrSendRequest<T>(url: string, options: KyOptions) {
    // If there isn't a conversation token when a request is made that requires it
    // put it into the queue to be processed when a conversation gets created.
    if (!this._conversationToken) {
      return this._enqueue<T>(() => this._executeRequest<T>(url, options));
    }

    return this._executeRequest<T>(url, options);
  }

  private async _executeRequest<T>(url: string, options: KyOptions) {
    try {
      return await this.executor(url, options).json<T>();
    } catch (error) {
      // TODO: Format this error into a standardized error format?
      if (error instanceof HTTPError) {
        this._logger('error', error.message);
      }

      throw error;
    }
  }

  private async _enqueue<T = unknown>(promise: () => Promise<T>) {
    return new Promise<T>((resolve, reject) => {
      this._queue.push({
        promiseFunc: promise,
        resolve,
        reject,
      });
    });
  }

  private async _dequeue() {
    // Because dequeuing should happen serially, don't continue if there is another request in progress
    if (this._isProcessingRequest) {
      return;
    }

    const request = this.queue.shift();

    // If there is no request, we are at the end of the queue.
    if (!request) {
      return;
    }

    try {
      this._isProcessingRequest = true;

      request
        .promiseFunc()
        .then((value: any) => {
          request.resolve(value);

          this._isProcessingRequest = false;
          this._dequeue();
        })
        .catch((error: HTTPError) => {
          request.reject(error);

          this._isProcessingRequest = false;
          this._dequeue();
        });
    } catch (error) {
      request.reject(error as Error);

      this._isProcessingRequest = false;
      this._dequeue();
    }
  }

  private _storeFailedRequest(request: Request, authType: AuthType) {
    try {
      const failedRequests = window.localStorage.getItem(failedRequestsStorageKey);
      const storedRequests = failedRequests ? (JSON.parse(failedRequests) as StoredRequest[]) : [];

      request.json().then((data) => {
        storedRequests.push({
          // Because a prefix url is used, we need to remove the host before storing the request
          url: request.url.replace(`${this._host}/`, ''),
          options: {
            auth: authType,
            method: request.method,
            json: data,
          },
        });

        window.localStorage.setItem(failedRequestsStorageKey, JSON.stringify(storedRequests));
      });
    } catch (error) {
      this._logger('warn', `Error storing failed request: ${error}`);
    }
  }

  private _processDeadLetterQueue() {
    try {
      const failedRequests = window.localStorage.getItem(failedRequestsStorageKey);

      if (failedRequests) {
        window.localStorage.removeItem(failedRequestsStorageKey);
        const requestsJson = JSON.parse(failedRequests) as StoredRequest[];
        // Add all failed requests to the queue
        requestsJson.forEach((request) => {
          this._enqueue(() =>
            this._executeRequest(request.url, this._buildRequestOptions(request.options, {}, request.options.auth))
          );
        });
      }
    } catch (error) {
      this._logger('warn', `Error processing failed requests: ${error}`);
    }
  }

  // Requests that will never be queued and instead immediately executed
  // ================================================================================
  async createConversation(options: IRequestOptionsWithType<ICreateConversationRequest>) {
    const endpointOptions = {
      method: 'post',
      searchParams: {
        api_version: 8,
      },
      json: {
        web_page: this._getWebpageData(),
      },
    } as KyOptions;

    const requestOptions = this._buildRequestOptions(endpointOptions, options, AuthType.apiToken);

    return this._executeRequest<IConversationResponse>('conversation', requestOptions).then((response) => {
      // Check that token exists in the response
      if (this._conversationToken && this._conversationToken !== response.token) {
        this._logger(
          'warn',
          'Conversation already exists and is different than the new one. Deleting previously queued requests'
        );
        this._queue = [];
      }

      this._conversationId = response.id;
      this._conversationToken = response.token;

      // Once a conversation has been created, immediately begin dequeing any stored requests
      this._dequeue();

      return response;
    });
  }

  async fetchManifest(options: KyOptions, locale = 'en-US') {
    const endpointOptions = {
      method: 'get',
      searchParams: {
        locale,
      },
    };

    const requestOptions = this._buildRequestOptions(endpointOptions, options, AuthType.unauthenticated);

    return this._executeRequest<IManifest>(`v1/apps/${this._appId}/manifest`, requestOptions);
  }

  async submitSurvey(options: IRequestOptionsWithType<ISubmitSurveyRequest>, interactionId: string) {
    if (!interactionId) {
      throw new Error('An interactionId must be included to submit a survey response.');
    }

    if (!this._conversationId) {
      throw new Error('A survey cannot be submitted before a conversation is created');
    }

    const endpointOptions = {
      method: 'post',
      json: {
        web_page: this._getWebpageData(),
      },
    } as KyOptions;

    const requestOptions = this._buildRequestOptions(endpointOptions, options, AuthType.conversationToken);
    const url = `conversations/${this._conversationId}/surveys/${interactionId}/responses`;

    return this._executeRequest<never>(url, requestOptions);
  }

  async createMessage(options: IRequestOptionsWithType<ICreateMessageRequest>) {
    if (!this._conversationId) {
      throw new Error('A message cannot be sent before a conversation is created');
    }

    const endpointOptions = {
      method: 'post',
      json: {
        web_page: this._getWebpageData(),
      },
    } as KyOptions;

    const requestOptions = this._buildRequestOptions(endpointOptions, options, AuthType.conversationToken);

    return this._executeRequest<ICreateMessageResponse>('messages', requestOptions);
  }

  // Requests that will be queued when a conversastion token isn't available
  // ================================================================================
  async updateConversation(options: IRequestOptionsWithType<IUpdateConversationRequest>) {
    const endpointOptions = {
      method: 'put',
      searchParams: {
        api_version: 8,
      },
    };

    const requestOptions = this._buildRequestOptions(endpointOptions, options, AuthType.conversationToken);

    return this._queueOrSendRequest<IConversationResponse>('conversation', requestOptions);
  }

  async identifyPerson(options: IRequestOptionsWithType<IIdentifyPersonRequest>) {
    const endpointOptions = {
      method: 'put',
      json: {
        web_page: this._getWebpageData(),
      },
    } as KyOptions;

    const requestOptions = this._buildRequestOptions(endpointOptions, options, AuthType.conversationToken);

    return this._queueOrSendRequest<IPersonResponse>('people/identify', requestOptions);
  }

  async updatePerson(options: IRequestOptionsWithType<IUpdatePersonRequest>) {
    const endpointOptions = {
      method: 'put',
      json: {
        web_page: this._getWebpageData(),
      },
    } as KyOptions;

    const requestOptions = this._buildRequestOptions(endpointOptions, options, AuthType.conversationToken);

    return this._queueOrSendRequest<IPersonResponse>('people', requestOptions);
  }

  async updateDevice(options: IRequestOptionsWithType<IUpdateDeviceRequest>) {
    const endpointOptions = {
      method: 'put',
      json: {
        web_page: this._getWebpageData(),
      },
    } as KyOptions;

    const requestOptions = this._buildRequestOptions(endpointOptions, options, AuthType.conversationToken);

    return this._queueOrSendRequest<IUpdateDeviceResponse>('devices', requestOptions);
  }

  async createEvent(options: IRequestOptionsWithType<ICreateEventRequest>) {
    const endpointOptions = {
      method: 'post',
      json: {
        web_page: this._getWebpageData(),
      },
    } as KyOptions;

    const requestOptions = this._buildRequestOptions(endpointOptions, options, AuthType.conversationToken);

    return this._queueOrSendRequest<Record<string, never>>('events', requestOptions);
  }
}
