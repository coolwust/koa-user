'use strict';

var connect = require('../lib/connect.js');
var expect = require('chai').expect;
var co = require('co');
var r = require('rethinkdb');
var config = require('../lib/config');

describe('connection test', function () {
  it('connect to server', function (done) {
    co(function* () {
      var conn = yield connect(config);
      expect(conn).to.be.an('object');
    }).then(done, done);
  });
});
