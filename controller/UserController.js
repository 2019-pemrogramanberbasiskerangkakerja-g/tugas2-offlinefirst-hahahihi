// Controller User

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const passportoff = require('../config/passport-offline');
const loki = require('lokijs');
var db = new loki('db.db');
var usersdb = db.addCollection('users');
var mongoose = require('mongoose');

//import model
let Users = require('../models/user');

exports.register_form = function(req, res){
	res.render('user/user_register');
};

exports.register_action = function(req, res){

	//menangkap value dari form
	const username = req.body.username;
	const password = req.body.password;;
	console.log(mongoose.connection.readyState);
	if(mongoose.connection.readyState == 0){
		usersdb.insert({username:username,password:password});
		req.flash('success', 'Telah teregistrasi, silahkan Login');
		res.redirect('/');		
	}

	usersdb.insert({username:username,password:password});

	if (0) {
		res.render('user/user_register',{
			errors:errors
		});
	}else {
		let newUser = new Users({
			username:username,
			password:password
		});

		//merubah password -> hash dengan bcrypt
		bcrypt.genSalt(10, function(err,salt){
			bcrypt.hash(newUser.password, salt, function(err, hash){
				if (err) {
					console.log(err);
				}
				newUser.password = hash;
				newUser.save(function(err){
					if (err) {
						console.log(err);
						return;
					}else {
						req.flash('success', 'Telah teregistrasi, silahkan Login');
						res.redirect('/');
					}
				})
			});
		});
	}
};

exports.login_form = function(req, res){
	console.log('====== ISI DB LOKAL======');
	var result = usersdb.chain().simplesort("name").data();
	console.log(result);
	console.log('====== ISI DB LOKAL BERHASIL ======');
	res.render('user/user_login');
};

exports.login_action = function(req, res, next){
	//validasi login

	console.log(mongoose.connection.readyState);

	var usernamedb = req.body['username'];
	var passworddb = req.body['password'];
	var result = usersdb.find({username:usernamedb});

	console.log('=======LOGIN======');
	if(result[0] == null && mongoose.connection.readyState == 0){
		console.log('hehe');
		req.flash('danger', 'User not found');
		res.redirect('/');		
	}else if(result[0] != null && mongoose.connection.readyState == 0){
		req.body['username'] = result[0]['username'];
		req.body['password'] = result[0]['password'];
		req.login(req, function(err) {
		  if (err) { return next(err); }
			passport.serializeUser(function(user, done) {
			  done(null, user);
			});

			passport.deserializeUser(function(user, done) {
			  done(null, user);
			});		
		  return res.redirect('/home');
		});

	}else{
		req.body['username'] = result[0]['username'];
		req.body['password'] = result[0]['password'];

		passport.authenticate('local',{
			successRedirect:'/home',
			failureRedirect:'/',
			failureFlash: true
		})(req, res, next);	
	}
};

exports.logout = function(req, res){
	req.logout();
	req.flash('success', 'Anda telah Keluar');
	res.redirect('/');
};

exports.home = function(req, res){
	res.render('user/user_home');
};



