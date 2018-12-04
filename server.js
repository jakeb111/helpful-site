var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var http = require('http').Server(app);

app.use(express.static('views'));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.set('view engine', 'ejs');

app.get('/', function(req, res){
    res.render('pages/index');
});

app.get('*', function(req, res) {
    res.render('pages/404');
});

http.listen(4000, function(){
    console.log('listening on localhost:' + 4000);
});
