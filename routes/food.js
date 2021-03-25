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
                price: req.body.price,
                typicalValues: req.body.typicalValues,
                typicalValuesUnit: req.body.typicalValuesUnit,
                calories: req.body.calories,
                carbohydrates: req.body.carbohydrates,
                fat: req.body.fat,
                protein: req.body.protein,
                salt: req.body.salt,
                sugar: req.body.sugar,
                author: req.body.author
            });
            client.close();
            let title = 'Food Added';            
            let message = '"' + req.body.name + '" has been added to the database.'; // success message
            // let message = 'Food added: ' + req.body.name + " " + req.body.price + " " + req.body.typicalValues + " " + req.body.typicalValuesUnit + " " + req.body.calories + " " + req.body.carbohydrates + " " + req.body.fat + " " + req.body.protein + " " + req.body.salt + " " + req.body.sugar + " " + req.body.author;
            res.render('templates/messageTemplate.html', { title: title, message: message, multipleMessages: false, color: '#6a9955' });
        });
    });

    app.get('/updatefood', utils.redirectLogin, function (req, res) {
        res.render("updatefood.html");
    });

    app.get('/update-result', function (req, res) {
        var MongoClient = require('mongodb').MongoClient;
        var url = process.env.DATABASE_PATH;

        MongoClient.connect(url, function (err, client) {
            if (err) throw err;
            var db = client.db(process.env.DATABASE_NAME);
            db.collection(process.env.COLLECTION_FOODS).find({ name: { $regex: req.query.keyword, $options: 'i'  } }).toArray(function (err, result) // find all foods that contain characters from the search query (non-case sensitive)
            {
                if (err) {
                    res.redirect('./search'); // redirect upon error
                } else {
                    res.render('update_result.html', { availableFoods: result, username: req.session.userId }); // display all foods that match query
                }
                client.close();
            });
        });
    });

    app.post('/foodupdated', function (req, res) {
        if (!req.body.delete) {
            var MongoClient = require('mongodb').MongoClient;
            var url = process.env.DATABASE_PATH;

            MongoClient.connect(url, function (err, client) {
                if (err) throw err;
                var db = client.db(process.env.DATABASE_NAME);

                db.collection(process.env.COLLECTION_FOODS).findOneAndUpdate({
                    name: req.body.name
                },
                {
                    $set: 
                    {
                        name: req.body.name,
                        price: req.body.price,
                        typicalValues: req.body.typicalValues,
                        typicalValuesUnit: req.body.typicalValuesUnit,
                        calories: req.body.calories,
                        carbohydrates: req.body.carbohydrates,
                        fat: req.body.fat,
                        protein: req.body.protein,
                        salt: req.body.salt,
                        sugar: req.body.sugar
                    }
                });
                client.close();
                let title = 'Food Updated';
                let message = '"' + req.body.name + '" has been updated.'; // success message
                res.render('templates/messageTemplate.html', { title: title, message: message, multipleMessages: false, color: '#6a9955' });
            });
        }
        else {
            var MongoClient = require('mongodb').MongoClient;
            var url = process.env.DATABASE_PATH;

            MongoClient.connect(url, function (err, client) {
                if (err) throw err;
                var db = client.db(process.env.DATABASE_NAME);

                db.collection(process.env.COLLECTION_FOODS).findOneAndDelete({
                    name: req.body.name
                });
                client.close();
                let title = 'Food Deleted';
                let message = '"' + req.body.name + '" has been deleted.';
                res.render('templates/messageTemplate.html', { title: title, message: message, multipleMessages: false, color: '#6a9955' });
            });
        }
    });

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
            db.collection(process.env.COLLECTION_FOODS).find({ name: { $regex: req.query.keyword, $options: 'i' } }).toArray(function (err, result) // find all foods that contain characters from the search query (non-case sensitive)
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