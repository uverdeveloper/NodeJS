var express = require('express'),
	bodyParser = require('body-parser'),
	mongodb = require('mongodb');

var app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

var port = 8080;

app.listen(port);

var db = new mongodb.Db(
	'instagram',
	new mongodb.Server('localhost', 27017,{}),
	{}
	);

console.log('Servidor HTTP está escutando na ' + port);

app.get('/', function(req, res){
	var resposta = {msg:"Olá"};
	res.send(resposta)
});


app.get('/api', function(req, res){
	db.open(function(err, mongoclient){
		mongoclient.collection('postagens', function(err, collection){
			collection.find({titulo: {$eq :'Oi'}}).toArray(function(err, records){
				if(err){
					res.json(err);
				}else{
					res.json(records[0]);
				}
				mongoclient.close();
			})
		})
	})
})

app.post('/api', function(req, res){
	var dados = req.body;

	db.open(function(err, mongoclient){
		mongoclient.collection('postagens', function(err, collection){
			collection.insert(dados, function(err, records){
				if(err){
					res.json(err);
				}else{
					res.json(records)
				}
				mongoclient.close();
			})
		})
	})
});