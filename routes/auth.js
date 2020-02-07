const router = require('express').Router()
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const verify = require('./verifyToken');
const {registerValidation, loginValidation} = require('../validation')

router.post('/register', async(req, res, next)=>{
    //VALIDATION HERE........
   const {error} = registerValidation(req.body);
   if(error) return res.status(400).send(error.details[0].message)
   //CHECKING IF THE USER IS ALREADY EXISTS
   const emailExist = await User.findOne({email: req.body.email})
   if(emailExist) return res.status(400).send('Email already exists');
   //HASH PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
   
   //CREATE A NEW USER
   const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword,
    });
    try {
        const savedUser = await user.save();
        res.send({user_id: savedUser._id});
    } catch (error) {
        res.status(400).send(err);
    }
})

router.post('/login', async(req, res) =>{
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message)
    //CHECKING IF email EXISTS
   const user = await User.findOne({email: req.body.email})
   if(!user) return res.status(400).send('Email doesn\'t exists');
    //password check
    const validPass = await bcrypt.compare(req.body.password, user.password)
    if(!validPass) return res.status(400).send('Invalid password');
    //create and assign a token
    const token = jwt.sign({_id: user.id}, process.env.JWT_KEY, {expiresIn: '1h'});
    res.header('auth-token', token).send(token);
})

router.get('/logout', verify, async(req, res) =>{
    console.log(req.token)
    // const token = req.header.auth-token;
    // console.log(token)
    jwt.destroy(req.token);
    res.send("done successfully");

})



module.exports = router;