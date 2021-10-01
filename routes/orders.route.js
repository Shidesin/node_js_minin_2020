const {Router} = require('express')
const auth = require('../middleware/auth.middleware')
const Order = require('../models/order.model')

const router = Router()

router.get('/',auth, async (req, res) => {
    try {
        const allOrders = await Order.find({
            'user.userId': req.user._id
        }).populate('user.userId')

        const orders = allOrders.map((order) => {
            const {user, courses, date, _id} = order._doc
            return {
                user: {...user.userId._doc},
                courses: courses.map((c) => ({
                    title: c.course.title,
                    count: c.count
                })),
                date,
                _id,
                price: order.courses.reduce((total, _) => {
                    return total += _.count * _.course.price
                }, 0)
            }
        })


        res.render('orders', {
            title: 'Orders',
            orders: orders,
            isOrders: true,
        })
    } catch (err) {
        console.log(err)
    }


})

router.post('/', auth, async (req, res) => {
    try {
        const user = await req.user.populate('cart.items.courseId')

        const courses = user.cart.items.map((item) => ({
            count: item.count,
            course: {...item.courseId._doc}
        }))

        const order = new Order({
            user: {
                name: req.user.name,
                userId: req.user
            },
            courses: courses
        })

        await order.save()
        await req.user.clearCart()

        res.redirect('/orders')
    } catch (err) {
        console.log(err)
    }

})

module.exports = router