var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
module.exports = app;

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('db/sqlite.db', (err) => {
    if (err) {
        return console.error(err.message);
    }
    else {
        console.log('Connected to the SQLite database.');
    }
});

db.run('CREATE TABLE IF NOT EXISTS TomatoPrices (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT , price REAL )', (err) => {
    if (err) {
        console.error(err.message);
    }
});

app.get('/query', (req, res) => {
    const { date, showAll } = req.query;
    let query = 'SELECT * FROM TomatoPrices WHERE date = ?';
    let params = [date];

    if (showAll === 'true') {
        query = 'SELECT * FROM TomatoPrices';
        params = [];
    }

    db.all(query, params, (err, rows) => {
        if (err) {
            console.error('Database query error:', err.message);
            res.status(500).send('Internal server error');
            return;
        }
        res.send(rows);
    });
});

module.exports = app;
