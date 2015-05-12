var conf = require('redmine_conf.json');
var fs = require('fs');

conf.apiKey = "<insert here your api key>";

fs.writeFileSync(conf);
