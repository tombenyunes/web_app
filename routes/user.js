module.exports = function (app)
{
    const utils = require('../lib/utils.js');
    const { userValidation } = require('../lib/checks');
    const { validationResult } = require('express-validator/src/validation-result');

    // form to collect name, username, email, password
    app.get('/register', function (req, res) {
        res.render('register.html', { admin: false });
    });

    app.get('/registeradmin', function (req, res) {
        res.render('register.html', { admin: true });
    });

    // validates form input and adds necessary details to database
    app.post('/registered', userValidation, function (req, res) // <--- checks if email is valid && password >= 8 chars
    {
        const errors = validationResult(req);
        if (!errors.isEmpty()) { // if validation fails, redirect to register page
            res.redirect('./register');
        }
        else {
            var MongoClient = require('mongodb').MongoClient;
            var url = process.env.DATABASE_PATH;

            const bcrypt = require('bcrypt');
            const saltRounds = 10; // time needed to calculate hash
            const plainPassword = req.sanitize(req.body.password); // sanitize password

            bcrypt.hash(plainPassword, saltRounds, function (err, hashedPassword) { // hash password				
                MongoClient.connect(url, function (err, client) {
                    if (err) throw err;
                    var db = client.db(process.env.DATABASE_NAME);
                    db.collection(process.env.COLLECTION_USERS).insertOne({	// insert user data into database
                        first: req.body.first,
                        last: req.body.last,
                        username: req.body.username,
                        email: req.body.email,
                        hashedpassword: hashedPassword, // hashed password
                        admin: req.body.admin // (bool) gives special privileges
                    });
                    client.close();
                    let title = 'Account Created';
                    let message = 'Your username is: "' + req.body.username + '", and your email is: "' + req.body.email + '".';
                    res.render('templates/messageTemplate.html', { title: title, message: message, multipleMessages: false, color: '#6a9955' });
                });
            });
        }
    });

    // form to collect username, password
    app.get('/login', function (req, res) {
        res.render('login.html');
    });

    // compare username and password against database, and login or show error
    app.post('/loggedin', function (req, res) {
        var MongoClient = require('mongodb').MongoClient;
        var url = process.env.DATABASE_PATH;

        MongoClient.connect(url, function (err, client) {
            if (err) throw err;
            var db = client.db(process.env.DATABASE_NAME);
            db.collection(process.env.COLLECTION_USERS).findOne({ username: req.body.username }, function (err, result) { // check if username occurs in database
                if (!result) {
                    let title = 'Login Failed!';
                    let message = 'Username "' + req.body.username + '" does not exist. Please try again.'; // error message
                    res.render('templates/messageTemplate.html', { title: title, message: message, multipleMessages: false, color: '#ce723b' });
                }
                else {
                    const bcrypt = require('bcrypt');
                    const plainPassword = req.body.password;
                    const hashedPassword = result.hashedpassword;
                    const isAdmin = result.admin;
                    bcrypt.compare(plainPassword, hashedPassword, function (err, result) { // if username exists, decrypt hashed password and compare
                        if (result) {

                            req.session.userId = req.body.username;
                            req.session.isAdmin = isAdmin;

                            let title = 'Login Successful!';
                            let message = 'Login successful for "' + req.body.username + '". You can now access all pages.'; // success message
                            res.render('templates/messageTemplate.html', { title: title, message: message, multipleMessages: false, color: '#6a9955' });
                        }
                        else {
                            let title = 'Login Failed!';
                            let message = 'Password incorrect for "' + req.body.username + '". Please try again.'; // error message
                            res.render('templates/messageTemplate.html', { title: title, message: message, multipleMessages: false, color: '#ce723b' });
                        }
                    });
                }
            });
            client.close();
        });
    });

    // destroy session id
    app.get('/logout', utils.redirectLogin, (req, res) => {
        req.session.destroy(err => { // destroy session
            if (err) {
                return res.redirect('./'); // redirect to home page if error occurs
            }
            let title = 'Logout Successful!';
            let message = 'You are now logged out. If you want access to all pages, please login'; // success message
            res.render('templates/messageTemplate.html', { title: title, message: message, multipleMessages: false, color: '#6a9955' });
        });
    });

    // form to collect username of account to delete
    app.get('/deleteuser', utils.redirectLogin, function (req, res) {
        res.render('deleteuser.html');
    });

    // if username exists, delete account, otherwise show error
    app.post('/deleteduser', function (req, res) {
        var MongoClient = require('mongodb').MongoClient;
        var url = process.env.DATABASE_PATH;

        MongoClient.connect(url, function (err, client) {
            if (err) throw err;
            var db = client.db(process.env.DATABASE_NAME);
            db.collection(process.env.COLLECTION_USERS).findOne({ username: req.body.username }, function (err, result) { // check if username occurs in database
                if (err) throw err;
                if (!result) {
                    let title = 'Error';
                    let message = 'Username "' + req.body.username + '" does not exist.';
                    res.render('templates/messageTemplate.html', { title: title, message: message, multipleMessages: false, color: '#ce723b' }); // error message
                }
                else {
                    db.collection(process.env.COLLECTION_USERS).deleteOne({ 'username': req.body.username }, function (err, result) { // delete necessary account
                        if (err) throw err;
                    });
                    let title = 'Account Deleted';
                    let message = req.body.username + ' has successfully been deleted from the database.'; // success message
                    res.render('templates/messageTemplate.html', { title: title, message: message, multipleMessages: false, color: '#6a9955' });
                    client.close();
                }
            });
        });
    });

    // list all users in collection
    app.get('/listusers', utils.redirectLogin, function (req, res) {
        var MongoClient = require('mongodb').MongoClient;
        var url = process.env.DATABASE_PATH;
        MongoClient.connect(url, function (err, client) {
            if (err) throw err;
            var db = client.db(process.env.DATABASE_NAME);
            db.collection(process.env.COLLECTION_USERS).find().toArray((findErr, results) => // find all users
            {
                if (findErr) throw findErr;
                else
                    res.render('listusers.html', { users: results }); // display list
                client.close();
            });
        });
    });
}