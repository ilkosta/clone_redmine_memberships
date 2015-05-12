var util              = require('util');

// setup redmine interface
var winston           = require('winston', false);
    winston.level     = 'info';

var cloneUsers        = require('./clone_users.js');
var cloneGroups        = require('./clone_groups.js');

var getUrlMembership  = require('./api/url_project_memberships.js'); 

var cloneMemberships = (redmine, srcPrj, destPrj) => {
  
  redmine .get(getUrlMembership(srcPrj), {})  
          .error(err => {
            winston.log("info", err);
          })
          .success(memberships => {
            
            winston.log('info', `memberships: ${util.inspect(memberships, {depth: null})}`);
            
            cloneUsers(redmine, memberships, destPrj);
            cloneGroups(redmine, memberships, destPrj);
          }); 
  
};


module.exports = cloneMemberships;
