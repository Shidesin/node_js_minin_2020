const {Router} = require('express')
const Course = require('../models/course')

const router = Router()

router.get('/', async (req, res, next) => {
    const allCourses = await Course.getAll()
    res.status(200)
    res.render('courses', {
        title: 'Courses',
        isCourses: true,
        allCourses,
    })
})

router.get('/:id/edit', async (req, res) => {
    if (!req.query.allow) return res.redirect('/')
    const course = await Course.getById(req.params.id)
    res.render('course-edit', {
        title: `Edit ${course.title}`,
        course
    })
})

router.get('/:id', async (req, res, next) => {
    const course = await Course.getById(req.params.id)

    res.status(200)
    res.render('course', {
        layout: 'empty',
        title: `Course ${course.title}`,
        course,
    })
})

router.post('/edit', async (req, res) => {
    await Course.update(req.body)
    res.redirect('/courses')
})


module.exports = router 