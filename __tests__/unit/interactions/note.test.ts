import ApptentiveNote from '../../../src/interactions/note';
import ApptentiveBaseBuilder from '../../mocks/builders/ApptentiveBaseBuilder';
import NoteGenerator from '../../mocks/generators/NoteGenerator';

import { IInteraction } from '../../../src/interfaces/manifest/IInteraction';
import { _appId, _apiToken, _domNode, _domNodeId, _host, _interactionOptions } from '../../mocks/data/shared-constants';

const _mockClickEvent = new Event('click');
const _defaultOptions = {
  id: '54d50f69cd68dc00c30001dd',
  title: "We'd love your feedback!",
  body: 'Could you help with a quick 3 minute survey?',
  name: 'Test Note 3',
};

const { config: _mockConfig } = new NoteGenerator({
  ..._defaultOptions,
  actions: [
    {
      id: '54d50f70cd68dc65d400008d',
      action: 'dismiss',
      label: 'Dismiss',
    },
    {
      id: '54d50f70cd68dc65d400008e',
      action: 'interaction',
      label: 'See Apptentive',
      invokes: [
        {
          criteria: {},
          interaction_id: '56b24833c21f96e6700000a8',
        },
      ],
    },
  ],
});

describe('Note', () => {
  beforeEach(() => {
    const div = document.createElement('div');
    div.id = _domNodeId;
    div.innerHTML = '';
    document.body.append(div);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('#constructor: has no side effect if no config is passed', () => {
    const { sdk } = new ApptentiveBaseBuilder().useOptions({ interactions: [_mockConfig] }).build();

    // @ts-expect-error test validating missing configuration
    const apptentiveNote = new ApptentiveNote(undefined, sdk);
    apptentiveNote.render();

    expect(document.querySelector(_domNode)!.innerHTML).toBe('');
  });

  test('#render: should render a DOM element on the page', () => {
    const { sdk } = new ApptentiveBaseBuilder().useOptions({ interactions: [_mockConfig] }).build();
    const apptentiveNote = new ApptentiveNote(_mockConfig, sdk, _interactionOptions);
    apptentiveNote.render();

    expect(document.querySelector(_domNode)!.innerHTML).toMatchSnapshot();
  });

  test('#render: can be built as a static method', () => {
    const { sdk } = new ApptentiveBaseBuilder().useOptions({ interactions: [_mockConfig] }).build();
    ApptentiveNote.display(_mockConfig, sdk, _interactionOptions);

    expect(document.querySelector(_domNode)!.innerHTML).toMatchSnapshot();
  });

  test('#render: does not throw if no parameters are passed', () => {
    // @ts-expect-error test validing missing parameters
    expect(() => ApptentiveNote.display()).not.toThrow();
  });

  test('#render: renders only once', () => {
    const { sdk } = new ApptentiveBaseBuilder().useOptions({ interactions: [_mockConfig] }).build();
    const apptentiveNote = new ApptentiveNote(_mockConfig, sdk, _interactionOptions);
    apptentiveNote.render();
    apptentiveNote.render();

    const noteElements = document.querySelectorAll('apptentive-note');
    expect(noteElements.length).toBe(1);
  });

  test('#render: renders tall actions when more than 3 actions are provided', () => {
    const { config } = new NoteGenerator({
      ..._defaultOptions,
      actions: [
        {
          id: '54d50f70cd68dc65d400008d',
          action: 'dismiss',
          label: 'Dismiss',
        },
        {
          id: '54d50f70cd68dc65d400008f',
          action: 'dismiss',
          label: 'Dismiss 2',
        },
        {
          id: '54d50f70cd68dc65d400008e',
          action: 'interaction',
          label: 'See Apptentive',
          invokes: [
            {
              criteria: {},
              interaction_id: '56b24833c21f96e6700000a8',
            },
          ],
        },
        {
          id: 'ZZZ',
          action: 'sleep',
          label: 'Sleep',
        },
      ],
    });

    const { sdk } = new ApptentiveBaseBuilder().useOptions({ interactions: [config] }).build();
    const apptentiveNote = new ApptentiveNote(config, sdk, _interactionOptions);
    apptentiveNote.render();

    const tall = document.querySelectorAll('.apptentive-note-actions.tall');
    expect(tall.length).toBe(1);

    const button = document.querySelectorAll('.apptentive-note-action.sleep');
    expect(button.length).toBe(1);
  });

  test('#cancel: should not throw an error', () => {
    const { sdk } = new ApptentiveBaseBuilder().useOptions({ interactions: [_mockConfig] }).build();
    const apptentiveNote = new ApptentiveNote(_mockConfig, sdk, _interactionOptions);
    apptentiveNote.render();

    expect(() => {
      apptentiveNote.cancel(_mockClickEvent);
    }).not.toThrow();
  });

  test('#cancel: should handle error if no sdk is available', () => {
    // @ts-expect-error validate missing sdk parameter
    const interaction = new ApptentiveNote(_mockConfig, null);

    expect(() => interaction.cancel(_mockClickEvent)).not.toThrow();
  });

  test('#cancel: should remove the interaction from the DOM', () => {
    const { sdk } = new ApptentiveBaseBuilder().useOptions({ interactions: [_mockConfig] }).build();
    const apptentiveNote = new ApptentiveNote(_mockConfig, sdk, _interactionOptions);
    apptentiveNote.render();

    let noteElements = document.querySelectorAll('apptentive-note');
    expect(noteElements.length).toBe(1);

    const dismiss = document.querySelector<HTMLButtonElement>('.apptentive-note-overlay')!;
    dismiss.click();

    noteElements = document.querySelectorAll('apptentive-note');
    expect(noteElements.length).toBe(0);
  });

  test('#cancel: should engage a close and cancel event', () => {
    const { sdk } = new ApptentiveBaseBuilder().useOptions({ interactions: [_mockConfig] }).build();
    const apptentiveNote = new ApptentiveNote(_mockConfig, sdk, _interactionOptions);
    apptentiveNote.render();

    const apiSpy = jest.spyOn(apptentiveNote.sdk, 'engage');

    const dismiss = document.querySelector<HTMLButtonElement>('.apptentive-note-overlay')!;
    dismiss.click();

    expect(apiSpy.mock.calls[0][0]).toBe('com.apptentive#TextModal#cancel');
    expect(apiSpy.mock.calls[0][1]!.id).toBe('54d50f69cd68dc00c30001dd');

    apiSpy.mockRestore();
  });

  test('#dismiss: should not throw an error if missing action', () => {
    const { sdk } = new ApptentiveBaseBuilder().useOptions({ interactions: [_mockConfig] }).build();
    const apptentiveNote = new ApptentiveNote(_mockConfig, sdk, _interactionOptions);
    apptentiveNote.render();

    expect(() => {
      // @ts-expect-error test missing action property
      apptentiveNote.dismiss({ id: '123', label: 'Dismiss' }, 0);
    }).not.toThrow();
  });

  test('#dismiss: should handle error if no sdk is available', () => {
    // @ts-expect-error validating missing sdk parameter
    const interaction = new ApptentiveNote(_mockConfig, null);

    expect(() => interaction.dismiss({ id: '123', label: 'Dismiss', action: 'dismiss' }, 0)).not.toThrow();
  });

  test('#dismiss: should remove the interaction from the DOM', () => {
    const { sdk } = new ApptentiveBaseBuilder().useOptions({ interactions: [_mockConfig] }).build();
    const apptentiveNote = new ApptentiveNote(_mockConfig, sdk, _interactionOptions);
    apptentiveNote.render();

    let nodeCount = document.querySelectorAll('apptentive-note').length;
    expect(nodeCount).toBe(1);

    const dismiss = document.querySelector<HTMLButtonElement>('.apptentive-note-action.dismiss')!;
    dismiss.click();

    nodeCount = document.querySelectorAll('apptentive-note').length;
    expect(nodeCount).toBe(0);
  });

  test('#dismiss: should engage a close and dismiss event', () => {
    const { sdk } = new ApptentiveBaseBuilder().useOptions({ interactions: [_mockConfig] }).build();
    const apptentiveNote = new ApptentiveNote(_mockConfig, sdk, _interactionOptions);
    apptentiveNote.render();

    const apiSpy = jest.spyOn(apptentiveNote.sdk, 'engage');

    const dismiss = document.querySelector<HTMLButtonElement>('.apptentive-note-action.dismiss')!;
    dismiss.click();

    expect(apiSpy.mock.calls[0][0]).toBe('com.apptentive#TextModal#dismiss');
    expect(apiSpy.mock.calls[0][1]!.action_id).toBe('54d50f70cd68dc65d400008d');
    expect(apiSpy.mock.calls[0][1]!.label).toBe('Dismiss');
    expect(apiSpy.mock.calls[0][1]!.position).toBe(0);
  });

  test('Launching Interactions: should lookup an interaction (Survey)', () => {
    const { sdk } = new ApptentiveBaseBuilder().useOptions({ interactions: [_mockConfig] }).build();
    const apptentiveNote = new ApptentiveNote(_mockConfig, sdk, _interactionOptions);
    apptentiveNote.render();

    const logicEngineSpy = jest.spyOn(apptentiveNote.sdk.logicEngine, 'interactionIdForInvocations');

    const interactionButton = document.querySelector<HTMLButtonElement>('.apptentive-note-action.interaction')!;
    interactionButton.click();

    expect(logicEngineSpy.mock.calls[0][0]).toEqual([{ criteria: {}, interaction_id: '56b24833c21f96e6700000a8' }]);

    logicEngineSpy.mockRestore();
  });

  test('Launching Interactions: should call an interaction if found (Survey)', () => {
    const { sdk } = new ApptentiveBaseBuilder().useOptions({ interactions: [_mockConfig] }).build();
    const apptentiveNote = new ApptentiveNote(_mockConfig, sdk, _interactionOptions);
    apptentiveNote.render();

    const mockInteraction = {
      id: 'SURVEY_PAGED_ID',
      type: 'Survey',
      version: 1,
      api_version: 12,
      configuration: {
        close_confirm_title: 'Close survey?',
        close_confirm_message: 'You will lose your progress if you close this survey.',
        close_confirm_close_text: 'Close',
        close_confirm_back_text: 'Back to Survey',
        required_text: 'Required',
        validation_error: 'There are issues with your response.',
        title: 'Some Title',
        name: 'Some Name',
        render_as: 'list',
        question_sets: [
          {
            id: 'a2d7a73e-9492-5b35-b66e-252262198589',
            button_text: 'Continue',
            version: 1,
            invokes: [
              {
                behavior: 'continue',
                next_question_set_id: '1e2b7d6b-e5b2-5ac3-9e6c-678599919cde',
                criteria: {},
              },
            ],
            questions: [
              {
                id: '4e32ffff-e858-45d1-b7e9-ba729ef41001',
                type: 'singleline',
                required: true,
                instructions: 'select between 2 and 3',
                value: 'Question 4?',
                error_message: 'Error - There was a problem with your text answer.',
                multiline: false,
                freeform_hint: 'Please provide a response',
              },
            ],
          },
        ],
      },
    } as IInteraction;

    const logicEngineStub = jest
      .spyOn(apptentiveNote.sdk.logicEngine, 'interactionForInvocations')
      .mockReturnValue(mockInteraction);

    const interactionButton = document.querySelector<HTMLButtonElement>('.apptentive-note-action.interaction')!;
    interactionButton.click();

    const surveys = document.querySelectorAll('apptentive-survey');
    expect(surveys.length).toBe(1);

    logicEngineStub.mockRestore();
  });

  test('#renderTitle: can render', () => {
    const { sdk } = new ApptentiveBaseBuilder().useOptions({ interactions: [_mockConfig] }).build();
    const apptentiveNote = new ApptentiveNote(_mockConfig, sdk, _interactionOptions);
    const title = apptentiveNote.renderTitle();

    expect(title.outerHTML).toBe('<div class="apptentive-note-title"><h1>We\'d love your feedback!</h1></div>');
  });

  test('#renderBody: can render', () => {
    const { sdk } = new ApptentiveBaseBuilder().useOptions({ interactions: [_mockConfig] }).build();
    const apptentiveNote = new ApptentiveNote(_mockConfig, sdk, _interactionOptions);
    const body = apptentiveNote.renderBody();

    expect(body.outerHTML).toBe('<div class="apptentive-note-body">Could you help with a quick 3 minute survey?</div>');
  });

  test('#noteAction: can handle edge cases', () => {
    const { sdk } = new ApptentiveBaseBuilder().useOptions({ interactions: [_mockConfig] }).build();
    const apptentiveNote = new ApptentiveNote(_mockConfig, sdk, _interactionOptions);

    expect(() => {
      // @ts-expect-error test for missing configuration
      const action = apptentiveNote.noteAction();
      expect(action).not.toThrow();
    }).not.toThrow();
    expect(() => {
      // @ts-expect-error test for empty configuration
      const action = apptentiveNote.noteAction({}, 1);
      expect(action).not.toThrow();
    }).not.toThrow();
    expect(() => {
      const action = apptentiveNote.noteAction({ action: 'action', id: 'id', label: 'label' }, 1);
      expect(action).not.toThrow();
    }).not.toThrow();
    expect(() => {
      const action = apptentiveNote.noteAction({ action: 'interaction', id: 'id', label: 'label' }, 1);
      expect(action).not.toThrow();
    }).not.toThrow();
  });

  test('#renderNoteAction: can handle edge cases', () => {
    const { sdk } = new ApptentiveBaseBuilder().useOptions({ interactions: [_mockConfig] }).build();
    const apptentiveNote = new ApptentiveNote(_mockConfig, sdk, _interactionOptions);

    // @ts-expect-error test for empty configuration
    let action = apptentiveNote.renderNoteAction({}, 1);
    expect(action.outerHTML).toBe(
      '<div class="apptentive-note-action " id="action-"><h2 class="apptentive-note-label"></h2></div>'
    );

    // @ts-expect-error test for missing action property
    action = apptentiveNote.renderNoteAction({ id: 'id', label: 'label' }, 1);
    expect(action.outerHTML).toBe(
      '<div class="apptentive-note-action " id="action-id"><h2 class="apptentive-note-label">label</h2></div>'
    );

    // @ts-expect-error test for missing id property
    action = apptentiveNote.renderNoteAction({ action: 'action', label: 'label' }, 1);
    expect(action.outerHTML).toBe(
      '<div class="apptentive-note-action action" id="action-"><h2 class="apptentive-note-label">label</h2></div>'
    );

    // @ts-expect-error test for missing label property
    action = apptentiveNote.renderNoteAction({ action: 'action', id: 'id' }, 1);
    expect(action.outerHTML).toBe(
      '<div class="apptentive-note-action action" id="action-id"><h2 class="apptentive-note-label"></h2></div>'
    );

    action = apptentiveNote.renderNoteAction({ action: 'action', id: 'id', label: 'label' }, 1);
    expect(action.outerHTML).toBe(
      '<div class="apptentive-note-action action" id="action-id"><h2 class="apptentive-note-label">label</h2></div>'
    );
  });

  test('#renderNoteActions: can handle edge cases in a broken config', () => {
    const { sdk } = new ApptentiveBaseBuilder().useOptions({ interactions: [_mockConfig] }).build();
    const apptentiveNote = new ApptentiveNote({ ..._mockConfig }, sdk, _interactionOptions);
    // @ts-expect-error test for empty configuration
    apptentiveNote.interaction.configuration = {};

    let actions = apptentiveNote.renderNoteActions();
    expect(actions.outerHTML).toBe('<div class="apptentive-note-actions"></div>');

    // @ts-expect-error test for incorrect actions data type
    apptentiveNote.interaction.configuration = { actions: {} };
    actions = apptentiveNote.renderNoteActions();
    expect(actions.outerHTML).toBe('<div class="apptentive-note-actions"></div>');

    // @ts-expect-error test for empty actions
    apptentiveNote.interaction.configuration = { actions: [] };
    actions = apptentiveNote.renderNoteActions();
    expect(actions.outerHTML).toBe('<div class="apptentive-note-actions"></div>');
  });

  test('#renderNoteActions: can render', () => {
    const { sdk } = new ApptentiveBaseBuilder().useOptions({ interactions: [_mockConfig] }).build();
    const apptentiveNote = new ApptentiveNote(_mockConfig, sdk, _interactionOptions);
    const actions = apptentiveNote.renderNoteActions();

    expect(actions.outerHTML).toMatchSnapshot();
  });
});
