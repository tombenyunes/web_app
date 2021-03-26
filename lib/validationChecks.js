const { check } = require('express-validator/check/index');

const userValidation = [
    check('email').isEmail(),
    check('password').isLength({ min: 8 }),

    check('email').not().isEmpty(),
    check('username').not().isEmpty(),
    check('first').not().isEmpty(),
    check('last').not().isEmpty(),
    check('password').not().isEmpty(),
]

const foodValidation = [
    check('name').not().isEmpty(),
    check('price').not().isEmpty(),
    check('typicalValues').not().isEmpty(),
    check('typicalValuesUnit').not().isEmpty(),
    check('calories').not().isEmpty(),
    check('carbohydrates').not().isEmpty(),
    check('fat').not().isEmpty(),
    check('protein').not().isEmpty(),
    check('salt').not().isEmpty(),
    check('sugar').not().isEmpty(),
]

module.exports = {
    userValidation,
    foodValidation
}