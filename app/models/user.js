const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true,
        min : 8,
        max : 50
    },
    email : {
        type : String,
        required : true,
        validate : {
            validator : function(value) {
                return validator.isEmail(value);
            },
            message : function(){
                return 'Invalid email format';
            }
        } 
    },
    dob : {
        type : String,
        required : true
    },
    role : {
        type : String,
        enum : ['admin','user']
    },
    mobileNumber : {
        type :String,
        required : true,
        validate : {
            validator : function(value) {
                    return validator.isNumeric(value) && validator.isLength(value,{min : 10,max : 10});
                },
                message : 'Should be 10 digits'
        }
    },
    preference : [ {type : String} ],
    tokens : [{
        access : {
            type :String,
            required : true
        },
        token : {
            type : String,
            required : true
        }
    }]
})

UserSchema.pre('save',function(next){
    let user = this;
    if(user.isModified('password')){
        bcrypt.genSalt(10).then((salt) => {
            bcrypt.hash(user.password,salt).then((hashedPassword) => {
                user.password = hashedPassword;
                next();
            });
        }); 
    } else {
        next();
    }
});

UserSchema.methods.generateToken = function(){
    let tokenData = {
        _id : this._id
    };
    let generatedTokenInfo = {
        access : 'auth',
        token : jwt.sign(tokenData,'supersecret')
    }
    this.tokens.push(generatedTokenInfo);
    return this.save().then((user) => {
        return generatedTokenInfo.token;
    });
}

UserSchema.methods.toJSON = function(){
    return _.pick(this,['_id','username','email','mobileNumber','preference','role']);
}

UserSchema.statics.findByToken = function(token) {
    let User = this;
    let tokenData;
    try {
        tokenData = jwt.verify(token,'supersecret');
    } catch(e) {
        return Promise.reject(e);
    } return User.findOne({
        '_id' : tokenData._id,
        'tokens.token' : token
    })
}

const User = mongoose.model('User',UserSchema);

module.exports = { User }