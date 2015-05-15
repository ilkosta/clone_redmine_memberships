'use strict';

var util = require('util');

// setup redmine interface
var winston = require('winston', false);
winston.level = 'info';

var D = require('d.js');

var getUrlMembership = require('./api/url_project_memberships.js');

var getUsersToClone = function getUsersToClone(memberships) {
  var users = memberships.memberships.filter(function (m) {
    return m.hasOwnProperty('user');
  });

  users = users.map(function (u) {
    return {
      membership: {
        user_id: u.user.id,
        role_ids: u.roles.filter(function (r) {
          // remove the group inherited roles
          return !(r.hasOwnProperty('inherited') && r.inherited);
        }).map(function (r) {
          return r.id;
        })
      }
    };
  });

  // remove the user with only group inherited roles
  users = users.filter(function (u) {
    return u.membership.role_ids && u.membership.role_ids.length > 0;
  });

  return users;
};

var getGroupstoClone = function getGroupstoClone(memberships) {

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

  return groups;
};

var cloneMemberships = function cloneMemberships(redmine, srcPrj, destPrj) {

  var url = getUrlMembership(srcPrj);
  var createMembership = function createMembership(data) {
    return redmine.post(getUrlMembership(destPrj), data);
  };

  winston.log('debug', { url: url });

  return redmine.get(url, {}).success(function (memberships) {

    var usersCreation = getUsersToClone(memberships);
    winston.log('debug', { users: usersCreation });
    usersCreation = usersCreation.map(createMembership);

    var groupsCreation = getGroupstoClone(memberships);
    winston.log('debug', { groups: groupsCreation });
    groupsCreation = groupsCreation.map(createMembership);

    return D.all(usersCreation.concat(groupsCreation));
  });
};

module.exports = cloneMemberships;