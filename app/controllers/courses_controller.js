const express = require('express');
const _ = require('lodash');

const { Course } = require('../models/course');
const { authenticateUser } = require('../middlewares/authenticate');
const { authorizeUser } = require('../middlewares/authenticate');

const router = express.Router();

router.get('/',(req,res) =>{
    Course.find().populate({ path: 'technology', select: 'name -_id',}).then((data) => {
        res.send(data);
    }) .catch((err) =>{
        res.send(err);
    })
})

//courses getting based on technology id
// router.get('/:id',authenticateUser,(req,res) => {
//     let id = req.params.id;
//     Course.find({"technology" : id}).populate({ path: 'technology', select: 'name -_id',}) .then((data) => {
//         res.send(data);
//     }) .catch((err) => {
//         res.send(err);
//     })
// })



router.post('/',authenticateUser,authorizeUser,(req,res) => {
    let body = _.pick(req.body,['name','description','courseReviews','technology']);

    let courses = new Course(body);
    courses.save().then((course) => {
        res.send(course);
    }) .catch((err) => {
        res.send(err);
    })
});

router.post('/userReview',authenticateUser,(req,res) => {
    let body = _.pick(req.body,['courseReviews']);
    let courses = new Course(body);
    courses.save().then((course) => {
        res.send(course);
    }) .catch((err) => {
        res.send(err);
    })
})

module.exports = {
    coursesController : router
}