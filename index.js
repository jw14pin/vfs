var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');

app.set('port', (process.env.PORT || 3000));

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, '/', 'index.html'));
});

http.listen(app.get('port'), function(){
  console.log('listening on *:'+app.get('port'));
});
