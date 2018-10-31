const express = require('express');
const _ = require('lodash');

const { Technology } = require('../models/technology');
const { Course } = require('../models/course');
const { authenticateUser } = require('../middlewares/authenticate');
const { authorizeUser} = require('../middlewares/authenticate');

const router = express.Router();

router.get('/',(req,res) => {
    Technology.find().then((data) => {
        res.send(data);
    }) .catch((err) => {
        res.send(err);
    })
});

// router.get('/:id',authenticateUser,(req,res) => {
//     let id = req.params.id;
//     Technology.findById(id).populate('technology').then((data) => {
//         res.send(data);
//     }) .catch((err) => {
//         res.send(err);
//     })
// })
router.get('/:id',(req,res) => {
        let id = req.params.id;
        Course.find({"technology" : id}).populate({ path: 'technology', select: 'name -_id',}) .then((data) => {
            res.send(data);
        }) .catch((err) => {
            res.send(err);
        })
    })
// router.get('/:id',authenticateUser,(req,res) => {
//     let id = req.params.id;
//     let empty = [];
//         Course.find().then((data) => {
//         data.forEach((out) => {
//            out.technology.forEach((obj) => {
//                if(obj.equals(id)){
//                    empty.push(out);
//                }
//            })
//         })
//         res.send(empty);
//     })
// })

router.post('/',authenticateUser,authorizeUser,(req,res) => {
    
    let body = _.pick(req.body,['name','description']);
    let technolgies = new Technology(body);

    technolgies.save().then((technology) => {
        res.send(technology);
    }) .catch((err) => {
        res.send(err);
    })
});

router.put('/:id',authenticateUser,authorizeUser,(req,res) => {
    let id = req.params.id;
    let body = _.pick(req.body,['name','description']);
    Technology.findById(id).then((tech) => {
        Object.assign(tech,body)
        return tech.save()
    }) .then((data) => {
        res.send(data);
    }) .catch((err) => {
        res.send(err);
    })
});


module.exports = { 
    technologiesController : router
}