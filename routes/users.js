const express = require('express');
const router = express.Router();
const User = require('./../models/User')
const gravatar = require('gravatar')
const passport = require('passport')
const bcrypt = require('bcryptjs')

//Load validation
const validateRegisterInput = require('./../validation/register');
const validateLoginInput = require('./../validation/login')
//route @Get /users
//desc userinfo
//access public 
router.get('/', (req, res) => res.json({
    msg: "Users"
}))



router.post('/register', async (req, res) => {
    const {
        errors,
        isValid
    } = validateRegisterInput(req.body)
    if (!isValid) {
        return res.status(400).json(errors)
    }




    const emailexist = await User.findOne({
        email: req.body.email
    })

    if (emailexist) {
        errors.email = "Email already Exists"
        return res.status(400).send(errors)
    }
    try {
        req.body.avtaar = gravatar.url(req.body.email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        })
        const user = new User(req.body);
        await user.save()
        res.send(user)

    } catch (e) {
        res.status(400).send({
            err: e
        })
    }

})




router.post('/login', async (req, res) => {
    const {
        errors,
        isValid
    } = validateLoginInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors)
    }




    const user = await User.findOne({
        email: req.body.email
    })
    if (!user) {
        errors.email = 'User not found'
        return res.status(404).send(errors)
    }

    const isMatched = await bcrypt.compare(req.body.password, user.password);
    if (!isMatched) {
        errors.password = 'Password does not match';
        return res.status(404).send(errors)

    }


    try {

        const token = "Bearer " + await user.createjwttoken()
        //console.log(token)
        res.send(user)
    } catch (e) {
        res.status(400).send({
            error: e
        })
    }
})

router.get('/me', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    res.send(req.user)
})



module.exports = router