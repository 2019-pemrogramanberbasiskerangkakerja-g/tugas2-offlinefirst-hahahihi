var flash = require('connect-flash');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var alert = require('alert-node');
var session = require('express-session');
var cookieParser = require('cookie-parser');


const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'pbkk';
const colName = 'akun';

app.set('views', __dirname + '/');
app.engine('html', require('ejs').renderFile);
app.use(cookieParser());
app.use(session({
    secret: '2C44-4D44-WppQ38S',
    resave: true,
    saveUninitialized: true
}));
app.get('/logout', function (req, res) {
    req.session.destroy();
    res.redirect('/');
});
app.get('/register', function (req, res) {
    res.render('register.ejs');
});
app.get('/', function (req, res) {
    res.render('login.ejs');
});
app.post('/login', urlencodedParser ,function (req, res) {
    response = {
        username:req.body.username,
        password:req.body.password
    };
    MongoClient.connect(url, function(err, db) {
        if (err){
            throw err;
        }
        else{
            var dbo = db.db(dbName);
            var query = { username : response.username, password:response.password };
            dbo.collection(colName).find(query).toArray(function(err, result) {
            if (err) throw err;
              console.log(result);
              if (typeof result !== 'undefined' && result.length > 0) {        
                req.session.user = req.session.username;
                alert('Sukses login');
                res.redirect('/sukseslogin');
              }
              else{
                alert('Username dan password salah')
                res.redirect('/');
              }
              db.close();
            });
        }
    });
});
app.post('/register', urlencodedParser ,function (req, res) {
    if(!req.body.username || !req.body.password){
        alert('username dan password harap diisi');
        res.redirect('/register');
    }
    response = {
        username:req.body.username,
        password:req.body.password
    };
    MongoClient.connect(url, function(err, db) {
        if (err){
            throw err;
        }
        var dbo = db.db(dbName);
        var query = { username: response.username, password: response.password };
        dbo.collection(colName).insertOne(query, function(err, res) {
          if (err) throw err;
          db.close();
        });
    });
    res.redirect('/');
    alert('Registrasi berhasil');   
});
app.get('/sukseslogin', function (req, res) {
    res.render('sukseslogin.ejs');
});
var server = app.listen(8000, function () {
   console.log("server offline di localhost port 8000")
})
