var express = require('express');
var sanitizer = require('express-sanitizer');
var session = require('express-session');
const dotenv = require('dotenv').config();
var bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT;

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(sanitizer());
app.use(session({
    secret: 'somerandomstuffs',
    resave: false,
    saveUninitialized: false,
    cookie: { expires: 600000 }
}));

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost/calorieBuddyDB";
MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    console.log("calorieBuddyDB connected");
    db.close();
});

// require('./routes/utils')(app);
require('./routes/main')(app);
require('./routes/user')(app);
require('./routes/food')(app);
require('./routes/admin')(app);
require('./routes/api')(app);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.listen(port, () => console.log(`calorieBuddy listening on port ${port}!`))