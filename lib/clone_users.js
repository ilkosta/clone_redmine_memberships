'use strict';

var util = require('util');

// setup redmine interface
var winston = require('winston', false);
winston.level = 'debug';

var D = require('d.js');

var getUrlMembership = require('./api/url_project_memberships.js');

var dbg = function dbg(foo) {
  winston.log('debug', util.inspect(foo, { depth: null }));
};

var createUsers = function createUsers(redmine, userlist, destProg) {
  var u = userlist.pop();
  dbg({ users: u });
  redmine.post(getUrlMembership(destProg), u).success(function (mem) {
    winston.log('debug', util.inspect(mem, { depth: null }));
  }).error(function (err) {
    winston.log('info', err);
    winston.log('info', u);
  });

  if (userlist.length > 0) createUsers(redmine, userlist, destProg);
};

var cloneUsers = function cloneUsers(redmine, memberships, destProg) {

  winston.log('debug', 'memberships: ' + util.inspect(memberships, { depth: null }));

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

  //     winston.log("info", `users: ${util.inspect(users, {depth: null})}` );

  createUsers(redmine, users, destProg);
};

module.exports = cloneUsers;