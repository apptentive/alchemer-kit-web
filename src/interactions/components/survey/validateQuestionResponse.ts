import { IAnswer } from '../../../interfaces/interactions/survey/answers/IAnswer';
import { QuestionType } from '../../../interfaces/interactions/survey/IQuestionType';

/**
 * Returns whether or not the answers for the question are valid
 *
 * @param {object} question - The question that needs to be validated
 * @param {object} answer - The answer for the question
 * @returns {boolean} Whether or not the answers for the question are valid
 */
const validateQuestionResponse = (question: QuestionType, answer: IAnswer[]): boolean => {
  const hasAnswer =
    !!answer &&
    answer.length > 0 &&
    ((typeof answer[0].value === 'string' ? answer[0].value.trim() !== '' : answer[0].value !== 0) ||
      answer[0].id !== undefined);
  const requiredValid = !question.required || hasAnswer;

  // If this answer has an "other" property with no response, this question should fail validation
  const hasEmptyOther =
    hasAnswer && !!answer.find((response) => typeof response.other === 'string' && response.other.trim() === '');
  if (hasEmptyOther) {
    return false;
  }

  // If there is no answer and the question is not required, this can bypass the below logic.
  if (!hasAnswer && !question.required) {
    return true;
  }

  // Multi-select questions
  if ('min_selections' in question || 'max_selections' in question) {
    const numberOfAnswers = typeof answer === 'undefined' ? 0 : answer.length;
    const minRequiredAnswers = question.min_selections ?? 0;
    const maxRequiredAnswers = question.max_selections ?? Number.POSITIVE_INFINITY;

    const exceedsMin = minRequiredAnswers <= numberOfAnswers;
    const missesMax = maxRequiredAnswers >= numberOfAnswers;

    return requiredValid && exceedsMin && missesMax;
  }

  // Range or nps questions
  if ('max' in question || 'min' in question) {
    const maxRequiredValue = question.max ?? Number.POSITIVE_INFINITY;
    const minRequiredValue = question.min ?? 1;

    const valueTooHigh = answer && answer.length > 0 ? answer[0].value > maxRequiredValue : false;
    const valueTooLow = answer && answer.length > 0 ? answer[0].value < minRequiredValue : false;

    return requiredValid && !valueTooHigh && !valueTooLow;
  }

  // For all other questions, just return whether or not it has an answer and is required
  return requiredValid;
};

export default validateQuestionResponse;
