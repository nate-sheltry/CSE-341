
const { check } = require('express-validator');

const datePattern = /^\d{2}\/\d{2}\/\d{4}$/; const dateExample = "12/08/2000";
const namePattern = /^[A-Z]{1}[a-zA-Z]$/; const nameExample = "John";

exports.addContactValidation = [
    check('firstName', `First name is required. Example: ${nameExample}`).matches(namePattern),
    check('lastName', `Last name is required. Example: ${nameExample}`).matches(namePattern),
    check('email', 'Please include a valid email').isEmail().normalizeEmail({ gmail_remove_dots: true }),
    check('favoriteColor', 'Color is required').not().isEmpty(),
    check('birthday', `A valid date is required. Example: ${dateExample}`).matches(datePattern)
]
