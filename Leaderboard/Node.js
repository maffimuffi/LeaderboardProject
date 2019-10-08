const Express = require("express");
const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;

const CONNECTION_URL = process.env.MONGODB_URI || "mongodb-url";
const DATABASE_NAME = "db-name";

var app = Express();

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 5000;

var database, collection;

app.listen(port, () => {
	   
    MongoClient.connect(CONNECTION_URL,  { useNewUrlParser: true }, (error, client) => {
        if(error) {
            throw error;
        }
        database = client.db(DATABASE_NAME);
        require('./app/routes')(app, database);
        console.log("Connected to `" + DATABASE_NAME + "`!");
    });

});

// routes/node_routes.js

var ObjectID = require('mongodb').ObjectID;

module.exports = function(app, db) {

	app.put('/leaderboard/:id', (req, res) => {
	    const id = req.params.id;
	    const details = { '_id': new ObjectID(id) };
	    const newscore = { name: req.body.name, score: req.body.score };
	    db.collection('scores').update(details, newscore, (err, result) => {
	      if (err) {
	          res.send({'error':'An error has occurred'});
	      } else {
	          res.send(newscore);
	      } 
	    });
 	});


	app.get('/leaderboard', (req, res) => {
	    db.collection('scores').find({}).toArray((err, result) => {
	      if (err) {
	        res.send({'error':'An error has occurred'});
	      } else {
	        res.send(result);
	      }
	    });
 	 });

	app.delete('/leaderboard/:id', (req, res) => {
	    const id = req.params.id;
	    const details = { '_id': new ObjectID(id) };
	    db.collection('scores').remove(details, (err, item) => {
	      if (err) {
	        res.send({'error':'An error has occurred'});
	      } else {
	        res.send('score ' + id + ' deleted!');
	      } 
	    });
  	});


	
	app.get('/leaderboard/:id', (req, res) => {
	    const id = req.params.id;
    	const details = { '_id': new ObjectID(id) };
	    
	    db.collection('scores').findOne(details, (err, item) => {
	      if (err) {
	        res.send({'error':'An error has occurred'});
	      } else {
	        res.send(item);
	      }
	    });
 	 });
	

	app.post('/leaderboard', (req, res) => {
    const score = { name: req.body.name, score: req.body.score };
    db.collection('scores').insertOne(score, (err, result) => {
      if (err) { 
        res.send({ 'error': 'An error has occurred' }); 
      } else {
        res.send(result.ops[0]);
      }
    });
  });
};