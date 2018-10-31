const express = require('express');
const router = express.Router();

const { usersController } = require('../app/controllers/users_controller');
const { technologiesController } = require('../app/controllers/technolgies_controller');
const { coursesController } = require('../app/controllers/courses_controller');

router.use('/users',usersController);
router.use('/technologies',technologiesController);
router.use('/courses',coursesController);


module.exports = { router }