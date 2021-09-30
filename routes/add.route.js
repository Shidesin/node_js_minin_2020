const {Router} = require('express')
const Course = require('../models/course.model')

const router = Router()

router.get('/', (req, res, next) => {
    res.render('add', {
        title: 'Add course',
        isAdd: true,
    })
})

router.post('/', async (req, res) => {
    try{

        const course = new Course({
            title: req.body.title,
            price: req.body.price,
            img: req.body.img,
            userId: req.user._id
        })

        await course.save()
        res.redirect('/courses')
    }  catch (e) {
        console.log(e)
    }
})


module.exports = router 