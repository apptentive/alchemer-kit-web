import { IAnswer } from '../../../interfaces/interactions/survey/answers/IAnswer';
import { IAnswers } from '../../../interfaces/interactions/survey/answers/IAnswers';
import { ISerializedAnswer } from '../../../interfaces/interactions/survey/answers/ISerializedAnswer';
import { ISerializedAnswers } from '../../../interfaces/interactions/survey/answers/ISerializedAnswers';
import { ISerializedAnswerState } from '../../../interfaces/interactions/survey/answers/ISerializedAnswerState';
import { QuestionType } from '../../../interfaces/interactions/survey/IQuestionType';

/**
 * Serialize Answers to use for evaluation and sending to the server.
 *
 * @param {Array} questions - The set of questions to serialize
 * @param {Array} answers - The answers collected for those questions
 * @returns {Object} An object of the answers serialized into a request format.
 */
// eslint-disable-next-line arrow-body-style
export const translateAnswers = (questions: QuestionType[], answers: IAnswers): ISerializedAnswers => {
  return questions.reduce((translatedAnswers, question) => {
    const questionAnswers = answers[question.id];

    // If there isn't an answer for a question it means it was skipped
    // Note: An empty array is truthy by default
    if (!questionAnswers) {
      return translatedAnswers;
    }

    if (questionAnswers.length === 0) {
      return {
        ...translatedAnswers,
        [question.id]: { state: 'empty' } as ISerializedAnswerState,
      };
    }

    if (question.type === 'multiselect') {
      const multiAnswers = questionAnswers.map((answer: IAnswer) => {
        const answerValue: ISerializedAnswer = { id: answer.value as string };

        if (answer.other) {
          answerValue.value = answer.other;
        }

        return answerValue;
      });

      return {
        ...translatedAnswers,
        [question.id]: { state: 'answered', value: multiAnswers },
      };
    }

    if (question.type === 'multichoice') {
      const answerValue: ISerializedAnswer = {
        id: questionAnswers[0].value as string,
      };

      if (questionAnswers[0].other) {
        answerValue.value = questionAnswers[0].other;
      }

      return {
        ...translatedAnswers,
        [question.id]: { state: 'answered', value: [answerValue] },
      };
    }

    if (question.type === 'singleline') {
      const answerState: ISerializedAnswerState =
        questionAnswers[0].value === ''
          ? {
              state: 'empty',
            }
          : {
              state: 'answered',
              value: [{ value: questionAnswers[0].value } as ISerializedAnswer],
            };

      return {
        ...translatedAnswers,
        [question.id]: answerState,
      };
    }

    if (question.type === 'nps' || question.type === 'range') {
      return {
        ...translatedAnswers,
        [question.id]: {
          value: [{ value: Number.parseInt(questionAnswers[0].value as string, 10) } as ISerializedAnswer],
          state: 'answered',
        } as ISerializedAnswerState,
      };
    }

    return translatedAnswers;
  }, {} as ISerializedAnswers);
};

export default translateAnswers;
