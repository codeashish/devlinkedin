const validator = require('validator');
const isEmpty = require('./isEmpty')

module.exports = function validateRegisterInput(data) {
    let errors = {}

    data.name = !isEmpty(data.name) ? data.name : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    data.password2 = !isEmpty(data.password2) ? data.password2 : '';


    if (validator.isEmpty(data.name)) {
        errors.name = 'Name is required'
    }

    if (validator.isEmpty(data.email)) {
        errors.email = 'Email is required'
    }
    if (validator.isEmpty(data.password)) {
        errors.password = 'password is required'
    }



    if (validator.isEmpty(data.password2)) {
        errors.password2 = 'Conform password  is required'
    }


    if (!validator.isLength(data.name, {
            min: 2,
            max: 30
        })) {
        errors.name = "Name must be between 2 to 30 Characters"

    }




    if (!validator.isEmail(data.email)) {
        errors.email = "Enter a valid Email"
    }

    if (!validator.isLength(data.password, {
            min: 2,
            max: 30
        })) {
        errors.password = 'Password must be between 2 to 30 characters'
    }
    if (!validator.equals(data.password, data.password2)) {
        errors.password2 = 'Conform Password does not matched'
    }













    return {
        errors,
        isValid: isEmpty(errors)
    }


}