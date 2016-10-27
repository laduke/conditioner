var app = require('../test-app');
var test = require('tape');

test('app/site/router should serve the favicon', (assert) => {
  app.get('/favicon.ico')
    .expect(200)
    .expect('Content-Type', /^image/)
    .end(assert.end);
});
