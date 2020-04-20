const mongoose = require('mongoose')

const profileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    handle: {
        type: 'String',
        required: true,
        max: 40
    },
    company: {
        type: String,
    },
    website: {
        type: String,
    },
    location: {
        type: String,
    },
    status: {
        type: String,
        required: true
    },
    skills: {
        type: [String],
        required: true
    },
    bio: {
        type: String,
    },
    githubusername: {
        type: String,

    },
    experience: [{
        title: {
            type: String,
            // require: true
        },
        company: {
            type: String,
            // require: true
        },
        location: {
            type: String
        },
        from: {
            type: Date,
            // required: true
        },
        to: {
            type: Date,

        },
        current: {
            type: Boolean,
            default: false
        },
        description: {
            type: String,

        }


    }],
    education: [{
        school: {
            type: String,
            // require: true
        },
        degree: {
            type: String,
            // require: true
        },
        fieldofstudy: {
            type: String,
            // required: true
        },
        from: {
            type: Date,
            // required: true
        },
        to: {
            type: Date,

        },
        current: {
            type: Boolean,
            default: false
        },
        description: {
            type: String,

        }


    }],
    social: {
        youtube: {
            type: String
        },
        twitter: {
            type: String
        },
        linkdin: {
            type: String
        },
        facebook: {
            type: String
        },
        instagram: {
            type: String
        }
    },
    date: {
        type: Date,
        default: Date.now
    }




}, {
    timestamps: true
})



const Profile = mongoose.model('profile', profileSchema)
module.exports = Profile