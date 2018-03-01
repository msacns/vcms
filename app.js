var env = process.env.NODE_ENV || 'development';

var express       = require('express');
var path          = require('path');
var favicon       = require('serve-favicon');
var logger        = require('morgan');
var cookieParser  = require('cookie-parser');
var bodyParser    = require('body-parser');
var session       = require('cookie-session');
var mongoose      = require('mongoose');
var config        = require('./config/config')[env];
var passport      = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var helpers       = require('view-helpers');


global.config = config;
global.version = '1.0.0';

var index = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//MongoDB
mongoose.Promise = global.Promise;
mongoose.connect(config.db);
mongoose.connection.on('connected', () => {
    return console.log('Mongoose conectado');
});
mongoose.connection.on('disconnected', () => {
    return console.log('Mongoose desconectado');
});
mongoose.connection.on('error', error => {
    return console.log('Mongoose erro de conexão: ' + error);
});

//Middlewares
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({keys: [config.crypto.secret]}));

//*********************************************************************************************
app.use(require('connect-flash')())
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res)
  next()
})
//*********************************************************************************************  
app.use(helpers('VCSM'));
// Configure passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Configure passport-local to use account model for authentication
var Account = require('./models/Account');
passport.use(new LocalStrategy(Account.authenticate()));

passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Não encontrado');
  err.status = 404;
  next(err);
});

var notAuthorized = {
    flashType: 'error',
    message: 'Acesso Negado',
    redirect: '/errors/403',
    status: 403
};
 
var notAuthenticated = {
    flashType: 'error',
    message: 'Usuário ou senha inválidos',
    redirect: '/login'
};

app.set('permission', {
    role: 'role',
    notAuthorized: notAuthorized,
    notAuthenticated: notAuthenticated 
});

// Set Service Scope for Intercharge messages
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
})

// error handler
app.use(function(err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // render the error page
        res.status(err.status || 500);
        res.render('error');
    });


module.exports = app;