var app = require('../test-app');
var test = require('tape');



test('GET /api/reports/:spotID should send JSON list', function (assert) {
  app.get('/api/reports/4233')
    .set('x-apicache-bypass', 'true')
    .expect(200)
    .expect('Content-Type', 'application/json; charset=utf-8')
    .end((err, res) => {
      assert.end();
    });
});
