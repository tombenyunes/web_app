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

module.exports = {
    userValidation,
}