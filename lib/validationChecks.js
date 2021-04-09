const { check, oneOf } = require('express-validator/check/index');

const userValidation = [
    check('first').not().isEmpty(),
    check('first').matches(/^[A-Za-z]+$/),      // contains only upper/lower case letters

    check('last').not().isEmpty(),
    check('last').matches(/^[A-Za-z]+$/),   // contains only upper/lower case letters

    check('email').not().isEmpty(),
    check('email').isEmail(),       // must be in email format

    check('username').not().isEmpty(),
    check('username').matches(/^[A-Za-z0-9]+$/), // contains only upper/lower case letters + numbers

    check('password').not().isEmpty(),
    check('password').isLength({ min: 8 }),     // password minimum length of 8 characters
]

const foodValidation = [
    check('name').not().isEmpty(),
    check('name').matches(/^[A-Z a-z]+$/), // contains only upper/lower case letters

    check('price').not().isEmpty(),
    check('price').isFloat(),       // must be float

    check('typicalValues').not().isEmpty(),
    check('typicalValues').isInt(),     // must be integer

    oneOf([[                                            // must equal one of the following defined units
        check('typicalValuesUnit').equals('grams')
    ], [
        check('typicalValuesUnit').equals('kilograms')
    ], [
        check('typicalValuesUnit').equals('mililitres')
    ], [
        check('typicalValuesUnit').equals('litres')
    ], [
        check('typicalValuesUnit').equals('teaspoons')
    ], [
        check('typicalValuesUnit').equals('tablespoons')
    ], [
        check('typicalValuesUnit').equals('cups')
    ],
    ]),

    check('calories').not().isEmpty(),
    check('calories').isFloat(),    // must be float

    check('carbohydrates').not().isEmpty(),
    check('carbohydrates').isFloat(),       // must be float

    check('fat').not().isEmpty(),
    check('fat').isFloat(),     // must be float

    check('protein').not().isEmpty(),
    check('protein').isFloat(),     // must be float

    check('salt').not().isEmpty(),
    check('salt').isFloat(),        // must be float

    check('sugar').not().isEmpty(),
    check('sugar').isFloat(),       // must be float
]

module.exports = {
    userValidation,
    foodValidation
}