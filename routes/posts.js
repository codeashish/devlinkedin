const express = require('express');
const router = express.Router();

const mongoose = require('mongoose')
const passport = require('passport')

//Models
const Post = require('../models/Post')
const Profile = require('../models/Profile')
//Validation
const validatePostInput = require('./../validation/post')


//Post /posts/all
//@desc get all posts
//@access Public

router.get('/all', async (req, res) => {
    try {
        const posts = await Post.find().sort({
            date: -1
        })
        res.json(posts)
    } catch (e) {
        res.status(404).send(e)
    }

})


//Post /posts/:id
//@desc get  post by id
//@access Public

router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.send(post);
    } catch (e) {
        res.status(500).send({
            error: e
        })
    }
})





//Post /posts
//@desc Create a post
//@access Private

router.post('/', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
    const {
        errors,
        isValid
    } = validatePostInput(req.body);
    if (!isValid) {
        return res.status(404).send(errors)
    }

    const newPost = new Post({
        text: req.body.text,
        name: req.body.name,
        avtaar: req.body.avtaar,
        user: req.user.id
    })
    try {
        await newPost.save()
        res.json(newPost)
    } catch (e) {
        res.status(500).send({
            nopost: "No post found"
        })
    }
})





//delete /posts/:id
//@desc delete the post
//@access Private

router.delete('/:id', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id)
        res.send({
            sucess: true
        })
    } catch (e) {
        res.status(500).send({
            nopost: "No post found"
        })
    }

})





//POST /posts/like/post_id
//@desc Like Post
//@access Private

router.post('/like/:post_id', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
    try {

        const profile = await Profile.findOne({
            user: req.user.id
        });
        //console.log(profile)
        if (profile) {

            const post = await Post.findById(req.params.post_id)
            // console.log(post)
            if (post) {
                if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
                    return res.status(400).json({
                        alreadyliked: 'User already likes'
                    })
                }
                //Add user id to likes array
                post.likes.unshift({
                    user: req.user.id
                })
                await post.save()
                res.json(post)
            }

        }
    } catch (e) {
        res.status(500).send({
            profilerror: "Profile not found"
        })
    }

})



//POST /posts/unlike/post_id
//@desc unLike Post
//@access Private

router.post('/unlike/:post_id', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
    try {

        const profile = await Profile.findOne({
            user: req.user.id
        });
        //console.log(profile)


        const post = await Post.findById(req.params.post_id)
        // console.log(post)

        if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({
                notliked: 'User has not liked the post'
            })
        }
        //remove user id to likes array
        // post.likes.shift({
        //     user: req.user.id
        // })

        const removeIndex = post.likes.map(item => item.user.toString()).indexOf(req.user.id)
        post.likes.splice(removeIndex, 1)
        await post.save()
        res.json(post)



    } catch (e) {
        res.status(500).send({
            profilerror: "Profile not found"
        })
    }

})



//POST /posts/comment/post_id
//@desc comment on Post
//@access Private

router.post('/comment/:post_id', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
    const {
        errors,
        isValid
    } = validatePostInput(req.body);
    if (!isValid) {
        return res.status(404).send(errors)
    }
    try {
        // const profile = Profile.findOne({
        //     user: req.user.id
        // })

        const post = await Post.findById(req.params.post_id)
        const newComment = {
            user: req.user.id,
            text: req.body.text,

            name: req.body.name,
            avtaar: req.body.avtaar
        }
        //Add to comment array
        post.comment.unshift(newComment)
        await post.save()
        res.send(post)



    } catch (e) {
        res.status(500).send({
            error: error
        })
    }



})

//delete /posts/comment/post_id/:comment_id
//@desc delete comment on Post
//@access Private

router.delete('/comment/:post_id/:comment_id', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {

    try {

        const post = await Post.findById(req.params.post_id)
        const newComment = {
            user: req.user.id,
            text: req.body.text,

            name: req.body.name,
            avtaar: req.body.avtaar
        }

        //Check if comment occur
        if (post.comment.filter(comment => comment._id.toString() === req.params.comment_id).length = 0) {
            return res.status(404).json({
                commentnotexist: "Comment does not exist"
            })

        }
        const removeIndex = post.comment.map(comment => comment._id.toString()).indexOf(req.params.comment_id)
        post.comment.splice(removeIndex, 1)
        await post.save()
        //Add to comment array

        await post.save()
        res.send(post)



    } catch (e) {
        res.status(500).send({
            error: e
        })
    }



})



module.exports = router