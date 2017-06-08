var express = require('express'),
    mongoose = require('mongoose'),
    http = require('http'),
    crypto = require('crypto');
module.exports = function(app) {
    var users = require('./controllers/user_controller'),
        movies = require('./controllers/movie_controller'),
        scenes = require('./controllers/scene_controller');
    // app.all('*', function(req, res, next) {
    //     res.header("Access-Control-Allow-Origin", "*");
    //     res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    //     res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    //     res.header("X-Powered-By",' 3.2.1');
    //     next();
    // });
    app.use('/', express.static('./statics'));
    app.get('/', function(req, res) {
        // console.log(req);
        res.render('index.html');
    });
    app.get('/me', function(req, res) {
        if (req.session.user) {
            res.render('me.html');
        } else {
            // console.log(req.originalUrl);
            // req.session.history = req.path;
            res.redirect('/login');
        }
    });
    app.get('/404', function(req, res) {
        res.render('404.html');
    });
    app.get('/admin', function(req, res) {
        // console.log(req.session);
        if (req.session.user && req.session.access) {
            res.render('admin/admin.html');
        } else {
            req.session.msg = 'Access Denied';
            res.redirect('/admin_login');
        }
    });
    app.get('/admin_login', function(req, res) {
        if (req.session.user && req.session.access) {
            res.redirect('/admin');
        } else {
            res.render('admin/login.html', {msg: req.session.msg});
        }
    });
    app.get('/admin_logout', function(req, res) {
        req.session.destroy(function() {
            res.redirect('/');
        }) ;
    });
    app.get('/signup', function(req, res) {
        if (req.session.user) {
            res.redirect('/');
        } else {
            res.render('signup.html', {msg: req.session.msg});
        }
    });
    app.get('/login', function(req, res) {
        // console.log(req.path);
        if (req.session.user) {
            res.redirect('/');
        } else {
            res.render('login.html', {msg: req.session.msg});
        }
    });
    app.get('/logout', function(req, res) {
        req.session.destroy(function() {
            res.redirect('/');
        }) ;
    });
    app.get('/api/user', users.getUser);
    app.get('/api/scene', scenes.getScene);
    app.get('/api/scenes', scenes.getScenes);
    app.get('/api/movie', movies.getMovie);
    app.get('/api/movies', movies.getMovies);
    app.get('/*', function(req, res) {
        res.redirect('/404');
    });
    app.post('/api/signup', users.signup);
    // too dangerous to open, not tested
    // app.post('/api/update_user', users.updateUser);
    // app.post('/api/delete_user', users.deleteUser);
    app.post('/api/login', users.login);
    app.post('/api/login_admin', users.loginAdmin);
    app.post('/api/add_scene', scenes.addScene);
    app.post('/api/update_scene', scenes.updateScene);
    app.post('/api/delete_scene', scenes.deleteScene);
    app.post('/api/buy_ticket', scenes.buyTicket);
    app.post('/api/add_movie', movies.addMovie);
    app.post('/api/delete_movie', movies.deleteMovie);
    app.post('/api/update_movie', movies.updateMovie);
};