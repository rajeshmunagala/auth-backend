require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const authRoute = require('./routes/auth');
const postsRoute = require('./routes/posts')

const app = express();

mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true,
    useUnifiedTopology: true}, ()=>{
        console.log('Connected to db...');
    })

//Middleware
app.use(express.json());

//Import Auth
app.use('/api/user', authRoute);
app.use('/api/posts', postsRoute);

app.listen(3000, ()=>{console.log("Server Up and Runing.. 3000")});