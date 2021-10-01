const {Schema, model} = require('mongoose');


const userSchema = new Schema({
    email: {type: String, required: true},
    name: {type: String},
    password: {type: String, required: true},
    cart: {
        items: [
            {
                count: {type: Number, required: true, default: 1},
                courseId: {type: Schema.Types.ObjectId, ref: 'Course', required: true},

            }
        ]
    }
})

userSchema.methods.addToCart = function (course) {
    const items = [...this.cart.items]
    const courseIndex = items.findIndex(c => {
        return c.courseId.toString() === course._id.toString()
    })
    if (courseIndex >= 0) {
        items[courseIndex].count = items[courseIndex].count + 1
    } else {
        items.push({
            courseId: course._id.toString(),
            count: 1
        })
    }

    this.cart = {items}
    return this.save()
}

userSchema.methods.removeFromCart = function (courseId) {
    let items = [...this.cart.items]
    const courseIndex = items.findIndex(c => {
        return c.courseId.toString() === courseId.toString()
    })

    if (items[courseIndex].count === 1) {
           items = items.filter((course) => course.courseId.toString() !== courseId.toString())
    } else {
        items[courseIndex].count--
    }

    this.cart = {items}
    return this.save()
}

userSchema.methods.clearCart = function(){
    this.cart = {items: []}
    return this.save()
}

module.exports = model('User', userSchema)