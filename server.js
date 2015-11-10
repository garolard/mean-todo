// set up
var express 	= require('express');
var app			= express();
var mongoose 	= require('mongoose');
var Schema		= mongoose.Schema;
var morgan		= require('morgan'); // logging
var bodyParser	= require('body-parser'); // pull info from HTML POST
var methodOverride = require('method-override'); // simulate DELETE and PUT


// config
mongoose.connect('mongodb://localhost/tododb');

app.use(express.static(__dirname + '/public')); // All the static files will live in /public folder
app.use(morgan('dev')); // Log request to console
app.use(bodyParser.urlencoded({'extended' : 'true'})); // parse application/x-www-urlencode
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({type : 'application/vnd.api+json'})); // parse application/vnd.api+json as json
app.use(methodOverride());

// modeling data
var CategorySchema = new Schema({
	name : String
});

var TaskSchema = new Schema({
	title : String,
	description : String,
	categories : [CategorySchema]
});

var Category = mongoose.model('Category', CategorySchema);
var Task = mongoose.model('Task', TaskSchema);

// app routes
app.get('/api/todos', function(req, res) {
	// get all Tasks from mongo
	Task.find(function(err, todos) {
		if (err)
			res.send(err);
		res.json(todos);
	});
});

app.post('/api/todos', function(req, res) {
	Task.create({
		title : req.body.title,
		description : req.body.description,
		categories : req.body.categories,
		done : false
	}, function(err, todo) { // Ni puta idea, parece ser un callback a ejecutar cuando mongo temine de crear el objeto
		if (err)
			res.send(err);
		Task.find(function(err, todos) {
			if (err)
				res.send(err);
			res.json(todos);
		});
	});
});

app.delete('/api/todos/:todo_id', function(req, res) {
	Task.remove({
		_id : req.params.todo_id
	}, function(err, todo) {
		if (err)
			res.send(err);
		
		Task.find(function(err, todos) {
			if (err)
				res.send(err);
			res.json(todos);
		});
	});
});

// front-end app
app.get('*', function(req, res) {
	res.sendfile('./public/index.html'); // Angular SPA FTW
});

// start the server
app.listen(8080);
console.log('App listening on port 8080');