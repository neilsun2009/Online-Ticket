var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    MovieSchema = new Schema({
        title: {type: String, required: true},
        length: {type: Number, required: true},
        ratings: [{source: String, rating: Number}],
        poster: String
    }, {collection: 'movies'});

mongoose.model('Movie', MovieSchema);