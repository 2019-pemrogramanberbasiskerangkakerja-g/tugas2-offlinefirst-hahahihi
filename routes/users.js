//Routes Users

const express = require('express');
const router = express.Router();

const UserController = require('../controller/UserController');


function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}else {
		req.flash('danger', 'Login first!');
		res.redirect('/');
	}
}

router.get('/register', UserController.register_form);
router.post('/register', UserController.register_action);
router.get('/', UserController.login_form);
router.post('/login', UserController.login_action);
router.get('/logout', UserController.logout);
router.get('/home', ensureAuthenticated, UserController.home);

module.exports = router;
