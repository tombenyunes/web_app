module.exports = function (app)
{    
	app.get('/api', function (req, res)
	{
		var MongoClient = require('mongodb').MongoClient;
		var url = process.env.DATABASE_PATH;
		MongoClient.connect(url, function (err, client) {
			if (err) throw err
			var db = client.db(process.env.DATABASE_NAME);
			db.collection(process.env.COLLECTION_FOODS).find().toArray((err, results) => {
				if (err) throw err;
				else res.json(results);
				client.close();
			});
    	});
	});

    app.post('/api', function (req, res)
	{        
        var MongoClient = require('mongodb').MongoClient;
        var url = process.env.DATABASE_PATH;
        var id = Math.random() * 10000000000000000; // random id
        id = '"' + id + '"';

        MongoClient.connect(url, function (err, client) {
            if (err) throw err;
            var db = client.db(process.env.DATABASE_NAME);
            db.collection(process.env.COLLECTION_FOODS).insertOne({ // insert food name and price into database
                id: id,
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
        });

        res.send('Food Added Successfully');
	});
    
    app.put('/api', function (req, res) 
    {
        var MongoClient = require('mongodb').MongoClient;
        var url = process.env.DATABASE_PATH;
        console.log(req.body);
        MongoClient.connect(url, function (err, client) {
            if (err) throw err;
            var db = client.db(process.env.DATABASE_NAME);
            db.collection(process.env.COLLECTION_FOODS).findOneAndUpdate({
                id: req.body.id
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
        });

        res.send('Food Updated Successfully');
    });

    app.delete('/api', function (req, res)
    {
        var MongoClient = require('mongodb').MongoClient;
        var url = process.env.DATABASE_PATH;

        MongoClient.connect(url, function (err, client) {
            if (err) throw err;
            var db = client.db(process.env.DATABASE_NAME);

            db.collection(process.env.COLLECTION_FOODS).findOneAndDelete({
                id: req.body.id
            });
            client.close();
        });

        res.send('Food Deleted Successfully');
    });
}