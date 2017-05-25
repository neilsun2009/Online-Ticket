var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    UserSchema = new Schema({
        username: {type: String, unique: true, required: true},
        password: {type: String, required: true},
        access: {type: Number, required: true},
        scenes: [{sceneid: Schema.Types.ObjectId, num: Number}]
    }, {collection: 'users'});
mongoose.model('User', UserSchema);