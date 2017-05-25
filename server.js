var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    cookieParser = require('cookie-parser'),
    expressSession = require('express-session'),
    MongoStore = require('connect-mongo')({session: expressSession}),
    db = mongoose.connect("mongodb://ticketAdmin:passwordTICKET@localhost/ticket"),
    app = express();
mongoose.Promise = global.Promise;
require('./models/movie_model.js');
require('./models/user_model.js');
require('./models/scene_model.js');
app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/statics');
app.set('view engine', 'html');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser());
app.use(expressSession({
    secret: 'PMLHOMEWORKSEKRET',
    cookie: {maxAge: 60*60*1000},
    store: new MongoStore({
        mongooseConnection: mongoose.connection,
        collection: 'sessions'
    }),
    resave: false,
    saveUninitialized: true
}));
require('./routes')(app);
app.listen(3030);
// 119.29.132.18:3030
// admin:ADMINadmin