'use strict';

var redmine = require('../lib/redmine.js');
var cleanMemberships = require('./clean_memberships.js');
var cloneMemberships = require('../lib/clone_memberships.js');
var conf = require('./test_conf.json');

var winston = require('winston', false);
winston.level = conf.debug_level;

var path = require('path');
var util = require('util');
var getUrlMembership = require(path.join(__dirname, '../lib/api', 'url_project_memberships.js'));

var dbg = function dbg(foo) {
  winston.log('debug', util.inspect(foo, { depth: null }));
};

// describe('the memberships deletion', () => {
//   it('should work', (done) => {
//    
redmine.get('/projects/' + conf.destination_project_identifier, {}).error(function (err) {
  winston.log('info', err);throw err;
}).success(function (prjDest) {
  dbg(prjDest);

  var membershipsUrl = getUrlMembership(prjDest);
  dbg(['url dei membri', membershipsUrl]);

  var chkMemberships = function chkMemberships() {
    redmine.get(membershipsUrl, {}).error(function (err) {
      winston.log('info', err);throw err;
    }).success(function (memberships) {
      dbg(['cazzo0000000000000000000', memberships]);

      //                 memberships.length.should.be(0);
      //                 done();
    });
  };

  cleanMemberships(redmine, prjDest, chkMemberships);
});
//   });
// });

// describe('the memberships cloned', () => {
//   it('shold be equal to the source', (done) => {
//     redmine.get(`/projects/${conf.destination_project_identifier}`,{})
//       .error(err => { winston.log("info", err); throw err;})
//       .success(prjDest => {
//         cleanMemberships(redmine, prjDest);
//        
//         redmine.get(`/projects/${conf.source_project_identifier}`,{})
//           .error(err => { winston.log("info", err); throw err;})
//           .success(prjSrc => {
//             dbg(prjSrc);
//             cloneMemberships(redmine, prjSrc);
//            
//             redmine.get(getUrlMembership(prjDest), {})
//               .error(err => { winston.log("info", err); throw err;})
//               .success( memberships => {
//                 dbg(memberships);
//                 memberships.length.should.not.equal(0);
//                 done();
//               });
//              
//           });
//        
//       });
//      
//      
//   });
// });