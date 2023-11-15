# Public API

These APIs allow interacting with the Apptentive ecosystem to capture data about a person's experience with your application.

## `createConversation`

Creates a conversation for the current user so that interactions, events, and messages can be tracked for that person. This method must be called before any other method is called in the SDK for the duration of the user session.

_Note: once a conversation has been created it will be automatically restored on the next page load. If a conversation has already been created and this method is called, it will not make a network request and use the existing conversation instead._

```js
// async / await
const response = await ApptentiveSDK.createConversation();

if (response instanceof Error) {
  // The conversation had an error during creation
} else {
  // The conversation has been created and the SDK is ready to accept events and other interactions
}

// Callbacks
ApptentiveSDK.createConversation({
  failure: (error) => {
    // The conversation had an error during creation
  },
  success: (data) => {
    // The conversation has been created and the SDK is ready to accept events and other interactions
  },
});
```

### Optional Data

This method is also able to take in starting data for a person and / or device if you have that at the time of creation.

```js
// All of these properties are optional except for the "id"
const person = {
  id: 'unique-id-or-guid',
  name: 'Suzy Creamcheese',
  email: 'suzy.creamcheese@me.com',
  phone_number: '111-111-1111',
  birthday: '01-01-1999',
  custom_data: {
    // Can store a string, boolean, or number as a value
    pronoun: 'she/her',
    purchases: 8,
    vip: true,
  };
};

// Any property added here will override the default device information that is automatically captured
const device = {
  custom_data: {
    geo: 'Texas',
    camera: false,
  }
};

// The app release object is intended to associate a version of the website / application with a conversation. Use this if there is a meaningful release version to capture.
const appRelease = {
  version: '1.2.3',
  build_number: '1001',
};

// All of these data points are optional and can be added in any combination based on the data desired to be captured / known at time of creation.
const response = await createConversation({
  app_release: appRelease,
  device: device,
  person: person,
})
```

## `updateConversation`

Updates a conversation with a new app version / build number.

```js
const appRelease = {
  version: '1.2.3',
  build_number: '1001',
};

// async / await
const response = await ApptentiveSDK.updateConversation({ app_release: appRelease });

if (response instanceof Error) {
  // The conversation had an error during update
} else {
  // The conversation has been updated with the new build number
}

// Callbacks
ApptentiveSDK.updateConversation({
  app_release: appRelease,
  failure: (error) => {
    // The conversation had an error during update
  },
  success: (data) => {
    // The conversation has been updated with the new build number
  },
});
```

## `identifyPerson`

Identifies a person and associates them with the current conversation.

_Note: This should only be used if there is not a person already identified previously._

```js
// All of these properties are optional except for the "id"
const person = {
  id: 'unique-id-or-guid',
  name: 'Suzy Creamcheese',
  email: 'suzy.creamcheese@me.com',
  phone_number: '111-111-1111',
  birthday: '01-01-1999',
  custom_data: {
    // Can store a string, boolean, or number as a value
    pronouns: 'she/her',
    purchases: 8,
    vip: true,
  };
};

// async / await
const response = await ApptentiveSDK.identifyPerson({ person });

if (response instanceof Error) {
  // Handle an error from identifying the person
} else {
  // Continue executing code now that a person has been identified
}

// Callbacks
ApptentiveSDK.identifyPerson({
  person,
  failure: (error) => {
    // Handle an error from identifying the person
  },
  success: (data) => {
    // Continue executing code now that a person has been identified
  },
});
```

## `updatePerson`

Updates data associated with a person after they have already been identified.

```js
const person = {
  custom_data: {
    vip: true,
  };
};

// async / await
const response = await ApptentiveSDK.updatePerson(person);

if (response instanceof Error) {
  // Handle an error from updating the person
} else {
  // Continue executing code now that the person data has been updated
}

// Callbacks
ApptentiveSDK.updatePerson(
  person,
  {
    failure: (error) => {
      // Handle an error from updating the person
    },
    success: (data) => {
      // Continue executing code now that the person data has been updated
    },
  }
);
```

## `updateDevice`

Updates data associated with the current device.

```js
const device = {
  custom_data: {
    geo: 'Texas',
  };
};

// async / await
const response = await ApptentiveSDK.updateDevice(device);

if (response instanceof Error) {
  // Handle an error from updating the device
} else {
  // Continue executing code now that the device data has been updated
}

// Callbacks
ApptentiveSDK.updateDevice(
  device,
  {
    failure: (error) => {
      // Handle an error from updating the device
    },
    success: (data) => {
      // Continue executing code now that the device data has been updated
    },
  }
);
```

