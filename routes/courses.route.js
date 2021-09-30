const {Router} = require('express')
const Course = require('../models/course.model')

const router = Router()

router.get('/', async (req, res, next) => {
    const allCourses = await Course.find().lean().populate('userId', 'email name ')
    res.render('courses', {
        title: 'Courses',
        isCourses: true,
        allCourses,
    })
})

router.get('/:id/edit', async (req, res) => {
    if (!req.query.allow) return res.redirect('/')
    const course = await Course.findById(req.params.id).lean()
    res.render('course-edit', {
        title: `Edit ${course.title}`,
        course
    })
})

router.get('/:id', async (req, res, next) => {
    const course = await Course.findById(req.params.id).lean()
    res.status(200)
    res.render('course', {
        layout: 'empty',
        title: `Course ${course.title}`,
        course,
    })
})

router.post('/edit', async (req, res) => {
    const {id, ...rest} = req.body
    await Course.findOneAndUpdate(id, {...rest}).lean()
    res.redirect('/courses')
})

router.post('/remove', async (req, res) => {
    await Course.deleteOne({_id: req.body.id})
    res.redirect('/courses')
})


module.exports = router 