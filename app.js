const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const staticAsset = require('static-asset');
const mongoose = require('mongoose');

const config = require('./config');
const routes = require('./routes');

// const Post = require('./models/post');

// database
mongoose.set('debug', config.IS_PRODUCTION);
mongoose.connect(config.MONGO_URL, {useNewUrlParser: true}).then(
    () => {
        console.log('Successfully connected!');
    },
    err => console.log(err)
);

const app = express();

// sets and uses
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(staticAsset(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

//routers
app.get('/', (req, res) => {
    res.render('index');
});

app.use('/auth', routes.auth);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.render('error', {
        message: error.message,
        error: !config.IS_PRODUCTION ? error : {}
    });
});

app.listen(config.PORT, () =>
    console.log(`App listening on port ${config.PORT}!`)
);