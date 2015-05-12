'use strict';

var dbg = function dbg(foo) {
  var util = require('util');
  var winston = require('winston', false);
  winston.level = 'info';

  winston.log('info', util.inspect(foo, { depth: null }));
};

module.exports = function (prj) {
  dbg(['----------------', 1]);
  dbg(prj);

  // strip project
  if (prj.project) prj = prj.project;

  dbg(['----------------', 2]);
  dbg(prj);

  return 'projects/' + prj.identifier + '/memberships';
};