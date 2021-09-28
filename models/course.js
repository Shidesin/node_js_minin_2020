const fs = require('fs');
const path = require('path');
const {v4: uuidv4} = require('uuid');

class Course {
    constructor(title, price, img) {
        this.title = title
        this.price = price
        this.img = img
        this.id = uuidv4()
    }

    toJSON() {
        return ({
            title: this.title,
            price: this.price,
            img: this.img,
            id: this.id
        })
    }

    async save() {
        const courses = await Course.getAll()
        courses.push(this.toJSON())
        return new Promise((resolve, reject) => {
            fs.writeFile(
                path.join(__dirname, '../', 'db', 'courses.json'),
                JSON.stringify(courses),
                (err) => {
                    if (err) reject(err)
                    resolve()
                }
            )
        })
    }

    static async update(course) {
        const courses = await Course.getAll()

        const updateCourseIndex = courses.findIndex((c) => c.id === course.id)
        
        const updatedCourses = [...courses]

        updatedCourses[updateCourseIndex] = course

        return new Promise((resolve, reject) => {
            fs.writeFile(
                path.join(__dirname, '../', 'db', 'courses.json'),
                JSON.stringify(updatedCourses),
                (err) => {
                    if (err) reject(err)
                    resolve()
                }
            )
        })

    }

    static getAll() {
        return new Promise((resolve, reject) => {
            fs.readFile(
                path.join(__dirname, '../db/courses.json'),
                'utf-8',
                (err, content) => {
                    if (err) reject(err);
                    resolve(JSON.parse(content))
                }
            )
        })

    }

    static async getById(id) {
        const courses = await Course.getAll()
        return courses.find((course) => course.id === id)
    }
}

module.exports = Course