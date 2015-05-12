'use strict';

var conf = require('./test_conf.json');
var winston = require('winston', false);
winston.level = conf.debug_level;

var util = require('util');

var dbg = function dbg(foo) {
  winston.log('debug', util.inspect(foo, { depth: null }));
};

var fs = require('fs');
var path = require('path');

var getUrlMembership = require(path.join(__dirname, '../lib/api', 'url_project_memberships.js'));

var cleanMemberships = function cleanMemberships(redmine, prjDest, done) {

  var membershipsUrl = getUrlMembership(prjDest);
  dbg(['url:', membershipsUrl]);

  redmine.get(membershipsUrl, {}).error(function (err) {
    winston.log('info', err);throw err;
  }).success(function (memberships) {

    memberships = memberships.memberships.map(function (m) {
      return m.id;
    });
    dbg(memberships);

    memberships.forEach(function (id) {
      dbg(['chiamo la cancellazione di', id]);
      redmine.del('/memberships/' + id).success(function (ok) {
        dbg(['cancellata:', id, ok]);
      }).error(function (err) {
        winston.log('info', err);throw err;
      });
    });
  });
};

module.exports = cleanMemberships;