## `engage`

Emits an event from the application to track a user engagement point.

_Note: This is a synchronous call that is not awaitable and does not allow passing in callbacks._

```js
// Simple event label
ApptentiveSDK.engage('cart-abandoned');

// Complex event data
const customEventData = {
  productsInCart: 12,
  value: '121.21',
};

ApptentiveSDK.engage('cart-abandoned', customEventData);
```

## `showMessageCenter`

Displays the message center interaction if one is available.

```js
ApptentiveSDK.showMessageCenter();
```

## `showInteraction`

Displays a specific interaction if one matches the ID.

```js
const interactionId = '123456789';
ApptentiveSDK.showInteraction(interactionId);
```

## `canShowInteraction`

Checks whether or not a specific event will trigger an interaction based on the local data for the person and the criteria associated with it.

```js
const willDisplay = ApptentiveSDK.canShowInteraction('cart-abandoned');

console.log(willDisplay); // true
```

## `setLocale`

Changes the current language of the SDK and fetches a new language specific manifest.

_Note: This will only execute if the locale passed in is different than the current locale._

```js
ApptentiveSDK.setLocale('fr', {
  success: (localeString, manifest) => {
    // The language has been updated and the new manifest has been fetched and loaded in
  },
});
```

# Settings API

These setters enable changing internal settings for the SDK instance.

```js
// get
// Returns the internal API class instance
ApptentiveSDK.api;

// get / set
// Enables or disables event capturing for the current person
// Note: This will also persist the setting in local storage for subsequent page loads
ApptentiveSDK.captureDisabled = true;
console.log(ApptentiveSDK.captureDisabled); // true

// get / set
// Enables or disables debug mode which will provide verbose logging in the browser console
ApptentiveSDK.debug = true;
console.log(ApptentiveSDK.debug); // true

// get
// Returns the internal LogicEngine class instance
ApptentiveSDK.logicEngine;

// get / set
// Sets the page name of the current page which will be captured in API calls
ApptentiveSDK.page_name = 'Login';
console.log(ApptentiveSDK.page_name); // 'Login'

// get / set
// Enables or disabled readOnly mode which will return mock successes for all API requests without making any network requests.
ApptentiveSDK.readOnly = true;
console.log(ApptentiveSDK.readOnly); // true

// get
// Returns the current session identifier
console.log(ApptentiveSDK.session_id); // 'random_guid'
```

## Browser Events

Throughout a user journey on a site that leverages the SDK, there are a number of browser events that will be fired based on interactions and other operations that occur from leveraging the methods listed above. Each of these events are fired on the `document` element and can be listened to via JavaScript to react accordingly if desired.

```js
// Generic
'apptentive:error',
'apptentive:init',
'apptentive:ready',
'apptentive:render:interaction',

// App Store Rating
'apptentive:app-store-rating:blocked',
'apptentive:app-store-rating:error',
'apptentive:app-store-rating:open-app-store-url',

// Love Dialog
'apptentive:love-dialog:cancel',
'apptentive:love-dialog:close',
'apptentive:love-dialog:dismiss',
'apptentive:love-dialog:error',
'apptentive:love-dialog:launch',
'apptentive:love-dialog:no',
'apptentive:love-dialog:yes',

// Message Center
'apptentive:message-center:close',
'apptentive:message-center:dismiss',
'apptentive:message-center:error',
'apptentive:message-center:launch',
'apptentive:message-center:send',
'apptentive:messages:created',

// Navigate To Link
'apptentive:navigate-to-link:blocked',
'apptentive:navigate-to-link:error',
'apptentive:navigate-to-link:navigate',
'apptentive:navigate-to-link:navigated',

// Note
'apptentive:note:cancel',
'apptentive:note:click',
'apptentive:note:close',
'apptentive:note:dismiss',
'apptentive:note:error',
'apptentive:note:launch',
'apptentive:overlay:click',

// Survey
'apptentive:survey:dismiss',
'apptentive:survey:error',
'apptentive:survey:launch',
'apptentive:survey:submit',
```

Here are some examples of subscribing to these events:

```js
document.addEventListener('apptentive:error', (event) => {
  const { detail } = event;

  console.error(detail);
});

document.addEventListener('apptentive:survey:submit', (event) => {
  const { detail } = event;

  console.log('Survey has been submitted! Here are their answers:');
  console.table(detail.answers);
});
```
