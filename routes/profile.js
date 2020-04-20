const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const passport = require('passport')
//Load Validators
const validateProfileInput = require('./../validation/newprofile')
const validateExperienceInput = require('./../validation/experience')
const validateEducationInput = require('./../validation/education')

//Load Profile Model
const Profile = require('./../models/Profile')
const User = require('./../models/User')


//@route get /profile
//@desc  Get current user profile
//@access Private

router.get('/', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
    try {

        const errors = {}
        const profile = await Profile.findOne({
            user: req.user.id
        }).populate('user', ['name', 'avtaar'])

        if (!profile) {
            errors.noprofile = 'There is no profile for user'
            return res.status(404).send(errors)
        }
        res.send(profile)
    } catch (e) {
        res.status(500).send(e)
    }

})



//@route get /profile/handle/:handle    
//@desc  get profile by handle
//@access Public

router.get('/handle/:handle', async (req, res) => {
    const errors = {}
    const profile = await Profile.findOne({
        handle: req.params.handle
    }).populate('user', ['name', 'avtaar'])
    if (!profile) {
        errors.noprofile = 'There is  no profile'
        return res.status(404).json(errors)
    }
    res.json(profile)



})


//@route get /profile/all    
//@desc  get all profile
//@access Public
router.get('/all', async (req, res) => {
    const errors = {}
    const profiles = await Profile.find().populate('user', ['name', 'avtaar'])
    if (!profiles) {
        errors.newProfile = 'There are no profiles'
        return res.status(404).json(errors)
    }
    res.json(profiles)

})



//@route get /profile/user/:user    
//@desc  get profile by user
//@access Public

router.get('/user/:user_id', async (req, res) => {
    const errors = {}
    const profile = await Profile.findOne({
        user: req.params.user_id
    }).populate('user', ['name', 'avtaar'])
    if (!profile) {
        errors.noprofile = 'There is  no profile'
        return res.status(404).json(errors)



    }
    res.json(profile)



})

















//@route post /profile   ||  Update 
//@desc  create user profile
//@access Private

router.post('/', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
    const {
        errors,
        isValid
    } = validateProfileInput(req.body)
    if (!isValid) {
        return res.status(400).json(errors)
    }

    //get Fileds
    const profilefields = {}
    profilefields.user = req.user.id;
    if (req.body.handle) profilefields.handle = req.body.handle;
    if (req.body.company) profilefields.company = req.body.company;
    if (req.body.website) profilefields.website = req.body.website;
    if (req.body.location) profilefields.location = req.body.location;
    if (req.body.bio) profilefields.bio = req.body.bio;
    if (req.body.status) profilefields.status = req.body.status;
    if (req.body.githubusername) profilefields.githubusername = req.body.githubusername;
    //Skills
    if (typeof (req.body.skills) != undefined) {
        profilefields.skills = req.body.skills.split(',');

    }
    //Social
    profilefields.social = {}
    if (req.body.youtube) profilefields.social.youtube = req.body.youtube;
    if (req.body.twitter) profilefields.social.twitter = req.body.twitter;
    if (req.body.facebook) profilefields.social.facebook = req.body.facebook;
    if (req.body.linkdin) profilefields.social.linkdin = req.body.linkdin;
    if (req.body.instagram) profilefields.social.instagram = req.body.instagram;
    // console.log(profilefields.social)
    const profile = await Profile.findOne({
        user: req.user.id
    })

    if (profile) {
        //Update

        const updatedprofile = await Profile.findOneAndUpdate({
            user: req.user.id
        }, {
            $set: profilefields
        }, {
            new: true
        })
        //console.log(profilefields)
        // console.log(profile, updatedprofile)
        await updatedprofile.save()
        return res.json(profile)
    } else {
        //create
        //check if handle exists
        const handleMatch = await Profile.findOne({
            handle: profilefields.handle
        })
        if (handleMatch) {
            errors.handle = 'Handle already exists'
            return res.status(400).json(errors)
        }

        const newProfile = new Profile(profilefields)
        try {
            await newProfile.save()
            res.json(newProfile)
        } catch (e) {
            res.status(500).send(e)
        }
    }

})



//@route post /profile/experience   
//@desc  Add experience
//@access Private


router.post('/experience', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
    const {
        errors,
        isValid
    } = validateExperienceInput(req.body);
    //Valid
    if (!isValid) {
        return res.status(400).json(errors)
    }

    const profile = await Profile.findOne({
        user: req.user.id
    })
    if (!profile) {
        errors.noprofile = 'Profile does not exist'
        return res.status(404).send(errors)
    }
    const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
    }
    //Add to experience array
    profile.experience.unshift(newExp);
    try {
        await profile.save()
        res.json(profile)
    } catch (e) {
        res.status(500).send(e)
    }
})


router.post('/education', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
    const {
        errors,
        isValid
    } = validateEducationInput(req.body)
    if (!isValid) {
        return res.status(400).send(errors)
    }
    const profile = await Profile.findOne({
        user: req.user.id
    })
    if (!profile) {
        errors.noprofile = 'Profile doesnot exist'
        return res.status(400).send(errors)
    }
    const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description,
    }
    //Add Education to array
    profile.education.unshift(newEdu)
    try {
        await profile.save()
        res.json(profile)
    } catch (e) {
        res.status(500).send(e)
    }
})

//@route delete /profile/experience/experienceid   
//@desc  delete experience
//@access Private


router.delete('/experience/:exp_id', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
    const errors = {}

    const profile = await Profile.findOne({
        user: req.user.id
    })
    if (!profile) {
        errors.noprofile = 'Profile does not exist'
        return res.status(404).send(errors)
    }

    //Get remove index
    const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id)
    //Spilice array
    profile.experience.splice(removeIndex, 1)
    try {
        await profile.save()
        res.json(profile)
    } catch (e) {
        res.status(500).send(e)
    }
})
//@route delete /profile/education/education_id   
//@desc  delete education
//@access Private


router.delete('/education/:edu_id', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
    const errors = {}
    const profile = await Profile.findOne({
        user: req.user.id
    })
    if (!profile) {
        errors.profile = 'Profile does not exist'
        return res.status(404).send(errors)
    }
    //Get remove index
    const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);
    profile.education.splice(removeIndex, 1)

    try {
        await profile.save()
        res.json(profile)
    } catch (e) {
        res.status(500).send(e)
    }



})

//@route delete /profile   
//@desc  delete user and profile
//@access Private
router.delete('/', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
    const errors = {}
    try {
        await Profile.findOneAndRemove({
            user: req.user.id
        })

    } catch (e) {
        res.status(500).send({
            profileerror: e
        })
    }
    try {
        await User.findOneAndRemove({
            _id: req.user.id
        })
        res.json({
            sucess: true
        })
    } catch (e) {
        res.status(500).send({
            Usererror: e
        })
    }



})





module.exports = router