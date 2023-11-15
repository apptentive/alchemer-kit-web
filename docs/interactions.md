# Events and Interactions

Events and interactions are the core of the WebSDK. They are both crucial to getting the most of out of engaging with your users and feed into each other to provide a delightful experience.

## Events

After adding the WebSDK to an application, the next step is to think about what key points engaging with your users would be valuable. While events on their own can give good insight into how an experience is being used, configuring events to trigger an interaction at a specific point on a user's journey is when the value really begins to show.

After defining the areas in your application where an event would be desirable, capturing that data point is a simple one line method:

```js
ApptentiveSDK.engage('event-name');
```

The event name is just a simple string, so it can be anything that makes sense to your product. Maybe you want the page name to be first followed by the action (e.g., `cart:checkout`) or maybe have more detail like how a user accessed the action (e.g., `navigation:booking:menu-button`). The choice is all yours and the name can be anything that feels right.

Events can also have custom data associated with them to add additional information when an event is fired. For instance, there could be a `cart-abandoned` event and capturing how many items are in the cart and how much total value the cart was could be valuable:

```js
ApptentiveSDK.engage('cart-abandoned', {
  totalValue: '231.14',
  totalProducts: 32,
});
```

Events are all about thinking through a user journey and capturing important data points along the way to improve how specific interactions can be targeted. Ultimately the best feedback comes from the right users at the right time, and this is why setting up a solid foundation of events is crucial to getting the best feedback possible.

## Interactions

Interactions are the second part of the equation once you have captured the events necessary to be able to target the right segment of users in the application. These can range from a simple Note to a complete Survey and anything in between. When an interaction is created in the dashboard it needs to be configured to display when a specific event is fired and certain criteria is met.

Think about a scenario where a new UI has been launched for a long existing feature and you want to know how users feel about the change. Asking your users the first time they land on that page probably won't be the right time to get feedback since it will be an immediate response when they might not have even used it much since the change. Instead, you can wait for the 5th time they use it, making sure they've had time to process and form an opinion with valuable feedback to pass along to you (even if it's only that they love it!).

_If you are not a developer, you can probably skip to the next section._

Interactions can be quite complex with all of the options and ways to display information to a user. The WebSDK reads in a manifest on initialization which contains all of the event triggers and the interactions associated with them. This manifest is just a JSON file and has all of the information needed to render the full UI of the interaction. Let's take a look at a configuration for a note:

```js
{
  "type": "TextModal",
  "id": "948e5bbdab0490648ec053ea`",
  "configuration": {
    "title": "Thank you for being a fan!",
    "body": "Could you help with a quick 3 minute survey?",
    "name": "Fan Segment Survey",
    "actions": [
      {
        "id": "54d50f70cd68dc65d400008d",
        "action": "dismiss",
        "label": "Dismiss"
      },
      {
        "id": "54d50f70cd68dc65d400008e",
        "action": "interaction",
        "label": "See Apptentive",
        "invokes": [
          {
            "criteria": {},
            "interaction_id": "74ba549889ca29a5f3afbfd0"
          }
        ]
      }
    ]
  },
},
```

Here we know that we have a `TextModal` interaction which is a Note to the SDK that has a `title`, `body` text, and a collection of `actions`. When this gets triggered via an event, the SDK passes this configuration into a render method that builds the HTML to insert into the page for the user to interact with. It's really as simple as that!

_If you want to see what happens during a render, check out the note's [render method](https://github.com/apptentive/alchemer-kit-web/blob/main/src/interactions/note.ts#L238)._

## Targets and Criteria

Just like interactions, event targets are read in from the manifest on initialization. The targets object is a simple key value pair with the event name as the key and the targeting object that is associated with it. Let's take a look at an example object to understand how it attaches to an interaction:

```js
"local#app#example_event": [
  {
    "interaction_id": "<INTERACTION_ID>",
    "criteria": {
      // ...
    }
  }
],
```

The way the SDK handles this is that when the `example_event` is emitted from the `engage` method, the SDK looks up the targeting configuration for it and evaluates whether or not the interaction should be fired. Criteria can be as simple as an empty object (meaning it will always evaluate to true) or a complex combination that must all evaluate to true. If the criteria does evaluate to true, the SDK launches the interaction matching the `interaction_id` property.

_Note: calling engage with `example_event` will automatically be prefixed with `local#app#` before being emitted_

Let's look at some criteria examples to understand how the SDK evaluates it.

### Empty Criteria

```js
"local#app#example_event": [
  {
    "interaction_id": "55c10dd573faf92eb3000140",
    "criteria": {}
  }
],
```

Because the criteria is an empty object, this interaction will always fire when the `example_event` is emitted.

### All Criteria (AND)

```js
"local#app#example_event": [
  {
    "interaction_id": "55c10dd573faf92eb3000140",
    "criteria": {
      "interactions/55c10dd573faf92eb3000140/invokes/total": {
        "$eq": 0
      },
      "person/custom_data/vip": {
        "$eq": true
      }
    }
  }
],
```

When there are multiple criteria, all of them must evaluate to true in order for the interaction to be displayed. In the above configuration, this interaction will only show if the current person is identified as a "VIP" and they have never seen the interaction.

### Either Criteria (OR)

```js
"local#app#example_event": [
  {
    "interaction_id": "55c10dd573faf92eb3000140",
    "criteria": {
      "$or": [
        "person/custom_data/hasAbandonedCart": {
          "$eq": true
        },
        "person/custom_data/vip": {
          "$eq": true
        }
      ]
    }
  }
],
```

With a criteria set that contains an `$or` block, it means that any one of those criteria needs to evaluate to true for the interaction to show. In the above case, the current person either needs to be a "VIP" or has abandoned their cart in the past.

### Either Combination Criteria (OR/AND)

```js
"local#app#example_event": [
  {
    "interaction_id": "55c10dd573faf92eb3000140",
    "criteria": {
      "$or": [
        "interactions/55c10dd573faf92eb3000140/invokes/total": {
          "$eq": 0
        },
        "$and": [
          "person/custom_data/hasAbandonedCart": {
            "$eq": true
          },
          "person/custom_data/vip": {
            "$eq": true
          }
        ]
      ]
    }
  }
],
```

In addition to a flat criteria structure, there can also be nested criteria that can combine with other evaluations. The above criteria has a nested "$and" block, which must all evaluate to true for the interaction to fire. Since it is nested in an "$or" block, either all of the "$and" criteria has to be true OR the interaction must never have been shown.
