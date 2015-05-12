'use strict';

var util = require('util');

// setup redmine interface
var winston = require('winston', false);
winston.level = 'info';

var cloneUsers = require('./clone_users.js');
var cloneGroups = require('./clone_groups.js');

var getUrlMembership = require('./api/url_project_memberships.js');

var cloneMemberships = function cloneMemberships(redmine, srcPrj, destPrj) {

  redmine.get(getUrlMembership(srcPrj), {}).error(function (err) {
    winston.log('info', err);
  }).success(function (memberships) {

    winston.log('info', 'memberships: ' + util.inspect(memberships, { depth: null }));

    cloneUsers(redmine, memberships, destPrj);
    cloneGroups(redmine, memberships, destPrj);
  });
};

module.exports = cloneMemberships;