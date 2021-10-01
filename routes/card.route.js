const {Router} = require('express')
const auth = require('../middleware/auth.middleware')
const Course = require('../models/course.model')
const router = Router()

const mapCartItems = (cart) => {
    return cart.items.map(c => ({
        ...c.courseId._doc,
        id: c.courseId.id,
        count: c.count
    }))
}

const computePrice = (courses) => {
    return courses.reduce((total, course) => {
        return total += course.price * course.count
    }, 0)
}

router.get('/',auth, async (req, res) => {

    const user = await req.user.populate('cart.items.courseId')

    const courseItems = mapCartItems(user.cart)

    res.status(200)
    res.render('card', {
        title: 'Сard',
        isCard: true,
        courses: courseItems,
        price: computePrice(courseItems)
    })
})

router.post('/add',auth, async (req, res) => {
    const course = await Course.findById(req.body.id)
    await req.user.addToCart(course)
    res.redirect('/card')
})

router.delete('/remove/:id',auth, async (req, res) => {
    await req.user.removeFromCart(req.params.id)

    const user = await req.user.populate('cart.items.courseId')
    const courses = mapCartItems(user.cart)
    const cart = {
        courses, price: computePrice(courses)
    }
    res.status(200).json(cart)

})

module.exports = router