module.exports = function (app)
{
    const utils = require('../lib/redirects.js');
    const { foodValidation } = require('../lib/validationChecks');      // validation and utils
    const { validationResult } = require('express-validator/src/validation-result');

    // form to collect food name and price
    app.get('/addfood', utils.redirectLogin, function (req, res) {
        res.render("addfood.html", { username: req.session.userId });
    });

    // add food to database
    app.post('/foodadded', foodValidation, function (req, res)
    {        
        const errors = validationResult(req);
        if (!errors.isEmpty()) { // if validation fails, redirect to addfood page
            res.redirect('./addfood');
        }
        else {
            var MongoClient = require('mongodb').MongoClient;
            var url = process.env.DATABASE_PATH;

            MongoClient.connect(url, function (err, client) {
                if (err) throw err;
                var db = client.db(process.env.DATABASE_NAME);
                db.collection(process.env.COLLECTION_FOODS).insertOne({     // insert food name and price into database
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
                res.render('templates/messageTemplate.html', { title: title, message: message, multipleMessages: false, color: '#6a9955' });
            });
        }
    });

    // update foods
    app.get('/updatefood', utils.redirectLogin, function (req, res) {
        res.render("updatefood.html");
    });

    // display food items to update
    app.get('/update-result', function (req, res) {
        var MongoClient = require('mongodb').MongoClient;
        var url = process.env.DATABASE_PATH;

        MongoClient.connect(url, function (err, client) {
            if (err) throw err;
            var db = client.db(process.env.DATABASE_NAME);                  // find all foods that contain characters from the search query (non-case sensitive)
            db.collection(process.env.COLLECTION_FOODS).find({ name: { $regex: req.query.keyword, $options: 'i'  } }).toArray(function (err, result)
            {
                if (err) {
                    res.redirect('./updatefood'); // redirect upon error
                } else {
                    res.render('update_result.html', { availableFoods: result, username: req.session.userId }); // display all foods that match query
                }
                client.close();
            });
        });
    });

    app.post('/foodupdated', foodValidation, function (req, res) {
        const errors = validationResult(req);
        
        // if update button is clicked
        if (!req.body.delete) {
            if (!errors.isEmpty()) { // if validation fails, redirect to addfood page
                res.redirect('./updatefood'); // redirect upon error
            }
            else {
                var MongoClient = require('mongodb').MongoClient;
                var url = process.env.DATABASE_PATH;

                MongoClient.connect(url, function (err, client) {
                    if (err) throw err;
                    var db = client.db(process.env.DATABASE_NAME);

                    const objectID = require('mongodb').ObjectID;       // convert the mongo id to objectID format (otherwise it can't be correctly evaluated against)
                    const id = new objectID(req.body._id);

                    db.collection(process.env.COLLECTION_FOODS).findOneAndUpdate({
                        _id: id
                    },
                    {
                        $set: 
                        {
                            name: req.body.name,        // find and update the food item that matches the ID
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
        }
        else {
            // if delete button is clicked display confirmation message
            res.render('deletefood.html', { name: req.body.name, _id: req.body._id });
        }
    });

    app.post('/fooddeleted', function (req, res) {
        if (!req.body.yes) {        // if user accepts confirmation message
            res.redirect('./updatefood');
        }
        else {
            var MongoClient = require('mongodb').MongoClient;
            var url = process.env.DATABASE_PATH;

            MongoClient.connect(url, function (err, client) {
                if (err) throw err;
                var db = client.db(process.env.DATABASE_NAME);

                const objectID = require('mongodb').ObjectID;   // convert the mongo id to objectID format (otherwise it can't be correctly evaluated against)
                const id = new objectID(req.body._id);

                db.collection(process.env.COLLECTION_FOODS).findOneAndDelete({
                    _id: id         // find and delete the food item that matches the ID
                });
                client.close();                                
            });

            let title = 'Food Deleted';     // success message
            let message = '"' + req.body.name + '" has been deleted.';
            res.render('templates/messageTemplate.html', { title: title, message: message, multipleMessages: false, color: '#6a9955' });
        }
    })

	app.get('/listfoods', utils.redirectLogin, function (req, res)
	{
		var MongoClient = require('mongodb').MongoClient;
		var url = process.env.DATABASE_PATH;
		MongoClient.connect(url, function (err, client)
		{
			if (err) throw err;
			var db = client.db(process.env.DATABASE_NAME);
			db.collection(process.env.COLLECTION_FOODS).find().toArray((findErr, results) => // find all foods in collection
			{
				if (findErr) throw findErr;
				else res.render('listfoods.html', { availableFoods: results,
                                                    combinedFoods: 0,
                                                    combinedCalories: 0,
                                                    combinedCarbohydrates: 0,
                                                    combinedFat: 0,
                                                    combinedProtein: 0,
                                                    combinedSalt: 0,
                                                    combinedSugar: 0 });
				client.close();
			});
		});
	});
            // users can select multiple food items, enter weights for all of them, and receive the combined nutrient information
    app.post('/listfoods', utils.redirectLogin, function (req, res)
	{
        let mult = parseFloat(req.body.amount) / parseFloat(req.body.typicalValues);    // calculate the number to multiply nutrient quantities by

        let totalCalories = parseFloat(req.body.caloriesToAdd * mult);
        let totalCarbohydrates = parseFloat(req.body.carbohydratesToAdd * mult);
        let totalFat = parseFloat(req.body.fatToAdd * mult);                        // calculate nutrients per X grams
        let totalProtein = parseFloat(req.body.proteinToAdd * mult);
        let totalSalt = parseFloat(req.body.saltToAdd * mult);
        let totalSugar = parseFloat(req.body.sugarToAdd * mult);
        
        if (req.body.combinedCalories > 0) totalCalories += parseFloat(req.body.combinedCalories);
        if (req.body.combinedCarbohydrates > 0) totalCarbohydrates += parseFloat(req.body.combinedCarbohydrates);
        if (req.body.combinedFat > 0) totalFat += parseFloat(req.body.combinedFat);                         // add the nutrients to the current totals
        if (req.body.combinedProtein > 0) totalProtein += parseFloat(req.body.combinedProtein);
        if (req.body.combinedSalt > 0) totalSalt += parseFloat(req.body.combinedSalt);
        if (req.body.combinedSugar > 0) totalSugar += parseFloat(req.body.combinedSugar);

		var MongoClient = require('mongodb').MongoClient;
		var url = process.env.DATABASE_PATH;
		MongoClient.connect(url, function (err, client)
		{
			if (err) throw err;
			var db = client.db(process.env.DATABASE_NAME);

			db.collection(process.env.COLLECTION_FOODS).find().toArray((findErr, results) =>    // all food items
			{                
				if (findErr) throw findErr;
				else res.render('listfoods.html', { availableFoods: results,
                                                    combinedFoods: 1,
                                                    combinedCalories: totalCalories,        // pass in the totals so that more foods can be added afterwards
                                                    combinedCarbohydrates: totalCarbohydrates,
                                                    combinedFat: totalFat,
                                                    combinedProtein: totalProtein,
                                                    combinedSalt: totalSalt,
                                                    combinedSugar: totalSugar });
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