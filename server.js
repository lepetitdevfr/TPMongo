var express    = require('express');
var cors 	   = require('cors');
var app        = express();
var bodyParser = require('body-parser');	
var MongoClient = require("mongodb").MongoClient;

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ limit: '100mb',extended: true }));
app.use(bodyParser.json({limit: "100mb"}));
app.use(cors());
var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var myDB;

MongoClient.connect("mongodb://localhost/tp", function(error, db) {
	if (error) console.log(error);
	myDB = db;
	console.log("Connecté à la base de données");
})

app.get('/getAll',function (req,res) {
	var date1 = new Date();

	myDB.collection("retard").find().toArray(function (error, results) {
		if (error) console.log(error);
		var date2 = new Date();
		console.log(date2-date1+"ms");
		res.json(results);
	});
});

app.get('/getRer',function (req,res) {
	console.log("getRER");
	var date1 = new Date();

	myDB.collection("retard").find({"fields.service":"RER"}).toArray(function (error, results) {
		if (error) console.log(error);
		var date2 = new Date();
		console.log(date2-date1+"ms");
		res.json(results);
	});
});

app.get('/getTrans',function (req,res) {
	console.log("getTrans");
	var date1 = new Date();
	myDB.collection("retard").find({"fields.service":"Transilien"}).toArray(function (error, results) {
		if (error) console.log(error);
		var date2 = new Date();
		console.log(date2-date1+"ms");
		res.json(results);
	});
});

app.get('/getLigne',function (req,res) {
	var params = req.query;
	console.log("get Ligne "+params.ligne);
	var date1 = new Date();
	myDB.collection("retard").find({"fields.ligne":params.ligne}).toArray(function (error, results) {
		if (error) console.log(error);
		var date2 = new Date();
		console.log(date2-date1+"ms");
		res.json(results);
	});
});

app.get('/getAllLigne',function (req,res) {
	console.log("get Ligne ");
	var date1 = new Date();
	myDB.collection("retard").aggregate([{$group:{_id:{ligne:'$fields.ligne',type:'$fields.service'}}},{$sort:{_id:1}}]).toArray(function (error, results) {
		if (error) console.log(error);
		var date2 = new Date();
		console.log(date2-date1+"ms");
		res.json(results);
	});
});

app.post('/writeDB', function(req, res) {
	console.log("writeDB");
	var params = req.body;
	myDB.collection('retard').insert(params,function () {
	res.send("200");
	});
});


// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);