module.exports = function (app)
{
    const utils = require('../lib/utils.js');
    const { userValidation } = require('../lib/checks');
    const { validationResult } = require('express-validator/src/validation-result');

    // form to collect food name and price
    app.get('/addfood', utils.redirectLogin, function (req, res) {
        res.render("addfood.html", { username: req.session.userId });
    });

    // add food to database
    app.post('/foodadded', function (req, res) {
        var MongoClient = require('mongodb').MongoClient;
        var url = process.env.DATABASE_PATH;

        MongoClient.connect(url, function (err, client) {
            if (err) throw err;
            var db = client.db(process.env.DATABASE_NAME);
            db.collection(process.env.COLLECTION_FOODS).insertOne({ // insert food name and price into database
                name: req.body.name,
                price: req.body.price
            });
            client.close();
            let title = 'Food Added';
            let message = 'Food has been added to the database, name: "' + req.body.name + '", price £' + req.body.price + '.'; // success message
            res.render('templates/messageTemplate.html', { title: title, message: message, multipleMessages: false, color: '#6a9955' });
        });
    });

	// list all foods in collection
	app.get('/listfoods', utils.redirectLogin, function (req, res)
	{
		var MongoClient = require('mongodb').MongoClient;
		var url = process.env.DATABASE_PATH;
		MongoClient.connect(url, function (err, client)
		{
			if (err) throw err;
			var db = client.db(process.env.DATABASE_NAME);
			db.collection(process.env.COLLECTION_FOODS).find().toArray((findErr, results) => // find all foods
			{
				if (findErr) throw findErr;
				else res.render('listfoods.html', {availableFoods: results}); // display list
				client.close();
			});
		});
	});

    // form to collect search data
    app.get('/searchfoods', utils.redirectLogin, function (req, res) {
        res.render("searchfoods.html");
    });

    // display all foods similar to query
    app.get('/search-result', function (req, res) {
        var MongoClient = require('mongodb').MongoClient;
        var url = process.env.DATABASE_PATH;

        MongoClient.connect(url, function (err, client) {
            if (err) throw err;
            var db = client.db(process.env.DATABASE_NAME);
            db.collection(process.env.COLLECTION_FOODS).find({ name: { $regex: req.query.keyword } }).toArray(function (err, result) // find all foods that contain characters from the search query
            {
                if (err) {
                    res.redirect('./search'); // redirect upon error
                } else {
                    res.render('search_result.html', { availableFoods: result }); // display all foods that match query
                }
                client.close();
            });
        });
    });
}