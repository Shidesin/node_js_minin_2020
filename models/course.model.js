const {Schema, model} = require('mongoose');
const courseModel = new Schema({
    title: {type: String, required: true},
    price: {type: Number, required: true},
    img:{type: String},
    userId: {type: Schema.Types.ObjectId, ref: 'User', required: true}
})

courseModel.method('toClient', function(){
     const course = this.toObject()
    course.id = course._id
    delete course._id
    return course
})

module.exports = model('Course', courseModel)