const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const redis = require('redis');
const mongoose = require('mongoose');
const mongoDB = 'mongodb://localhost/nodeJsProject_shopping';
const session = require('express-session');
const memberRouter = require('./routes/memberRoute');
const productRouter = require('./routes/productRoute');
const cartRouter = require('./routes/cartRoute');
const indexRouter = require('./routes/index');
const app = express();

const RedisStore = require('connect-redis')(session);
const redisClient = redis.createClient();

const productController = require('./controllers/productController');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  store: new RedisStore({client: redisClient}),
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));
app.use('/products', productRouter);
app.use('/members', memberRouter)
app.use('/carts', cartRouter);
app.use('/', indexRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
module.exports = app;
