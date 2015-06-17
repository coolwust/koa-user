'use strict';

var r = require('rethinkdb');
var co = require('co');
var bcrypt = require('bcrypt');
var promisify = require('es6-promisify');
var connect = require('./connect.js');
var config = require('./config.js');
var genSalt = promisify(bcrypt.genSalt);
var hash = promisify(bcrypt.hash);
var compare = promisify(bcrypt.compare);
User.prototype.save = save;
User.prototype.init = init;
User.prototype.hashPassword = hashPassword;
User.prototype.validatePassword = validatePassword;
User.findByName = findByName;
module.exports = User;

function User(attributes) {
  this.init();
  Object.keys(attributes || {}).forEach(function (key) {
    this[key] = attributes[key];
  }.bind(this));
}

function init() {
  this.encrypted = false;
  this._password = null;
  var descriptor = {
    enumerable: true,
    configurable: true,
    get: function () {
      return this._password;
    },
    set: function (value) {
      this._password = value;
    }
  };
  Object.defineProperty(this, 'password', descriptor)
}

function* hashPassword() {
  if (this.encrypted) return;
  var conn = yield connect(config);
  var salt = yield genSalt(10);
  this.password = yield hash(this.password, salt);
  this.encrypted = true;
}

function* validatePassword(password) {
  return yield compare(password, this.password);
}

function* save() {
  var conn = yield connect(config);
  yield this.hashPassword();
  if (this.id) {
    var user = yield r.table('user').update({ 
      username: this.username,
      password: encrypted
    }).run(conn);
  } else {
    var user = yield r.table('user').insert({
      username: this.username,
      password: this.password,
    }).run(conn);
    this.id = user.generated_keys[0];
  }
}

function* findByName(username) {
  var conn = yield connect(config);
  var records = yield r.table('user').filter(r.row('username').eq(username)).run(conn);
  records = yield records.toArray();
  return new User(records[0]);
}
