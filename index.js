// app requires
var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');

// app global variables
var routes = require('./routes/index');

// listen on server node env port
app.set('port', (process.env.PORT || 3000));

// the views folder for storing jade templates
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// the public folder to place javascript and images folder
app.use('/public',express.static(path.join(__dirname, 'public')));

// routing for the app
app.use('/', routes);

// error handling
app.use(function(err,req,res,next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: err
	});
});

// start up the server
var server = app.listen(app.get('port'), function() {
	console.log('server is listening on port: ' + server.address().port);
});

