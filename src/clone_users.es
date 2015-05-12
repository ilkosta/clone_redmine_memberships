var util              = require('util');

// setup redmine interface
var winston           = require('winston', false);
    winston.level     = 'info';

var getUrlMembership  = require('./api/url_project_memberships.js');

var createUsers = (redmine, userlist, destProg) => {
  let u = userlist.pop();

  redmine .post(getUrlMembership(destProg), u)
          .success(mem => {
            winston.log("debug", util.inspect(mem, { depth: null }));
          })
          .error(err => {
            winston.log("info", err);
            winston.log("info", u);
          });

  if(userlist.length > 0 )
    createUsers(userlist, destProg);
};


var cloneUsers = (redmine, memberships, destProg) => {

  winston.log('debug', `memberships: ${util.inspect(memberships, {depth: null})}`);


    let users = memberships.memberships.filter(m => {
          return m.hasOwnProperty('user');
        });

    users = users.map(u => {
      return {
        membership: {
          user_id: u.user.id,
          role_ids: u.roles
            .filter(r => {
              // remove the group inherited roles
              return !(r.hasOwnProperty('inherited') && r.inherited);
            })
            .map(r => {
              return r.id;
            })
        }
      };
    });

    // remove the user with only group inherited roles
    users = users.filter( u => {
      return u.membership.role_ids && u.membership.role_ids.length > 0;
    });

//     winston.log("info", `users: ${util.inspect(users, {depth: null})}` );


    createUsers(redmine, users, destProg);

};


module.exports = cloneUsers;
