var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');

app.use(express.static('views'));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views/'));
console.log(path.join(__dirname, 'views/'))
app.get('/', function(req, res){
    res.render('pages/index');
});

app.get('/resources', function(req, res){
    res.render('pages/resources');
});

app.get('*', function(req, res) {
    res.render('pages/404');
});

http.listen(4000, function(){
    console.log('listening on localhost:' + 4000);
});
