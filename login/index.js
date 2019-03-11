var flash = require('connect-flash');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var session = require('express-session');
var cookieParser = require('cookie-parser');
var unique = require('array-unique');

// const MongoClient = require('mongodb').MongoClient;
// const url = 'mongodb://localhost:27017';
// const dbName = 'pbkk';
// const colName = 'users';

// const MongoClient_online = require('mongodb').MongoClient;
// const url_online = 'mongodb://localhost:27017';
// const dbName_online = 'pbkk_online';
// const colName_online = 'users';

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'pbkk_local';
const colName = 'users';

const MongoClient_online = require('mongodb').MongoClient;
const url_online = 'mongodb://localhost:27017'; // ganti IP Pusat
const dbName_online = 'pbkk_online';
const colName_online = 'users';

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

app.get('/', function (req, res) {
    res.render('login.ejs');
});

app.post('/login', urlencodedParser ,function (req, res) {
    response = {
        username:req.body.username,
        password:req.body.password
    };

    MongoClient_online.connect(url_online, function(err, client) {
        if(err){
            console.log('login dari offline');
            MongoClient.connect(url, function(err, db) {
                if (err) throw err;
                var dbo = db.db(dbName);
                var query = { username : req.body.username, password : req.body.password };
                dbo.collection(colName).find(query).toArray(function(err, result) {
                if (err) throw err;
                console.log('hasil query offline :');
                console.log(result);
                console.log('======================');
                if(result.length > 0){
                    db.close();
                    console.log('sukses login');
                    res.redirect('/sukseslogin');
                }
                else{
                    db.close();
                    console.log('gagal login');
                    res.redirect('/');
                }
                });
            });
        }
        else{
            console.log('login dari online');
            MongoClient_online.connect(url_online, function(err, db) {
                if (err) throw err;
                var dbo = db.db(dbName_online);
                var query = { username : req.body.username, password : req.body.password };
                dbo.collection(colName_online).find(query).toArray(function(err, result) {
                  if (err) throw err;
                  console.log('hasil query online :');
                  console.log(result);
                  console.log('======================');
                  if(result.length > 0){
                    console.log('sukses login');
                    syncdatabase();
                    res.redirect('/sukseslogin');
                  }
                  else{
                    console.log('gagal login');
                    res.redirect('/');
                  }
                  const db = client.db(dbName);
                  client.close();
                });
            });
        }
    });
});

app.get('/sukseslogin', function (req, res) {    
    res.render('sukseslogin.ejs');
});


var server = app.listen(8000, function () {
   console.log("app berjalan localhost port 8000")
})


function syncdatabase(){
    var hasil_gabung = [];
    getdatabaseOffline(function(result_off) {
        getdatabaseOnline(function(result_on) {
            hasil_gabung = result_off.concat(result_on);
            hasil_gabung = removeDuplicates(hasil_gabung,'_id');
            console.log(hasil_gabung);
            if(hasil_gabung.length > 0){
                MongoClient.connect(url, function(err, db) {
                    if (err) throw err;
                    var dbo = db.db(dbName);
                    dbo.collection(colName).dropIndexes();
                    dbo.collection(colName).deleteMany(function(err, obj) {
                        if (err) throw err;
                    });
                    dbo.collection(colName).insertMany(hasil_gabung, function(err, res) {
                        if (err) throw err;
                    });
                    db.close();
                });
                console.log('sukses sync ke db local');

                MongoClient_online.connect(url_online, function(err, db) {
                    if (err) throw err;
                    var dbo = db.db(dbName_online);
                    dbo.collection(colName_online).dropIndexes();
                    dbo.collection(colName_online).deleteMany(function(err, obj) {
                        if (err) throw err;
                    });
                    dbo.collection(colName_online).insertMany(hasil_gabung, function(err, res) {
                    if (err) throw err;
                    });
                    db.close();
                });
                console.log('sukses sync ke db online');
            }
        });
    });
}

function getdatabaseOffline(callback){
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(dbName);
        dbo.collection(colName).find({}).toArray(function(err, result) {
        if (err) throw err;
        db.close();
        return callback(result);
        });
    });
}

function getdatabaseOnline(callback){
    MongoClient_online.connect(url_online, function(err, db) {
        if (err) throw err;
        var dbo = db.db(dbName_online);
        dbo.collection(colName_online).find({}).toArray(function(err, result) {
        if (err) throw err;
        db.close();
        return callback(result);
        });
    });
}

function removeDuplicates( arr, prop ) {
    var obj = {};
    for ( var i = 0, len = arr.length; i < len; i++ ){
      if(!obj[arr[i][prop]]) obj[arr[i][prop]] = arr[i];
    }
    var newArr = [];
    for ( var key in obj ) newArr.push(obj[key]);
    return newArr;
}