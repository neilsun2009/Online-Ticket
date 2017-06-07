var mongoose = require('mongoose'),
    Movie = mongoose.model('Movie'),
    Scene = mongoose.model('Scene');
exports.addMovie = function(req, res) {
    // need a valid admin account
    var movie;
    if (!req.session.user || req.session.access !== 'administrator') {
        req.session.msg = 'Please login to proceed.';
        res.redirect('/admin_login');
    } else {
        // console.log(req.body);
        movie = new Movie({
            title: req.body.title,
            length: req.body.length,
            poster: req.body.poster,
            ratings: req.body.ratings
            // url: req.body.url
        });
        movie.save(function(err, movie) {
            if (err) {
                // console.log(err);
                res.json({
                    message: 'add movie failed',
                    data: err,
                    result: false
                })
            } else {
                res.json({
                    message: 'add movie succeeded',
                    data: movie,
                    result: true
                })
            }
        });
    }
};

exports.updateMovie = function(req, res) {
    // requires admin logged in
    if (!req.session.user || req.session.access !== 'administrator') {
        req.session.msg = 'Please login to proceed.';
        res.redirect('/admin_login');
    } else {
        Movie.findOne({_id: req.body.movieid})
            .exec(function(err, movie) {
                if (movie) {
                    movie.update({$set: {
                        title: req.body.title,
                        length: req.body.length,
                        poster: req.body.poster,
                        ratings: req.body.ratings
                    }}).exec(function(err, results) {
                        if (err) {
                            res.json({
                                message: 'update movie failed',
                                data: err,
                                result: false
                            });
                        } else {
                            res.json({
                                message: 'update movie succeeded',
                                data: results,
                                result: true
                            });
                        }
                    });
                } else {
                    res.json({
                        message: 'no movie found',
                        data: err,
                        result: false
                    });
                }

            });
    }
};
exports.deleteMovie = function(req, res) {
    // requires admin logged in
    if (!req.session.user || req.session.access !== 'administrator') {
        req.session.msg = 'Please login to proceed.';
        res.redirect('/admin_login');
    } else {
        Movie.findOne({_id: req.body.movieid})
            .exec(function(err, movie) {
                if (movie) {
                    movie.remove(function(err, deletedMovie) {
                        if (err) {
                            res.json({
                                message: 'movie deletion failed',
                                data: err,
                                result: false
                            });
                        } else {
                            res.json({
                                message: 'movie deletion succeeded',
                                data: deletedMovie,
                                result: true
                            });
                        }
                    });
                } else {
                    res.json({
                        message: 'movie not found',
                        data: err,
                        result: false
                    });
                }
            });
    }
};
// using id get one movie
exports.getMovie = function(req, res) {
    Movie.findOne({_id: req.query.movieid})
        .exec(function(err, movie) {
            if (movie) {
                Scene.find({movieid: req.query.movieid}).sort({time: 1})
                    .exec(function(err, scenes) {
                        res.json({
                            message: 'get movie succeeded',
                            data: movie,
                            scenes: scenes,
                            result: true
                        });
                    })
            } else {
                res.json({
                    message: 'no movie found',
                    data: null,
                    result: false
                });
            }
        });
};
// get multiple movies
exports.getMovies = function(req, res) {
    var queryCount = Movie.count();
    // console.log(req.query);
    queryCount.exec(function(err, count) {
        var query = Movie.find();
        query.exec(function(err, movies) {
            if (movies) {
                res.json({
                    message: 'get movies succeeded',
                    data: movies,
                    count: count,
                    result: true
                })
            } else {
                res.json({
                    message: 'no movie found',
                    data: err,
                    result: false
                })
            }
        });
    });
};