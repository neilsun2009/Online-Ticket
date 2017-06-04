var mongoose = require('mongoose'),
    Scene = mongoose.model('Scene'),
    User = mongoose.model('User');
exports.addScene = function(req, res) {
    // need a valid admin account
    var scene;
    if (!req.session.user || req.session.access !== 'administrator') {
        req.session.msg = 'Please login to proceed.';
        res.redirect('/admin_login');
    } else {
        // console.log(req.body.time);
        scene = new Scene({
            time: req.body.time,
            price: req.body.price,
            seat: req.body.seat,
            remain: req.body.seat,
            movieid: req.body.movieid,
            movietitle: req.body.movietitle
        });
        scene.save(function(err, scene) {
            if (err) {
                // console.log(err);
                res.json({
                    message: 'add scene failed',
                    data: err,
                    result: false
                })
            } else {
                res.json({
                    message: 'add scene succeeded',
                    data: scene,
                    result: true
                })
            }
        });
    }
};

exports.updateScene = function(req, res) {
    // requires admin logged in
    if (!req.session.user || req.session.access !== 'administrator') {
        req.session.msg = 'Please login to proceed.';
        res.redirect('/admin_login');
    } else {
        Scene.findOne({_id: req.body.sceneid})
            .exec(function(err, scene) {
                if (scene) {
                    scene.update({$set: {
                        time: req.body.time,
                        seat: req.body.seat,
                        price: req.body.price,
                        remain: req.body.remain,
                        movieid: req.body.movieid,
                        movietitle: req.body.movietitle
                    }}).exec(function(err, results) {
                        if (err) {
                            res.json({
                                message: 'update scene failed',
                                data: err,
                                result: false
                            });
                        } else {
                            res.json({
                                message: 'update scene succeeded',
                                data: results,
                                result: true
                            });
                        }
                    });
                } else {
                    res.json({
                        message: 'no scene found',
                        data: err,
                        result: false
                    });
                }

            });
    }
};
exports.deleteScene = function(req, res) {
    // requires admin logged in
    if (!req.session.user || req.session.access !== 'administrator') {
        req.session.msg = 'Please login to proceed.';
        res.redirect('/admin_login');
    } else {
        Scene.findOne({_id: req.body.sceneid})
            .exec(function(err, scene) {
                if (scene) {
                    scene.remove(function(err, deletedScene) {
                        if (err) {
                            res.json({
                                message: 'scene deletion failed',
                                data: err,
                                result: false
                            });
                        } else {
                            res.json({
                                message: 'scene deletion succeeded',
                                data: deletedScene,
                                result: false
                            });
                        }
                    });
                } else {
                    res.json({
                        message: 'scene not found',
                        data: err,
                        result: false
                    });
                }
            });
    }
};
// using id get one scene
exports.getScene = function(req, res) {
    Scene.findOne({_id: req.query.sceneid})
        .exec(function(err, scene) {
            if (scene) {
                res.json({
                    message: 'get scene succeeded',
                    data: scene,
                    result: true
                });
            } else {
                res.json({
                    message: 'no scene found',
                    data: null,
                    result: false
                });
            }
        });
};
// get multiple scenes
exports.getScenes = function(req, res) {
    var queryCount = Scene.count();
    // console.log(req.query);
    queryCount.exec(function(err, count) {
        var query = Scene.find();
        query.exec(function(err, scenes) {
            if (scenes) {
                res.json({
                    message: 'get scenes succeeded',
                    data: scenes,
                    count: count,
                    result: true
                })
            } else {
                res.json({
                    message: 'no scene found',
                    data: err,
                    result: false
                })
            }
        });
    });
};
// buy ticket
exports.buyTicket = function(req, res) {
    // requires logged in
    if (!req.session.user) {
        req.session.msg = 'Please login to proceed.';
        res.json({
            message: 'no user logged in',
            data: null,
            result: false
        });
    } else {
        Scene.findOne({_id: req.body.sceneid})
            .exec(function(err, scene) {
                if (scene) {
                    if (scene.remain >= req.body.num) {
                        scene.update({$inc: {
                            remain: -req.body.num
                        }}).exec(function(err, results) {
                            if (err) {
                                res.json({
                                    message: 'update scene failed',
                                    data: err,
                                    result: false
                                });
                            } else {
                                User.findOne({_id: req.session.user})
                                    .exec(function(err, user) {
                                        var scenes = user.scenes;
                                        if (Array.isArray(scenes)) {
                                            scenes.push({sceneid: scene._id, num: req.body.num});
                                        } else {
                                            scenes = [{sceneid: scene._id, num: req.body.num}];
                                        }
                                        // console.log('before1：' + scenes);
                                        // before.push({sceneid: scene._id, num: req.body.num});
                                        // console.log('before2: ' + before);
                                        user.update({$set: {
                                            scenes: scenes
                                        }}).exec(function(err, results) {
                                            // console.log('after: ' + user.scenes);
                                            res.json({
                                                message: 'buy tickets succeeded',
                                                data: results,
                                                result: true
                                            });
                                        });
                                    });
                            }
                        });
                    } else {
                        res.json({
                            message: 'no enough tickets available',
                            data: scene.remain,
                            result: false
                        });
                    }
                } else {
                    res.json({
                        message: 'no scene found',
                        data: err,
                        result: false
                    });
                }

            });
    }
};