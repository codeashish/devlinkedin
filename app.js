const express = require('express')
const app = express()
const users = require('./routes/users')
const posts = require('./routes/posts')
const profile = require('./routes/profile')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')

app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())
//DB Config
const port = process.env.port || 8080
const env = require('dotenv')

env.config()


mongoose.connect(process.env.MONGO_URL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => console.log("Sucess")).catch((e) => console.log(e))



//Passport Middleware
app.use(passport.initialize())
//passport config
require('./auth/passport')(passport)


//routes
app.use('/users', users);
app.use('/posts', posts);
app.use('/profile', profile);






app.listen(port, () => console.log("server is running"))






//ashish@pop-os:~/Desktop/work/nodejs/es6course/devconnector$ sudo npm i express mongoose passport passport-jwt jsonwebtoken body-parser bcryptjs validator