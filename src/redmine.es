var Redmine = require('promised-redmine');

// setup redmine interface
var config = require('../redmine_conf.json');
var redmine = new Redmine(config);
redmine.setVerbose(true);


module.exports = redmine;
