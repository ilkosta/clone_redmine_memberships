var util              = require('util');

// setup redmine interface
var winston           = require('winston', false);
    winston.level     = 'info';

var getUrlMembership  = require('./api/url_project_memberships.js');


var createGroups = (redmine, groups, destPrj) => {
  let g = groups.pop();

  redmine .post(getUrlMembership(destPrj), g)
          .success(mem => {
            winston.log("debug", util.inspect(mem, { depth: null }));
          })
          .error(err => {
            winston.log("info", err);
            winston.log("info", g);
          });

  if(groups.length > 0 )
    createGroups(groups, destPrj);
};


var cloneGroups = (redmine, memberships, destPrj) => {

  winston.log('debug', `memberships: ${util.inspect(memberships, {depth: null})}`);

  let groups = memberships.memberships.filter((m) => {
    return m && m.group && typeof m.group === "object";
  });

  groups = groups.map(g => {
    return {
      membership: {
        user_id: g.group.id,
        role_ids: g.roles.map(r => {
          return r.id;
        })
      }
    };
  });

  createGroups(redmine, groups, destPrj);

};

module.exports = cloneGroups;
