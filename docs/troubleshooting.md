# Troubleshooting

## Debugging Deployed Site

When debugging a site with the Apptentive SDK integrated, any of the SDK options can be modified through using `localStorage`. To do this, execute a command like the examples below to set a JSON parsable string to manually override what is returned from the server.

Below are examples of the two most common properties to change -- namely `debug` and `readOnly`:

```js
// Enable debugging to show console logs
window.localStorage.setItem('ApptentiveSDKOptions', '{ "debug": true }');

// Disable network requests for testing without submitting data
window.localStorage.setItem('ApptentiveSDKOptions', '{ "readOnly": true }');

// Or combine multiple options in the same object
window.localStorage.setItem('ApptentiveSDKOptions', '{ "debug": true, "readOnly": true }');
```

_Note: Once the object is updated in localStorage, reload the page to see those options take effect._

## Doctor

Sometimes it is useful to get an output of the current state of the SDK. To do this, execute the `doctor` command from the browser console:

```js
window.ApptentiveSDK.doctor();
```

This command will output as much information as it can and includes details like:

- Event information (last invoked, number of invokes, name of event)
- Interaction information (last invoked, number of invokes, last submitted, available event triggers)
- Conversation information (whether a token exists, the IDs associated with it)
- Person information (id, name, email, etc.)
- Last successful call
- Number of requests in the API queue
- Various configurations (debug, readOnly, etc.)

## Interaction Not Displaying

The cause of an interaction not displaying can be difficult to identify. Here are a few examples of why interactions may not display and steps to take to understand why that is happening.

### Criteria evaluates to false

One of the most common cases of an interaction not being displayed is that the criteria associated with it evaluates to false at some point. To understand if this is happening, enable debug mode in the SDK and then trigger the event again. After doing this, check the console logs in the browser for an output of what was evaluated and what the state was. Here is an annotated output for both a successful and unsuccessful evaluation:

#### Successful evaluation

```js
// Event was properly engaged
[Base] Engage Event: local#app#example_event undefined

// Found a configured target for the event
[Base] Targeted Interaction Event: local#app#example_event
[Base] Interaction ID For Invocations: Array [ {…} ]

// Found associated criteria object to evaluate
[Base] Evaluate Criteria: Object {  }

// Criteria evaluated to true
[Base] Evaluated Criteria: true

// Interaction is displaying using the configured interaction id
[Base] Interaction From ID: '5e8b53ad8469b72d1e19c041'
```

#### Unsuccessful evaluation

```js
// Event was properly engaged
[Base] Engage Event: local#app#example_event undefined

// Found a configured target for the event
[Base] Targeted Interaction Event: local#app#example_event
[Base] Interaction ID For Invocations: Array [ {…}, {…} ]

// Found associated criteria object to evaluate
[Base] Evaluate Criteria: Object { "interactions/example_interaction/invokes/total": {…} }

// Evaluation output
[Base] Evaluate Criteria Key Value: interactions/example_interaction/invokes/total Object { "$eq": 0 }
[Base] Value For Key: "interactions/example_interaction/invokes/total"
[Base] Value For Key: "interactions/example_interaction/invokes/total" === 4
[Base] Evaluate Conditional Tests: 4 Object { "$eq": 0 } interactions/example_interaction/invokes/total
[Base] Evaluate Conditional Test: 4 $eq 0 interactions/example_interaction/invokes/total
[Base] Compare: $eq 4 0

// Specific evaluation test resulted in a false
[Base] Evaluate Conditional Test: false

// Overall criteria resulted in a false
[Base] Evaluated Criteria: false

// Interaction was not displayed
[Base] Interaction From ID called without interactionId.
```

### Event is not tied to interaction

A second common case of an interaction not displaying is that the event is not properly configured to display the interaction. A great way to validate this is to enable debug mode in the SDK and then manually fire the event and look at the console logs. Here is an annotated output of that flow:

```js
// Manually trigger the event
ApptentiveSDK.engage('example_event')

// Event was properly engaged
[Base] Engage Event: local#app#example_event undefined

// Attempting to find targeting for event
[Base] Targeted Interaction Event: local#app#example_event

// Event targeting was not found
[Base] Interaction ID For Invocations: undefined
```

## Manifest Caching

[Manifest Caching Dashboard](https://app.datadoghq.com/dashboard/scv-888-pdb/manifest-caching?from_ts=1557248817868&to_ts=1557252417868&live=true&tile_size=m) is the dashboard for all things manifest caching related, specifically the "Cacheable App Manifests" graph.

Both the manifest JSON and the rendered view (`websdk.js.erb`) are cached.

The service abstracts both Cassandra and Mongo under the covers. If the cache is empty, it will generate a new one from Mongo, store it and return it and subsequent calls will use the data in Cassandra until it TTLs out.

There are certain "corner" cases where the manifest can't be server side cached because of functionality it uses but normally, it is

Modifying any interaction in the UI should blast the cache for all cached interactions for the app, so subsequent calls should regenerate as expected.

## External Files of Interest

- [apptentive/web: app/views/api/apps/websdk.js.erb](https://github.com/apptentive/web/blob/master/app/views/api/apps/websdk.js.erb)
- [apptentive/web: app/controllers/api/apps_controller.rb](https://github.com/apptentive/web/blob/master/app/controllers/api/apps_controller.rb#L12)
