/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line node/no-unpublished-require
const jsonServer = require('json-server');
const fs = require('fs');
const path = require('path');
const https = require('https');

const server = jsonServer.create();

// Setup a static file server using the root of the project
const middlewares = jsonServer.defaults({ static: __dirname });
server.use(middlewares);

// Manifest and websdk
// =============================================================================
server.get('/fixtures/v1/apps/:id/websdk', (req, res) => {
  const manifest = fs.readFileSync(path.join(__dirname, 'server', 'mocks', req.params.id, 'manifest-en.json'), {
    encoding: 'utf-8',
  });
  const sdkFile = fs.readFileSync(path.join(__dirname, 'server', 'sdk.js'), { encoding: 'utf-8' });
  const sdkFileModified = sdkFile
    .replace('const manifest = {};', `const manifest = ${manifest};`)
    .replace("id: 'REPLACEME',", `id: '${req.params.id}',`);

  res.header('Content-Type', 'application/javascript');
  res.send(sdkFileModified);
});

server.get('/api/v1/apps/:id/manifest', (req, res) => {
  const language = req.query.locale ?? 'en';
  const filePathPrefix = path.join(__dirname, 'server', 'mocks', req.params.id);

  res.header('Content-Type', 'application/json');

  if (fs.existsSync(path.join(filePathPrefix, `manifest-${language}.json`))) {
    res.sendFile(path.join(filePathPrefix, `manifest-${language}.json`));
  } else {
    res.sendFile(path.join(filePathPrefix, `manifest-en.json`));
  }
});

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser);

// People
// =============================================================================
server.put('/api/people/identify', (req, res, _) => {
  const { person } = req.body;
  const uniqueId = Date.now() * 3;

  res.header('Content-Type', 'application/json');
  res.send({
    id: uniqueId,
    name: person.name ?? null,
    email: person.email ?? null,
    phone_number: person.phone_number ?? null,
    address: person.address ?? null,
    birthday: person.birthday ?? null,
    custom_data: person.custom_data ?? null,
  });
});

server.put('/api/people', (req, res, _) => {
  const { person } = req.body;
  const uniqueId = Date.now() * 3;

  res.header('Content-Type', 'application/json');
  res.send({
    id: uniqueId,
    name: person.name ?? null,
    email: person.email ?? null,
    phone_number: person.phone_number ?? null,
    address: person.address ?? null,
    birthday: person.birthday ?? null,
    custom_data: person.custom_data ?? null,
  });
});

// Conversation
// =============================================================================
server.post('/api/conversation', (req, res, _) => {
  const timestamp = Date.now();
  const { app_release: appRelease, sdk } = req.body;
  const authToken = req.headers?.authorization?.split('OAuth ')[1] ?? 'MOCK_TOKEN';

  res.header('Content-Type', 'application/json');
  res.status(201);
  res.send({
    state: 'new',
    id: timestamp,
    device_id: timestamp + 1,
    person_id: timestamp + 2,
    sdk,
    app_release: appRelease,
    token: authToken,
  });
});

server.put('/api/conversation', (req, res, _) => {
  const timestamp = Date.now();
  const { app_release: appRelease, sdk } = req.body;
  const authToken = req.headers?.authorization?.split('OAuth ')[1] ?? 'MOCK_TOKEN';

  res.header('Content-Type', 'application/json');
  res.status(201);
  res.send({
    state: 'new',
    id: timestamp,
    device_id: timestamp + 1,
    person_id: timestamp + 2,
    sdk,
    app_release: appRelease,
    token: authToken,
  });
});

// Devices
// =============================================================================
server.put('/api/devices', (req, res, _) => {
  const { device } = req.body;
  res.header('Content-Type', 'application/javascript');
  res.status(201);
  res.send({
    ...device,
  });
});

// Events
// =============================================================================
server.post('/api/events', (req, res, _) => {
  res.header('Content-Type', 'application/javascript');
  res.status(201);
  res.send({});
});

// Messages
// =============================================================================
server.post('/api/messages', (req, res, _) => {
  res.header('Content-Type', 'application/javascript');
  res.status(201);
  res.send();
});

// Uncomment to test error scenario on submitting in message center
// server.post('/api/messages', (req, res, _) => {
//   res.header('Content-Type', 'application/json');
//   res.status(500).send({ error: 'There was a problem sending the message!' });
// });

// Responses
// =============================================================================
server.post('/api/conversations/:conversationId/surveys/:interactionId/responses', (req, res, _) => {
  res.header('Content-Type', 'application/javascript');
  res.status(201);
  res.send();
});

// Uncomment to test error scenario on submitting a survey
// server.post('/api/conversations/:convId/surveys/:surveyId/responses', (req, res, _) => {
//   res.header('Content-Type', 'application/json');
//   res.status(500).send('There was a problem submiting the survey!');
// });

// Server Setup
// =============================================================================
server.listen(3001, () => {
  // eslint-disable-next-line no-console
  console.log('JSON Server is running!');
  // eslint-disable-next-line no-console
  console.log('  - HTTP: http://127.0.0.1:3001/');
});

const keyFile = path.join(__dirname, 'server', 'certs', 'localhost+2-key.pem');
const certFile = path.join(__dirname, 'server', 'certs', 'localhost+2.pem');

if (fs.existsSync(keyFile) && fs.existsSync(certFile)) {
  https
    .createServer(
      {
        key: fs.readFileSync(keyFile),
        cert: fs.readFileSync(certFile),
      },
      server
    )
    .listen(3002, () => {
      // eslint-disable-next-line no-console
      console.log('  - HTTPS: https://127.0.0.1:3002/');
    });
}
