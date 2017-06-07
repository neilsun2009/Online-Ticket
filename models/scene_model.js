var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    SceneSchema = new Schema({
        time: {type: String, required: true},
        price: {type: Number, required: true},
        seat: {type: Number, required: true},
        remain: {type: Number, required: true},
        movieid: {type: Schema.Types.ObjectId, required: true},
        movietitle: {type: String, required: true},
        _movie: {type: Schema.Types.ObjectId, ref: 'Movie'}
    }, {collection: 'scenes'});
mongoose.model('Scene', SceneSchema);