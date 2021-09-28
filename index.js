const express = require('express');
const exphbs  = require('express-handlebars');

const homeRoute = require('./routes/home.route')
const addCourseRoutes = require('./routes/add.route')
const coursesRoute = require('./routes/courses.route')
const cardRoute = require('./routes/card.route')

const app = express();

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
})
app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))
app.use('/',homeRoute)
app.use('/add',addCourseRoutes)
app.use('/courses',coursesRoute)
app.use('/card', cardRoute)


const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server running in port: ${PORT}`)
})

