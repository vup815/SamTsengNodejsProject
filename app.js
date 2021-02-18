const createError = require('http-errors');
(express = require('express')),
  (path = require('path')),
  (logger = require('morgan')),
  (redis = require('redis')),
  (mongoose = require('mongoose')),
  (session = require('express-session')),
  (memberRouter = require('./routes/memberRoute')),
  (productRouter = require('./routes/productRoute')),
  (cartRouter = require('./routes/cartRoute')),
  (orderRouter = require('./routes/orderRoute')),
  (indexRouter = require('./routes/index')),
  (mongoDB = 'mongodb://localhost/nodeJsProject_shopping'),
  (app = express()),
  (RedisStore = require('connect-redis')(session)),
  (redisClient = redis.createClient());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
  })
);
app.use('/', indexRouter);
app.use('/orders', orderRouter);
app.use('/products', productRouter);
app.use('/members', memberRouter);
app.use('/carts', cartRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
module.exports = app;
