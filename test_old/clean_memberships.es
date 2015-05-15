var conf              = require('./test_conf.json');
var winston           = require('winston', false);
    winston.level     = conf.debug_level;

var util = require('util');
    
var dbg = (foo) => {
  winston.log('debug', util.inspect(foo, { depth: null }));
};

var fs = require('fs');
var path = require('path');

var getUrlMembership  = require(path.join(__dirname,'../lib/api','url_project_memberships.js'));

var cleanMemberships  = (redmine, prjDest, done) => {
  
  const membershipsUrl = getUrlMembership(prjDest);
  dbg(['url:',membershipsUrl ]);
  
  redmine .get(membershipsUrl, {})  
    .error(err => { winston.log("info", err); throw err; })
    .success(memberships => {
      
      
      memberships = memberships.memberships.map(m => { return m.id;});
      dbg(memberships);
      
      memberships.forEach(id => {
        dbg(['chiamo la cancellazione di',id]);
        redmine.del(`/memberships/${id}`)
          .success(ok => { dbg(['cancellata:', id, ok]); })
          .error(err => { winston.log("info", err); throw err; });
      });
    });

};


module.exports = cleanMemberships;
