var express = require('express');
var sanitizer = require('express-sanitizer');
var session = require('express-session');
const dotenv = require('dotenv').config(); // .env constants
var bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT;

app.use(express.static(__dirname + '/public'));     // css styling
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());     // parsing body data
app.use(sanitizer());       // express sanitisation
app.use(session({
    secret: 'somerandomstuffs',
    resave: false,                  // for user sessions
    saveUninitialized: false,
    cookie: { expires: 600000 }
}));

var MongoClient = require('mongodb').MongoClient;
var url = process.env.DATABASE_PATH + "/calorieBuddyDB";
MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    console.log("calorieBuddyDB connected");
    db.close();
});

// routing
require('./routes/main')(app);
require('./routes/user')(app);
require('./routes/food')(app);
require('./routes/admin')(app);
require('./routes/api')(app);

// views and templating
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.listen(port, () => console.log(`calorieBuddy listening on port ${port}!`))