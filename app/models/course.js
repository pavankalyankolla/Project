const mongoose = require('mongoose');
const _ = require('lodash');

const Schema = mongoose.Schema;

const courseSchema = new Schema({
    name : {
        type : String,
        required :true,
    },
    description : {
        type : String,
        required : true
    },
    courseReviews : {
        type : [String],
        required : true
    },
    technology : [{
        type : Schema.Types.ObjectId,
        ref : 'Technology',
        required : true
    }]
})

courseSchema.methods.toJSON = function(){
    return _.pick(this,['_id','name','description','courseReviews','technology']);
}

const Course = mongoose.model('Course',courseSchema);

module.exports = { Course }