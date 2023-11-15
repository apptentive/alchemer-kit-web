const fs = require('fs');
const zipcodes = require('./zipcode-criteria');

const interactionCount = 10;

let output = `{
  "interactions": [
    {
      "type": "TextModal",
      "id": "NOTE-ID",
      "configuration": {
        "title": "Note Title!",
        "body": "Note Body",
        "name": "Note Name",
        "actions": [{
          "id": "54d50f70cd68dc65d400008d",
          "action": "dismiss",
          "label": "Dismiss"
        }]
      },
      "version": 1
    }
  ],
  "targets": {`;

for (let i = 0; i < interactionCount; i++) {
  output += `
    "local#app#displayNote-${i}": [{
      "interaction_id": "NOTE-ID",
      "criteria": ${JSON.stringify(zipcodes)}
    }],`;
}

output = output.slice(0, -1);

output += `
  }
}`;

fs.writeFile('huge-manifest.txt', output, (err) => {
  if (err) return console.log(err);
});
