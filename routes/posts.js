const router = require('express').Router()
const verify = require('./verifyToken');

router.get('/', verify, (req, res) =>{
    res.send(req.user);
    // res.json({
    //     posts: {
    //         title: 'First post', 
    //         description: 'data can not accessed with out login'
    //     }
    // });
})



module.exports = router;