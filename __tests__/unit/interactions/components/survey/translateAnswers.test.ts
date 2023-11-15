import translateAnswers from '../../../../../src/interactions/components/survey/translateAnswers';
import { manifest as surveyBranchedManifest } from '../../../../mocks/data/survey-branched-manifest';

import { IQuestionMultiselect } from '../../../../../src/interfaces/interactions/survey/IQuestionMultiselect';
import { IInteraction } from '../../../../../src/interfaces/manifest/IInteraction';
import { ISurveyBranchedConfiguration } from '../../../../../src/interfaces/interactions/ISurveyBranchedConfiguration';

const currentInteraction = surveyBranchedManifest.interactions[0] as IInteraction<ISurveyBranchedConfiguration>;

const getQuestionSetFromManifest = (questionSet: number) => currentInteraction.configuration.question_sets[questionSet];
const getQuestionsListFromManifest = (questionSet: number, question: number) =>
  currentInteraction.configuration.question_sets[questionSet].questions[question];
const getAnswerFromManifest = (questionSet: number, question: number, answer: number) => {
  const currentQuestion = currentInteraction.configuration.question_sets[questionSet].questions[question];

  return (currentQuestion as IQuestionMultiselect).answer_choices[answer];
};

describe('translateAnswers', () => {
  test('can serialize the answers from the current QuestionSet', () => {
    const { questions } = getQuestionSetFromManifest(0);
    const answers = {
      [getQuestionsListFromManifest(0, 0).id]: [
        {
          value: getAnswerFromManifest(0, 0, 1).id,
          other: 'something',
        },
      ],
    };

    expect(translateAnswers(questions, answers)).toEqual({
      [getQuestionsListFromManifest(0, 0).id]: {
        state: 'answered',
        value: [
          {
            id: getAnswerFromManifest(0, 0, 1).id,
            value: 'something',
          },
        ],
      },
    });
  });

  test('can serialize the answers from a multiselect question', () => {
    const { questions } = getQuestionSetFromManifest(2);
    const answers = {
      [getQuestionsListFromManifest(2, 0).id]: [
        {
          value: getAnswerFromManifest(2, 0, 0).id,
        },
        {
          value: getAnswerFromManifest(2, 0, 1).id,
        },
      ],
    };

    expect(translateAnswers(questions, answers)).toEqual({
      [getQuestionsListFromManifest(2, 0).id]: {
        state: 'answered',
        value: [
          {
            id: getAnswerFromManifest(2, 0, 0).id,
          },
          {
            id: getAnswerFromManifest(2, 0, 1).id,
          },
        ],
      },
    });
  });

  test('can serialize the other answer in a multiselect question', () => {
    const { questions } = getQuestionSetFromManifest(2);
    const answers = {
      [getQuestionsListFromManifest(2, 0).id]: [
        {
          value: getAnswerFromManifest(2, 0, 0).id,
        },
        {
          value: getAnswerFromManifest(2, 0, 2).id,
          other: 'other',
        },
      ],
    };

    expect(translateAnswers(questions, answers)).toEqual({
      [getQuestionsListFromManifest(2, 0).id]: {
        state: 'answered',
        value: [
          {
            id: getAnswerFromManifest(2, 0, 0).id,
          },
          {
            id: getAnswerFromManifest(2, 0, 2).id,

            value: 'other',
          },
        ],
      },
    });
  });

  test('can serialize the answers from a multichoice question', () => {
    const { questions } = getQuestionSetFromManifest(0);
    const answers = {
      [getQuestionsListFromManifest(0, 0).id]: [
        {
          value: getAnswerFromManifest(0, 0, 0).id,
        },
      ],
    };

    expect(translateAnswers(questions, answers)).toEqual({
      [getQuestionsListFromManifest(0, 0).id]: {
        state: 'answered',
        value: [
          {
            id: getAnswerFromManifest(0, 0, 0).id,
          },
        ],
      },
    });
  });

  test('can serialize the other answer in a multichoice question', () => {
    const { questions } = getQuestionSetFromManifest(0);
    const answers = {
      [getQuestionsListFromManifest(0, 0).id]: [
        {
          value: getAnswerFromManifest(0, 0, 2).id,
          other: 'other',
        },
      ],
    };

    expect(translateAnswers(questions, answers)).toEqual({
      [getQuestionsListFromManifest(0, 0).id]: {
        state: 'answered',

        value: [
          {
            id: getAnswerFromManifest(0, 0, 2).id,
            value: 'other',
          },
        ],
      },
    });
  });

  test('can serialize the answers from a singline question', () => {
    const { questions } = getQuestionSetFromManifest(3);
    const answers = {
      [getQuestionsListFromManifest(3, 0).id]: [
        {
          value: 'feedback',
        },
      ],
    };

    expect(translateAnswers(questions, answers)).toEqual({
      [getQuestionsListFromManifest(3, 0).id]: {
        state: 'answered',
        value: [
          {
            value: 'feedback',
          },
        ],
      },
    });
  });

  test('can serialize the answers from an nps question', () => {
    const { questions } = getQuestionSetFromManifest(4);
    const answers = {
      [getQuestionsListFromManifest(4, 0).id]: [
        {
          value: '5',
        },
      ],
    };

    expect(translateAnswers(questions, answers)).toEqual({
      [getQuestionsListFromManifest(4, 0).id]: {
        state: 'answered',
        value: [
          {
            value: 5,
          },
        ],
      },
    });
  });

  test('can serialize the answers from a range question', () => {
    const { questions } = getQuestionSetFromManifest(5);
    const answers = {
      [getQuestionsListFromManifest(5, 0).id]: [
        {
          value: '5',
        },
      ],
    };

    expect(translateAnswers(questions, answers)).toEqual({
      [getQuestionsListFromManifest(5, 0).id]: {
        state: 'answered',
        value: [
          {
            value: 5,
          },
        ],
      },
    });
  });

  test('can handle a missing answer', () => {
    const { questions } = getQuestionSetFromManifest(0);

    expect(translateAnswers(questions, {})).toEqual({});
  });

  test('can handle an empty answer array', () => {
    const { questions } = getQuestionSetFromManifest(0);
    const answers = {
      [getQuestionsListFromManifest(0, 0).id]: [],
    };

    expect(translateAnswers(questions, answers)).toEqual({
      [getQuestionsListFromManifest(0, 0).id]: {
        state: 'empty',
      },
    });
  });

  test('can handle an empty string answer', () => {
    const { questions } = getQuestionSetFromManifest(3);
    const answers = {
      [getQuestionsListFromManifest(3, 0).id]: [
        {
          value: '',
        },
      ],
    };

    expect(translateAnswers(questions, answers)).toEqual({
      [getQuestionsListFromManifest(3, 0).id]: {
        state: 'empty',
      },
    });
  });

  test('can handle an unknown question type', () => {
    const questions = [
      {
        id: 'unknown-question',
        type: 'unknown',
      },
    ];

    const answers = {
      'unknown-question': [
        {
          value: 'test',
        },
      ],
    };

    // @ts-expect-error test validating handling of invalid question type
    expect(translateAnswers(questions, answers)).toEqual({});
  });
});
