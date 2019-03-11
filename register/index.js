var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mergeArray = require('merge-array');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const port = 8000;

const MongoClient_online = require('mongodb').MongoClient;
const url_online = 'mongodb://localhost:27017';
const dbName_online = 'pbkk_online';
const colName_online = 'users';

app.get('/', function (req, res) {
  res.render('register.ejs');
});

app.post('/register', urlencodedParser ,function (req, res) {        
  if(!req.body.username || !req.body.password){
      res.redirect('/register');
  }
  response = {
      username:req.body.username,
      password:req.body.password
  };
  MongoClient_online.connect(url_online, function(err, db) {
      if (err){
          console.log('tidak ada koneksi ke db online');
      }else{
          var dbo = db.db(dbName_online);
          var query = { username: response.username, password: response.password };
          dbo.collection(colName_online).insertOne(query, function(err, res) {
            if (err) throw err;
            db.close();
          });         
      }
  });
  res.send('berhasil register');
});
app.listen(port, () => console.log(`app berjalan di port ${port}!`))
