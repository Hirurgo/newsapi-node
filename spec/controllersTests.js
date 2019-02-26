const request = require('supertest');
const server = require('../server');
describe('Request ', function () {

  it(' return 404 on bad url', function testPath(done) {
    request(server)
      .get('/badurl')
      .expect(404, done);
  });

  it(' requires AUTH for adding news', function testPath(done) {
    request(server)
      .post('/news')
      .send({ user: 'testUser' })
      .expect(401, done);
  });
});

describe('Api ', function () {
  const email = "email@email.com";
  const password = "password";
  let cookie;
  let newNewsId;

  it(' no duplicate email is allowed', function testPath(done) {
    request(server)
      .post('/users/register')
      .send({
        email: email,
        name: 'name',
        surname: 'surname',
        password: password
      })
      .expect(409, done);
  });
});