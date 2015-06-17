'use strict';

var r = require('rethinkdb');
var conn;
var config = require('./config.js');
module.exports = connect;

function connect(options) {
  if (conn) return conn;
  Object.keys(config).forEach(function (key) {
    if (!(key in options)) options[key] = config[key];
  });
  return conn = r.connect(options);
}
