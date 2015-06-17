'use strict';

var expect = require('chai').expect;
var User = require('../lib/user.js');
var co = require('co');
var connect = require('../lib/connect.js');
var config = require('../lib/config.js');
var r = require('rethinkdb');

describe('user model testing', function () {

  beforeEach(function (done) {
    co(function* () {
      var conn = yield connect(config);
      yield r.tableDrop('user').run(conn);
      yield r.tableCreate('user').run(conn);
    }).then(done, done);
  });

  it('create a user', function (done) {
    co(function* () {
      var user = new User();
      expect(user).to.be.an('object');
    }).then(done, done);
  });

  it('store properties when instantiated', function (done) {
    co(function* () {
      var username = 'coolwust';
      var user = new User({ username: username });
      expect(user.username).to.equal(username);
    }).then(done, done);
  });

  it('assign an id after being saved', function (done) {
    co(function* () {
      var username = 'coolwust';
      var password = '123456';
      var user = new User({ username: username, password: password });
      yield user.save();
      expect(user.id).to.not.be.empty;
    }).then(done, done);
  });

  it('find a user by name', function (done) {
    co(function* () {
      var username = 'coolwust';
      var password = '123456';
      var user = new User({ username: username, password: password });
      yield user.save();
      var record = yield User.findByName(username);
      expect(record.username).to.equal(username);
    }).then(done, done);
  });

  it('hash password when saved', function (done) {
    co(function* () {
      var username = 'coolwust';
      var password = '123456';
      var user = new User({ username: username, password: password });
      yield user.save();
      var record = yield User.findByName(username);
      expect(record.password).to.not.equal(password);
    }).then(done, done);
  });

  it('validate password', function (done) {
    co(function* () {
      var username = 'coolwust';
      var password = '123456';
      var user = new User({ username: username, password: password });
      yield user.save();
      var same = yield user.validatePassword('1345');
      expect(same).to.be.false;
      var same = yield user.validatePassword(password);
      expect(same).to.be.true;
    }).then(done, done);
  });
});
