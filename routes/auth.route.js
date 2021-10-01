const {Router} = require('express')
const bcrypt = require('bcryptjs')
const User = require('../models/user.model')

const router = Router()

router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: "Sign",
        isLogin: true,
        errorLogin: req.flash('errorLogin'),
        errorRegister: req.flash('errorRegister'),
    })
})

router.get('/logout', async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/')
    })

})

router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body

        const candidate = await User.findOne({email})

        if (!candidate) {
            req.flash('errorLogin', 'no such user exists')
            return res.redirect('/auth/login#login')
        }
        const areSame = await bcrypt.compare(password, candidate.password)
        if (!areSame) {
            req.flash('errorLogin', 'Incorrect password')
            return res.redirect('/auth/login#login')
        }
        req.session.user = candidate
        req.session.isAuthenticated = true
        req.session.save((err) => {
            if (err) throw err;
            res.redirect('/')
        })


    } catch (err) {

    }
    const user = await User.findById('6156c7e448205651d52bc708')


})

router.post('/register', async (req, res) => {
    try {
        const {email, name, password, confirm} = req.body

        const candidate = await User.findOne({email})
        if (candidate) {
            req.flash('errorRegister', 'User with this email already exists')
            res.redirect('/auth/login#register')
        }

        const hashPassword = await bcrypt.hash(password, 10)

        const user = await User({
            email, name, password: hashPassword, cart: {items: []}
        })

        user.save()
        res.redirect('/auth/login#login')

    } catch (err) {
        console.log(err)
    }
})

module.exports = router