var exec = require('child_process').exec;
var execSync = require('child_process').execSync;
var os = require('os');
var fs = require('fs');
var YAML = require('yamljs');
var moment = require("moment");
var handlerString = fs.readFileSync(os.homedir() + '/.bitbucket-webhook-handler/handlers.yml', 'utf8')
handlers = YAML.load(os.homedir() + '/.bitbucket-webhook-handler/handlers.yml');
module.exports = function(eventWrapper){
    return {
        handle: function(){
            handleBuildSuccess(eventWrapper);
        }
    }
}
function handleBuildSuccess(eventWrapper){
    if(eventWrapper && eventWrapper.isBuildSuccessful()){
        var branch = eventWrapper.getBuildBranch();
        if(handlers[branch] && handlers[branch].build && handlers[branch].build.success){
            if(Array.isArray(handlers[branch].build.success)){
                for (var i = 0, length = handlers[branch].build.success.length; i < length; i++) {
                    console.log('handlers[branch].build.success[i]');
                    console.log(handlers[branch].build.success[i]);
                    var cmd = renderTemplates(handlers[branch].build.success[i].command);
                    if(cmd){
                        var code = exec(cmd, function(err, stdout){
                            if(err){
                                console.error('Error');
                                console.error(err);
                                return;
                            }
                            console.log('stdout');
                            console.log(stdout);
                        });
                        /* console.log('Exit Code');
                        console.log(code.toString()); */

                    }
                }
            }
        }
    }
}
function renderTemplates(string){
    string = renderTimestampTemplate(string);
    return string;
}
function renderTimestampTemplate(str){
    str = str || '';
    var now = new moment(new Date());
    return str.replace(/\{\{(\s)*timestamp(\s)*}}/gi, now.format('YYYYMMDDHHmmss'));
}