require('dotenv').config();
const path = require('path');
const express = require('express');

//A library that helps us log the requests in the console
const logger = require('morgan');

// Used to setthe favicon for our app
const favicon = require('serve-favicon');

const cookieParser = require('cookie-parser');
const hbs = require('hbs');
const mongoose = require('mongoose');

// Set up the database
require('./configs/db.config');

// Routers
const indexRouter = require('./routes/index.routes');

const app = express();

// Express View engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));

// setting up the middleware to let it know where to find the favicon icon
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// Sets up morgan in our middleware so that we can see the requests getting logged
app.use(logger('dev'));

// a body parser to allow us to parse form submissions
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// helps us use the cookies from each request
app.use(cookieParser());

//allows us to use express session
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
 
app.use(session({
    secret: 'NotMyAge',
    saveUninitialized: false, 
    resave: false,
    cookie : {
        maxAge: 24*60*60*1000 //in milliseconds
    }, 
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24*60*60 //in seconds = 1day 
    })
}));

// Routes middleware
app.use('/', indexRouter);

const authRoutes = require('./routes/auth.routes')
app.use('/', authRoutes)

module.exports = app;




