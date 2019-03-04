const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const config = require('./config/database');
const passport = require('passport');
const mcache = require('memory-cache');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
}));
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());
app.get('*', function(req, res, next){
	res.locals.user = req.user || null;
	next();
});
app.set('views', path.join(__dirname, 'views'));
app.set('view engine','pug');
let users = require('./routes/users');
app.use('/', users);
app.listen(3000, function(){
	console.log('Server Started on port 3000..');
});