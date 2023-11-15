import hex2rgb from './hex2rgb';

/**
 * Build individual style rules.
 *
 * @param {string} key - Style key value
 * @param {string} value - Style CSS value
 * @returns {string|string[]} - String or array of strings with CSS rules
 */
const buildStyleRule = (key: string, value: string | number) => {
  const valueFormatted = typeof value === 'number' ? String(value) : value;

  switch (key) {
    case 'header_color': {
      return [
        `apptentive-survey .apptentive-appbar { background-color: ${hex2rgb(valueFormatted, 1)}; }`,
        `apptentive-survey .apptentive-survey-footer { background-color: ${hex2rgb(valueFormatted, 1)}; }`,
      ];
    }
    case 'header_icon_datauri': {
      return `apptentive-survey .apptentive-appbar .apptentive-appbar__icon { background-image: url(${value}); }`;
    }
    case 'background_color': {
      return [
        `apptentive-note .apptentive-note-content { background-color: ${hex2rgb(valueFormatted, 1)}; }`,
        `apptentive-note .apptentive-note-content .apptentive-note-title { background-color: ${hex2rgb(
          valueFormatted,
          1
        )}; }`,
      ];
    }
    case 'font_color': {
      return `apptentive-note .apptentive-note-content { color: ${hex2rgb(valueFormatted, 1)}; }`;
    }
    case 'button_font_color': {
      return `apptentive-note .apptentive-note-content .apptentive-note-actions .apptentive-note-action h2.apptentive-note-label { color: ${hex2rgb(
        valueFormatted,
        1
      )}; }`;
    }
    case 'overlay_color': {
      return `apptentive-note .apptentive-note-overlay { background-color: ${hex2rgb(valueFormatted, 1)}; }`;
    }
    case 'overlay_opacity': {
      if (valueFormatted === '0') {
        return `apptentive-note .apptentive-note-overlay { display: none; pointer-events: none; opacity: ${valueFormatted}; }`;
      }

      return `apptentive-note .apptentive-note-overlay { opacity: ${valueFormatted}; }`;
    }
    case 'mc_background_color': {
      return `apptentive-message-center { background-color: ${hex2rgb(valueFormatted, 1)}; }`;
    }
    case 'mc_close_font_color': {
      return [
        `apptentive-message-center .apptentive-appbar__action::before { background-color: ${hex2rgb(
          valueFormatted,
          1
        )}; }`,
        `apptentive-message-center .apptentive-appbar__action::after { background-color: ${hex2rgb(
          valueFormatted,
          1
        )}; }`,
      ];
    }
    case 'mc_header_color': {
      return [
        `apptentive-message-center .apptentive-appbar { background-color: ${hex2rgb(valueFormatted, 1)}; }`,
        `apptentive-message-center .apptentive-footer { background-color: ${hex2rgb(valueFormatted, 1)}; }`,
      ];
    }
    case 'mc_header_font_color': {
      return [`apptentive-message-center .apptentive-appbar__title { color: ${hex2rgb(valueFormatted, 1)}; }`];
    }
    case 'mc_content_font_color': {
      return [
        `apptentive-message-center .apptentive-intro p { color: ${hex2rgb(valueFormatted, 1)}; }`,
        `apptentive-message-center .apptentive-message-center-greeting h2 { color: ${hex2rgb(valueFormatted, 1)}; }`,
        `apptentive-message-center .apptentive-message-center-greeting p { color: ${hex2rgb(valueFormatted, 1)}; }`,
        `apptentive-message-center .apptentive-message-center-profile h2 { color: ${hex2rgb(valueFormatted, 1)}; }`,
      ];
    }
    case 'mc_submit_button_color': {
      return [
        `apptentive-message-center button.apptentive-button--primary { background-color: ${hex2rgb(
          valueFormatted,
          0.9
        )}; }`,
        `apptentive-message-center button.apptentive-button--primary:hover:not(:disabled) { background-color: ${hex2rgb(
          valueFormatted,
          1
        )}; }`,
      ];
    }
    case 'mc_submit_button_font_color': {
      return [`apptentive-message-center button.apptentive-button--primary { color: ${hex2rgb(valueFormatted, 1)}; }`];
    }
    case 'ld_background_color': {
      return `apptentive-love-dialog { background-color: ${hex2rgb(valueFormatted, 1)}; }`;
    }
    case 'ld_close_font_color': {
      return `apptentive-love-dialog .close-love-dialog { color: ${hex2rgb(valueFormatted, 1)}; }`;
    }
    case 'ld_font_color': {
      return `apptentive-love-dialog .apptentive-love-dialog-title h1 { color: ${hex2rgb(valueFormatted, 1)}; }`;
    }
    case 'ld_button_font_color': {
      return `apptentive-love-dialog .apptentive-love-dialog-actions button.apptentive-love-dialog-action { color: ${hex2rgb(
        valueFormatted,
        1
      )}; }`;
    }
    case 'ld_button_color': {
      return `apptentive-love-dialog .apptentive-love-dialog-actions button.apptentive-love-dialog-action { background-color: ${hex2rgb(
        valueFormatted,
        1
      )}; }`;
    }
    case 'survey_background_color': {
      return [
        `apptentive-survey { background-color: ${hex2rgb(valueFormatted, 1)}; }`,
        `apptentive-survey .apptentive-survey-intro { background-color: ${hex2rgb(valueFormatted, 1)}; }`,
        `apptentive-survey ::-webkit-scrollbar-track { background-color: ${hex2rgb(valueFormatted, 1)}; }`,
        `apptentive-survey ::-webkit-scrollbar-thumb { border-color: ${hex2rgb(valueFormatted, 1)}; }`,
        `apptentive-survey form.apptentive-survey-questions .apptentive-survey-question.nps answer-choice-container { background-color: ${hex2rgb(
          valueFormatted,
          1
        )}; }`,
        `apptentive-survey form.apptentive-survey-questions .apptentive-survey-question.range answer-choice-container { background-color: ${hex2rgb(
          valueFormatted,
          1
        )}; }`,
      ];
    }
    case 'survey_close_font_color': {
      return [
        `apptentive-survey .apptentive-appbar__action::before { background-color: ${hex2rgb(valueFormatted, 1)}; }`,
        `apptentive-survey .apptentive-appbar__action::after { background-color: ${hex2rgb(valueFormatted, 1)}; }`,
      ];
    }
    case 'survey_header_color': {
      return [
        `apptentive-survey .apptentive-appbar { background-color: ${hex2rgb(valueFormatted, 1)}; }`,
        `apptentive-survey .apptentive-survey-footer { background-color: ${hex2rgb(valueFormatted, 1)}; }`,
      ];
    }
    case 'survey_header_font_color': {
      return [
        `apptentive-survey div.apptentive-appbar { color: ${hex2rgb(valueFormatted, 1)}; }`,
        `apptentive-survey .apptentive-appbar h1 { color: ${hex2rgb(valueFormatted, 1)}; }`,
      ];
    }
    case 'survey_header_icon_datauri': {
      return `apptentive-survey .apptentive-appbar .apptentive-appbar__icon { background-image: url(${valueFormatted}); }`;
    }
    case 'survey_content_font_color': {
      return [
        `apptentive-survey { color: ${hex2rgb(valueFormatted, 1)}; }`,
        `apptentive-survey .apptentive-survey-intro { color: ${hex2rgb(valueFormatted, 1)}; }`,
        `apptentive-survey .apptentive-survey-questions { color: ${hex2rgb(valueFormatted, 1)}; }`,
        `apptentive-survey .apptentive-message .apptentive-message__content { color: ${hex2rgb(valueFormatted, 1)}; }`,
        `apptentive-survey .apptentive-disclaimer__text { color: ${hex2rgb(valueFormatted, 1)}; }`,
        `apptentive-survey form.apptentive-survey-questions .apptentive-survey-question h2.apptentive-survey-question-value { color: ${hex2rgb(
          valueFormatted,
          1
        )}; }`,
        `apptentive-survey form.apptentive-survey-questions .apptentive-survey-question question-instructions { color: ${hex2rgb(
          valueFormatted,
          1
        )}; }`,
      ];
    }
    case 'survey_submit_button_color': {
      return [
        `apptentive-survey .apptentive-survey-questions button.submit { background-color: ${hex2rgb(
          valueFormatted,
          0.9
        )}; }`,
        `apptentive-survey button.apptentive-survey-questions button.submit:hover:not(:disabled) { background-color: ${hex2rgb(
          valueFormatted,
          1
        )}; }`,
        `apptentive-survey button.apptentive-button--primary { background-color: ${hex2rgb(valueFormatted, 0.9)}; }`,
        `apptentive-survey button.apptentive-button--primary:hover:not(:disabled) { background-color: ${hex2rgb(
          valueFormatted,
          1
        )}; }`,
        `apptentive-survey button.apptentive-survey__button { background-color: ${hex2rgb(valueFormatted, 0.9)}; }`,
        `apptentive-survey button.apptentive-survey__button:hover:not(:disabled) { background-color: ${hex2rgb(
          valueFormatted,
          1
        )}; }`,
        `apptentive-survey .apptentive-step-indicator__item--current { border-color: ${hex2rgb(
          valueFormatted,
          1
        )}; background-color: ${hex2rgb(valueFormatted, 1)}; }`,
      ];
    }
    case 'survey_submit_button_font_color': {
      return [
        `apptentive-survey .apptentive-survey-questions button.submit { color: ${hex2rgb(valueFormatted, 1)}; }`,
        `apptentive-survey button.apptentive-button--primary { color: ${hex2rgb(valueFormatted, 1)}; }`,
        `apptentive-survey button.apptentive-survey__button { color: ${hex2rgb(valueFormatted, 1)}; }`,
      ];
    }
    default:
      return undefined;
  }
};

export default buildStyleRule;
