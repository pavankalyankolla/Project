const express = require('express');
const morgan = require('morgan');

const { mongoose } = require('./config/db');
const { router } = require('./config/routes');


const port = 3000;
const app = express();

app.use(morgan('short'));
app.use(express.json());

app.use('/',router);

app.listen(port,() => {
    console.log('listening to port',port);
})