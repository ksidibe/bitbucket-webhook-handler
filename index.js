const express = require('express');
const app = express();
var os = require('os');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer(); // for parsing multipart/form-data
require('dotenv').config({path: os.homedir() + '/.bitbucket-webhook-handler/.env'});

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
var ew = require('./libs/event-wrapper').EventWrapper;
var hostname = process.env.hostname || 'localhost';
var port = process.env.port_number || 3000;
app.get('/', function(req, res){
    res.send('Hello world');
})
app.post('/webhook-handler', function(req, res){
    bbEvent = new ew(req);
    var handler = require('./libs/handler.js')(bbEvent);
    handler.handle();
    res.send('OK');
});
app.listen(port, hostname ,function(){
    console.log('Bibucket Webhook Handler is now listening on port: %s', port);
});