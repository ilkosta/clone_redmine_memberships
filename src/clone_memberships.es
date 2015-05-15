var util              = require('util');

// setup redmine interface
var winston           = require('winston', false);
    winston.level     = 'info';


var D = require('d.js');  

var getUrlMembership  = require('./api/url_project_memberships.js'); 


var getUsersToClone = (memberships) => {
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
  
  return users;
};

var getGroupstoClone = (memberships) => {
  
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
  
  return groups;
};

var cloneMemberships = (redmine, srcPrj, destPrj) => {
  
  let url = getUrlMembership(srcPrj);
  let createMembership = (data) => { return redmine.post(getUrlMembership(destPrj), data); };
  
  winston.log('debug', {url:url});
  
  return redmine.get(url, {})
    .success( memberships => { 
      
      let usersCreation = getUsersToClone(memberships);
      winston.log('debug', {users:usersCreation});    
      usersCreation  = usersCreation.map(createMembership);
      
      let groupsCreation = getGroupstoClone(memberships);
      winston.log('debug', {groups:groupsCreation});    
      groupsCreation = groupsCreation.map(createMembership);
      
      return D.all(usersCreation.concat(groupsCreation));
    }); 
};


module.exports = cloneMemberships;
