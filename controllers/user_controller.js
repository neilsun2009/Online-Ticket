var crypto = require('crypto'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Scene = mongoose.model('Scene');
function hashPW(pwd) {
    return crypto.createHash('sha256').update(pwd).digest('base64').toString();
}
exports.signup = function(req, res) {
    var user = new User({
        username: req.body.username,
        password: hashPW(req.body.password),
        access: 0
    });
    user.save(function(err) {
        if (err) {
            req.session.msg = err;
            // res.redirect('/signup');
            res.json({
                message: 'username already exist',
                data: null,
                result: false
            });
        } else {
            req.session.user = user._id;
            req.session.msg = 'Authenticated as ' + user.username;
            // res.redirect('/');
            res.json({
                message: 'user signed up successfully',
                data: null,
                result: true
            });
        }
    });
};
exports.login = function(req, res) {
    User.findOne({username: req.body.username})
        .exec(function(err, user) {
            var historyUrl = req.session.history || '/';
            if (!user) {
                err = 'User not found.';
            } else if (user.password !== hashPW(req.body.password.toString())) {
                err = 'Authentication failed.';
            } else {
                req.session.regenerate(function() {
                    req.session.user = user.id;
                    req.session.msg = 'Authenticated as ' + user.username;
                    // console.log('successfully logged in');
                    // console.log(req.session);
                    res.redirect(historyUrl);
                });
            }
            if (err) {
                req.session.regenerate(function() {
                    req.session.msg = err;
                    req.session.history = historyUrl;
                    res.redirect('/login');
                });
            }
        });
};
exports.logout = function(req, res) {
    req.session.regenerate(function() {
        req.session.msg = 'logged out';
        res.redirect('/');
    });
};
exports.loginAdmin = function(req, res) {
    User.findOne({username: req.body.username})
        .exec(function(err, user) {
            if (!user) {
                err = 'User not found.';
            } else if (user.password !== hashPW(req.body.password.toString()) || user.access !== 1) {
                err = 'Authentication failed.';
            } else {
                req.session.regenerate(function() {
                    req.session.user = user.id;
                    req.session.access = 'administrator';
                    req.session.msg = 'Authenticated as ' + user.username;
                    // console.log('successfully logged in');
                    // console.log(req.session);
                    res.redirect('/admin');
                });
            }
            if (err) {
                req.session.regenerate(function() {
                    req.session.msg = err;
                    res.redirect('/admin_login');
                });
            }
        });
};
// not tested
exports.updateUser = function(req, res) {
    User.findOne({_id: req.session.user})
        .exec(function(err, user) {
            user.set('password', hashPW(req.body.password));
            user.set('access', req.body.access);
            user.save(function(err) {
                if (err) {
                    req.session.msg = err;
                } else {
                    req.session.msg = 'User updated.';
                }
                res.redirect('/login');
            });
        });
};
exports.deleteUser = function(req, res) {
    User.findOne({_id: req.session.user})
        .exec(function(err, user) {
            if (user) {
                user.remove(function(err) {
                    if (err) {
                        req.session.msg = err;
                        res.redirect('/login');
                    } else {
                        req.session.destroy(function(){
                            res.redirect('/login');
                        });
                    }
                });
            } else {
                req.session.msg = 'User not found.';
                req.session.destroy(function(){
                    res.redirect('/login');
                });
            }
        });
};

exports.getUser = function(req, res) {
    // requires logged in
    if (!req.session.user) {
        req.session.msg = 'Please login to proceed.';
        res.redirect('/login');
    } else {
        User.findOne({_id: req.session.user}).select({__v: 0, password: 0})
            .exec(function(err, user) {
                // console.log(user);
                var ids = [];
                if (user) {
                    if (Array.isArray(user.scenes)) {
                        ids = user.scenes.map(function(item, index, array) {
                            return item.sceneid;
                        });
                    }
                    Scene.find().where('_id').in(ids).sort({time: 1})
                        .exec(function(err, scenes) {
                            res.json({
                                message: 'get user success',
                                data: user,
                                scenes: scenes,
                                result: true
                            });
                        });
                } else {
                    res.json({
                        message: 'no user found',
                        data: null,
                        result: false
                    });
                }
            });
    }
};