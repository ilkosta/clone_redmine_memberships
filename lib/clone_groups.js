'use strict';

var util = require('util');

// setup redmine interface
var winston = require('winston', false);
winston.level = 'info';

var getUrlMembership = require('./api/url_project_memberships.js');

var createGroups = function createGroups(redmine, groups, destPrj) {
  var g = groups.pop();

  redmine.post(getUrlMembership(destPrj), g).success(function (mem) {
    winston.log('debug', util.inspect(mem, { depth: null }));
  }).error(function (err) {
    winston.log('info', err);
    winston.log('info', g);
  });

  if (groups.length > 0) createGroups(groups, destPrj);
};

var cloneGroups = function cloneGroups(redmine, memberships, destPrj) {

  winston.log('debug', 'memberships: ' + util.inspect(memberships, { depth: null }));

  var groups = memberships.memberships.filter(function (m) {
    return m && m.group && typeof m.group === 'object';
  });

  groups = groups.map(function (g) {
    return {
      membership: {
        user_id: g.group.id,
        role_ids: g.roles.map(function (r) {
          return r.id;
        })
      }
    };
  });

  createGroups(redmine, groups, destPrj);
};

module.exports = cloneGroups;