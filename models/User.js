const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const validateLoginInput = require('./../validation/login')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,

    },
    email: {
        type: String,
        require: true,

    },
    password: {
        type: String,
        require: true,


    },
    avtaar: {
        type: String,


    },
    date: {
        type: String,
        default: Date.now
    },
    tokens: [{
        token: {
            type: String
        }
    }]

}, {
    timestamps: true
})


userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})


// userSchema.statics.findByCredientials = async (email, password) => {
//     const {
//         errors,
//         isValid
//     } = validateLoginInput({
//         email,
//         password
//     })
//     const user = await User.findOne({
//         email
//     })
//     if (!user) {
//         errors.email = "Email is not found"
//         return errors
//     }
//     console.log(user)

//     const isMatched = await bcrypt.compare(password, user.password);
//     if (!isMatched) {
//         errors.password = 'Password does not match'
//         return errors
//     }

//     return user
// }








userSchema.methods.createjwttoken = async function () {
    const user = this;
    const token = jwt.sign({
        id: user._id,
        name: user.name,
        avtaar: user.avtaar
    }, process.env.SECRET_KEY, {
        expiresIn: '14d'
    })

    user.tokens = user.tokens.concat({
        token
    })
    await user.save();
    return token
}





const User = mongoose.model('User', userSchema)


module.exports = User