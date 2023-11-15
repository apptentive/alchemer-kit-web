import renderQuestion from '../../../../../src/interactions/components/survey/renderQuestion';

import {
  multichoiceQuestionConfig,
  multiselectQuestionConfig,
  multilineQuestionConfig,
  singlelineQuestionConfig,
  npsQuestionConfig,
  rangeQuestionConfig,
} from '../../../../mocks/data/survey-questions';

const _logger = jest.fn();

describe('renderQuestion', () => {
  test('properly renders multichoice question', () => {
    const output = renderQuestion(multichoiceQuestionConfig, _logger);

    expect(output).toMatchSnapshot();
  });

  test('properly renders multiselect question', () => {
    const output = renderQuestion(multiselectQuestionConfig, _logger);

    expect(output).toMatchSnapshot();
  });

  test('properly renders multiline question', () => {
    const output = renderQuestion(multilineQuestionConfig, _logger);

    expect(output).toMatchSnapshot();
  });

  test('properly renders singleline question', () => {
    const output = renderQuestion(singlelineQuestionConfig, _logger);

    expect(output).toMatchSnapshot();
  });

  test('properly renders nps question', () => {
    const output = renderQuestion(npsQuestionConfig, _logger);

    expect(output).toMatchSnapshot();
  });

  test('properly renders range question', () => {
    const output = renderQuestion(rangeQuestionConfig, _logger);

    expect(output).toMatchSnapshot();
  });

  test('properly renders question with instructions', () => {
    const output = renderQuestion({ ...multiselectQuestionConfig, instructions: 'Instructions' }, _logger);

    expect(output).toMatchSnapshot();
  });

  test('properly renders question missing a value', () => {
    // @ts-expect-error test for passing an invalid value property
    const output = renderQuestion({ ...multiselectQuestionConfig, value: undefined }, _logger);

    expect(output).toMatchSnapshot();
  });

  test('properly catches error if no question is provided', () => {
    expect(() => renderQuestion(null as any, _logger)).not.toThrow();
  });

  test('properly catches error if an unknown question type is provided', () => {
    expect(() =>
      renderQuestion(
        {
          type: 'unknown',
        } as any,
        _logger
      )
    ).not.toThrow();
  });
});
