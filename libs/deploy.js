var exec = require('child_process').exec;
var os = require('os');
YAML = require('yamljs');
var moment = require("moment");
//var execSync = require('child_process').execSync;
require('dotenv').config({path: os.homedir() + '/.bitbucket-webhook-handler/.env'});
handlers = YAML.load(os.homedir() + '/.bitbucket-webhook-handler/handlers.yml');