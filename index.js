const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const mongoose = require('mongoose');

const User = require('./models/user.model')

const homeRoute = require('./routes/home.route')
const addCourseRoutes = require('./routes/add.route')
const coursesRoute = require('./routes/courses.route')
const cardRoute = require('./routes/card.route')
const ordersRoute = require('./routes/orders.route')

const app = express();
const PORT = process.env.PORT || 3000

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
})
app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(async(req,res, next) => {
    try{
        const user = await User.findById('6154591f60bc574d951827f9')
        req.user = user
        next()
    }  catch (err) {
        console.log(err)
    }
})

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))
app.use('/', homeRoute)
app.use('/add', addCourseRoutes)
app.use('/courses', coursesRoute)
app.use('/card', cardRoute)
app.use('/orders', ordersRoute)


const start = async () => {
    try {
        const url = 'mongodb+srv://alez:l7SEUZO8giwmr4QN@cluster0.d5fqe.mongodb.net/shop'
        await mongoose.connect(url)

        const candidate = await User.findOne()
        if (!candidate){
            const user = new User({
                email: 'test@mail.com',
                name: 'admin'          ,
                cart: {items: []}
            })

            await user.save()
        }

        app.listen(PORT, () => {
            console.log(`Server running in port: ${PORT}`)
        })
    } catch (e) {
        console.log(e)
    }
}


start()



