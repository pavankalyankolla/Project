const express = require('express');
const _ = require('lodash');
const { User } = require('../models/user');

const router = express.Router();

// router.get('/',(req,res) => {
//     res.send('Welcome to users')
// })
router.get('/',(req,res) => {
    User.find().then((user) => {
        res.send(user); 
    })
})
router.post('/',(req,res) => {
    let body = _.pick(req.body,['username','email','password','dob','mobileNumber']);
    let user = new User(body);

    //first user as admin
    User.countDocuments().then((data) => {
        //   console.log(data);
          if(data == 0) {
              user.role = 'admin'
          } else {
              user.role = 'user'
          }
          
        });

    user.save().then((user) => {
        return user.generateToken();
    }) .then((token) => {
        res.header('x-auth',token).send(user);
    }) .catch((err) => {
        res.status(400).send(err);
    })
})

module.exports = {
    usersController : router
}