const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session')
const csrf = require('csurf')
const flash = require('connect-flash');
const MongoStore = require('connect-mongodb-session')(session)

const varMiddleware = require('./middleware/variables')
const userMiddleware = require('./middleware/user.middleware')

const homeRoute = require('./routes/home.route')
const addCourseRoutes = require('./routes/add.route')
const coursesRoute = require('./routes/courses.route')
const cardRoute = require('./routes/card.route')
const ordersRoute = require('./routes/orders.route')
const authRouter = require('./routes/auth.route')

const keys = require('./keys')
//create new branch

const app = express();
const PORT = process.env.PORT || 3000
// const MONGODB_URI = 'mongodb://localhost:27017/node_js_minin'

const store = new MongoStore({
    collection: 'sessions',
    uri: keys.MONGODB_URI
})

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
})
app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')


app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))
app.use(session({
    secret: keys.secretKey,
    resave: false,
    saveUninitialized: false ,
    store
}))
app.use(csrf())
app.use(flash())
app.use(varMiddleware)
app.use(userMiddleware)

app.use('/', homeRoute)
app.use('/add', addCourseRoutes)
app.use('/courses', coursesRoute)
app.use('/card', cardRoute)
app.use('/orders', ordersRoute)
app.use('/auth', authRouter)


const start = async () => {
    try {
        // const url = 'mongodb+srv://alez:l7SEUZO8giwmr4QN@cluster0.d5fqe.mongodb.net/shop'
        
        await mongoose.connect(keys.MONGODB_URI,{
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        app.listen(PORT, () => {
            console.log(`Server running in port: ${PORT}`)
        })
    } catch (e) {
        console.log(e)
    }
}


start()



