var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');
var mysql = require('mysql');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var request = require('request')

var connection = mysql.createConnection({
    host     : '66.42.118.220',
    user     : 'root',
    port     :  3306,
    password : 'jakebtarrrishmarc',
    database : 'helpsite'
});
connection.connect();

var sessionStore = new MySQLStore({}, connection);

app.use(session({
    secret: 'this is my key lol',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {}
}))

app.use(express.static('views'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views/'));

app.use(function(req, res, next){
    //Admin login stuff
    if(!req.session || !req.session.userData || !req.session.loggedIn){
        req.session.userData = {
            username: ""
        };
        req.session.loggedIn = false;
    }
    req.session.save();

    //IP logging stuff
    ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress)
    if(ip){
        ip = ip.split(":").pop();
        connection.query("select * from ips where ip = '"+ip+"';", function(err, res){
            if (err) throw err;
            if(res.length == 0 && ip != "1" && ip != "127.0.0.1"){
                try{
                    var lat, lon;
                    request('http://api.ipstack.com/'+ip+"?access_key=2fb29968291fe43fca01b482519685db&fields=latitude,longitude", function (error, response, body) {
                        body = JSON.parse(body);
                        lat = body.latitude;
                        lon = body.longitude;
                        connection.query('INSERT INTO ips (ip, lat, lon) VALUES ("'+ip+'", "'+lat+'", "'+lon+'");');
                    });
                }catch(err){
                    console.log(err);
                }
            }
        })
    }

    next();
})

app.get('/', function(req, res, next){
    res.render('pages/index');
});

app.get('/resources', function(req, res, next){
    res.render('pages/resources');
});

app.get('/admin', function(req, res, next){
    res.render('pages/admin', {loggedIn: req.session.loggedIn, userData: req.session.userData});
});

app.post('/admin', function(req, res, next){
    if(!req.session.loggedIn){
        var user = req.body.username;
        var pass = req.body.password;
        connection.query('SELECT * FROM users WHERE username=\''+user+'\' AND password=\''+pass+'\';', function(err, response){
            if(response.length != 0){
                req.session.loggedIn = true;
                req.session.userData.username = response[0].username
                req.session.save();
            }
            res.render('pages/admin', {loggedIn: req.session.loggedIn});
        })
    }
})

app.get('/logout', function(req, res, next){
    req.session.destroy();
    res.render('pages/admin', {loggedIn: false});
})

app.get('*', function(req, res, next) {
    res.render('pages/404');
});

http.listen(4000, function(){
    console.log('listening on localhost:' + 4000);
});
