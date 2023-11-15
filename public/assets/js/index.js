/**
 * @param fn - Ready function
 */
function ready(fn) {
  if (document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

ready(() => {
  document.addEventListener('apptentive:error', (event) => {
    console.log('apptentive:error:', event.detail);
  });

  document.addEventListener('apptentive:render:interaction', (event) => {
    const { interaction } = event.detail;
    console.log('apptentive:render:interaction:', interaction);
  });

  document.addEventListener('apptentive:ready', () => {
    const actionsContainer = document.getElementById('actions__events');
    const configurationContainer = document.getElementById('configuration-listing');

    Object.entries(ApptentiveSDK.logicEngine.targeted_events)
      .sort((a, b) => {
        if (a[1][0].interaction_id > b[1][0].interaction_id) return 1;
        if (a[1][0].interaction_id < b[1][0].interaction_id) return -1;
        return 0;
      })
      .forEach((eventArray) => {
        const [key, value] = eventArray;
        const eventName = key.startsWith('local#app#') ? key.split('local#app#')[1] : key;

        const buttonText = document.createElement('div');
        buttonText.classList.add('actions__button-text');
        buttonText.textContent = eventName;

        const buttonDescription = document.createElement('div');
        buttonDescription.classList.add('actions__button-description');
        buttonDescription.textContent = value[0].interaction_id;

        const button = document.createElement('button');
        button.classList.add('actions__button');
        button.type = 'button';
        button.title = key;
        button.addEventListener('click', () => {
          ApptentiveSDK.engage(eventName);
        });

        button.append(buttonText);
        button.append(buttonDescription);

        actionsContainer.appendChild(button);
      });

    ['debug', 'readOnly', 'apiVersion', 'customStyles', 'skipStyles'].forEach((configKey) => {
      const configType = document.createElement('div');
      configType.classList.add('configuration__type');
      configType.textContent = configKey;

      const configValue = document.createElement('div');
      configValue.classList.add('configuration__value');
      configValue.textContent = ApptentiveSDK.options[configKey];

      const configElement = document.createElement('div');
      configElement.classList.add('configuration__item');
      configElement.append(configType);
      configElement.append(configValue);

      configurationContainer.append(configElement);
    });
  });

  // Configuration buttons
  document.getElementById('clear-local-storage').addEventListener('click', (event) => {
    window.localStorage.clear();
  });

  document.getElementById('clear-session-storage').addEventListener('click', (event) => {
    window.sessionStorage.clear();
  });

  document.getElementById('clear-storage').addEventListener('click', (event) => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  document.getElementById('reset-interactions').addEventListener('click', (event) => {
    ApptentiveSDK.db.remove('interaction_counts');
    ApptentiveSDK.db.remove('code_point');

    ApptentiveSDK.logicEngine.code_point = {};
    ApptentiveSDK.logicEngine.interaction_counts = {};
  });

  document.getElementById('identify-person').addEventListener('click', (event) => {
    ApptentiveSDK.identifyPerson({
      unique_token: '172993529511936',
      name: 'Suzy Creamcheese',
      email: 'suzy.creamcheese@gmail.com',
      custom_data: {
        age: 24,
        location: 'TX',
      },
    });
  });

  // Language change buttons
  document.getElementById('language-en').addEventListener('click', (event) => {
    ApptentiveSDK.setLocale('en');
  });

  document.getElementById('language-fr').addEventListener('click', (event) => {
    ApptentiveSDK.setLocale('fr');
  });
});

// Setup & Configuration
ApptentiveSDK.createConversation({
  device: { custom_data: { company: 'Apptentive' } },
  success: () => {
    console.log('DONE');
  },
});
ApptentiveSDK.engage('test');
ApptentiveSDK.setOption('domNode', '#domNode');
