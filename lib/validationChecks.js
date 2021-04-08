const { check, oneOf } = require('express-validator/check/index');

const userValidation = [
    check('first').not().isEmpty(),
    check('first').matches(/^[A-Za-z]+$/), // contains only upper/lower case letters

    check('last').not().isEmpty(),
    check('last').matches(/^[A-Za-z]+$/), // contains only upper/lower case letters

    check('email').not().isEmpty(),
    check('email').isEmail(),
    
    check('username').not().isEmpty(),
    check('username').matches(/^[A-Za-z0-9]+$/), // contains only upper/lower case letters + numbers

    check('password').not().isEmpty(),
    check('password').isLength({ min: 8 }),
]

const foodValidation = [
    check('name').not().isEmpty(),
    check('name').matches(/^[A-Za-z]+$/), // contains only upper/lower case letters

    check('price').not().isEmpty(),
    check('price').isFloat(),

    check('typicalValues').not().isEmpty(),
    check('typicalValues').isInt(),

    oneOf([[
        check('typicalValuesUnit').equals('grams')
    ],[
        check('typicalValuesUnit').equals('kilogram')
    ],[
        check('typicalValuesUnit').equals('mililitre')
    ],[
        check('typicalValuesUnit').equals('litre')
    ],[
        check('typicalValuesUnit').equals('teaspoon')
    ],[
        check('typicalValuesUnit').equals('tablespoon')
    ],[
        check('typicalValuesUnit').equals('cup')
    ],
    ]),
    
    check('calories').not().isEmpty(),
    check('calories').isFloat(),

    check('carbohydrates').not().isEmpty(),
    check('carbohydrates').isFloat(),

    check('fat').not().isEmpty(),
    check('fat').isFloat(),

    check('protein').not().isEmpty(),
    check('protein').isFloat(),

    check('salt').not().isEmpty(),
    check('salt').isFloat(),

    check('sugar').not().isEmpty(),
    check('sugar').isFloat(),
]

module.exports = {
    userValidation,
    foodValidation
}