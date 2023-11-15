import type ApptentiveBase from '../../../base';
import { IQuestionBase } from '../../../interfaces/interactions/survey/IQuestionBase';
import { IQuestionMultiselect } from '../../../interfaces/interactions/survey/IQuestionMultiselect';
import { IQuestionRange } from '../../../interfaces/interactions/survey/IQuestionRange';
import { IQuestionSingleline } from '../../../interfaces/interactions/survey/IQuestionSingleline';
import { QuestionType } from '../../../interfaces/interactions/survey/IQuestionType';
import removeErrors from '../../helpers/removeErrors';
import renderChoice from './inputs/renderChoice';
import renderRange from './inputs/renderRange';
import renderSingleline from './inputs/renderSingleline';

/**
 * Renders a given survey question.
 *
 * @param {object} question - The Survey Question configuration.
 * @param {object} logger - A logger to output errors to.
 * @param {string} requiredText - The text to indicate a question is required.
 * @returns {HTMLElement} - The DOM Node
 */
const renderQuestion = (question: QuestionType, logger: ApptentiveBase['console'], requiredText = 'Required') => {
  if (!question) {
    return null;
  }

  const questionNode = document.createElement('question');
  questionNode.className = `apptentive-survey-question ${question.type}`;
  questionNode.id = `question-${question.id}`;
  questionNode.addEventListener('change', removeErrors(questionNode));
  questionNode.addEventListener('input', removeErrors(questionNode));

  let answerChoices;

  switch (question.type) {
    case 'multichoice':
    case 'multiselect':
      answerChoices = renderChoice(question as IQuestionMultiselect);
      break;
    case 'singleline':
      answerChoices = renderSingleline(question as IQuestionSingleline);
      break;
    case 'nps':
    case 'range':
      answerChoices = renderRange(question as IQuestionRange);
      break;
    default:
      logger('error', 'Unknown Question Type: ', (question as IQuestionBase).type);
      break;
  }

  if (answerChoices) {
    const title = document.createElement('h2');
    title.className = 'apptentive-survey-question-value';
    title.textContent = question.value || '';

    questionNode.append(title);

    const required = document.createElement('question-instructions');

    if (question.required || (question as IQuestionMultiselect).instructions) {
      let instructionText = '';

      if (question.required) {
        instructionText += requiredText;
      }

      if ((question as IQuestionMultiselect).instructions) {
        instructionText += ` (${(question as IQuestionMultiselect).instructions})`;
      }

      required.textContent = instructionText.trim();
    }

    questionNode.append(required);
    questionNode.append(answerChoices);

    return questionNode;
  }

  return null;
};

export default renderQuestion;
