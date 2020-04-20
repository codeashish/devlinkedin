const validator = require('validator');
const isEmpty = require('./isEmpty')

module.exports = function validateLoginInput(data) {
    let errors = {}

    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';






    if (validator.isEmpty(data.email)) {
        errors.email = 'Email is required'
    }
    if (!validator.isLength(data.password, {
            min: 2,
            max: 30
        })) {
        errors.password = 'Password must be between 2 to 30 characters'
    }


    if (validator.isEmpty(data.password)) {
        errors.password = 'password is required'
    }


    if (!validator.isEmail(data.email)) {
        errors.email = "Enter a valid Email"
    }














    return {
        errors,
        isValid: isEmpty(errors)
    }


}