const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const userRoutes = require('./api/routes/user');
const projectsRoutes = require('./api/routes/projects');
const technologyStackRoutes = require('./api/routes/technologyStack');
const urlCredentialRoutes = require('./api/routes/urlCredential');

mongoose.Promise = global.Promise;

mongoose.connect(
    'mongodb://172.16.7.101/CaseStudyMDB'
);

// The :status token will be colored-
// red: server error codes
// yellow: client error codes
// cyan: redirection codes
// uncolored: all other codes.
app.use(morgan('dev'));

app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if(req.method === 'OPTIONS') {
        res.header(
            "Access-Control-Allow-Methods",
            'GET, POST, PUT, PATCH, DELETE'
        );
        return res.status(200).json({});
    }
    next();
});


app.use((req, res, next) => {
    console.log(req.ip);
    next();
});

app.use('/user', userRoutes);
app.use('/projects', projectsRoutes);
app.use('/technologyStack', technologyStackRoutes);
app.use('/urlCredential', urlCredentialRoutes);

// If no route found
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    console.log(error);
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;