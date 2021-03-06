// app requires
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var fs = require('fs');

var ioConnections = 0;

// app global variables
//var routes = require('./routes/index');

// listen on server node env port
app.set('port', (process.env.PORT || 3000));

// the views folder for storing jade templates
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// the public folder to place javascript and images folder
app.use('/public',express.static(path.join(__dirname, 'public')));

// routing for the app
//app.use('/', routes);

app.get('/', function(req,res,next) {
	res.render('index',
		{
			title:"Hello",
			server:"test"
		});
});

// error handling
app.use(function(err,req,res,next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: err
	});
});

io.on('connection', function(socket) {
	var jsonFS = {"name":"./vfs", "children":[]};
	ioConnections++;
	console.log(ioConnections +":"+socket.id);
	getFS('./vfs', jsonFS, jsonFS, function(data) {
		console.log(data);
		io.emit('item', data);
	});
	
});

function getFS(path, jsonFS, current, fn) {
	fs.readdir(path,function(err, items){
		if(err == null && items.length > 0) {
		
			items.forEach(function(item){
				setTimeout(function() {
				
					fs.lstat(path + '/' + item, function(err, itemStat) {
						if (itemStat.isDirectory()) {
							current.children.push({"name":item,"children":[]});
							var dir = current.children[current.children.length-1];
							getFS(path + '/' + item, jsonFS, dir, fn);
						} else {
							current.children.push({"name":item, "size":itemStat.size});
							var dir = current.children[current.children.length-1];
							getFS(path + '/' + item, jsonFS, dir, fn);
							console.log('sent file');
						}
					});
				
				},500);
			});
		} else {
			fn(jsonFS);
		}
	});	
}

function loopFunction(counter, itemsLength, fn) {
	if(counter < itemsLength) {
		setTimeout(loopFunction(counter, itemsLength, fn), 500);
	} else {
		fn;
	}
}

// start up the server
var server = http.listen(app.get('port'), function() {
	console.log('server is listening on port: ' + server.address().port);
});
