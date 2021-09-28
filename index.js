const http = require('http')
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    if (req.method === 'GET') {

        res.writeHead(200, {
            'Content-Type': 'text/html',
        })

        if (req.url === '/') {
            fs.readFile(
                path.join(__dirname, 'views', 'index.html'),
                'utf-8',
                (err, content) => {
                    if (err) {
                        throw err
                    }
                    res.end(content)
                })
        }

        if (req.url === '/about') {
            fs.readFile(
                path.join(__dirname, 'views', 'about.html'),
                'utf-8',
                (err, content) => {
                    if (err) {
                        throw err
                    }
                    res.end(content)
                })
        }

        if (req.url === '/api/users'){
              res.writeHead(200, {
                  "Content-Type": 'text/json'
              })

            const users = [
                {name: 'user1', age: 11},
                {name: 'user2', age: 21}
            ]

            res.end(JSON.stringify(users))
        }


    }
    if (req.method === 'POST') {

        res.writeHead(200, {
            'Content-Type': 'text/html; charset=utf-8',
        })

        let body = []

        req.on('data', (data) => {
            body.push(Buffer.from(data))
        })
        req.on('end', () => {
            const [_, message] = body.toLocaleString().split('=')

            res.end(`
            <h1>You message:  ${message}</h1> 
        `)
        })


    }
})

server.listen(3000, () => {
    console.log('server listening on')
})  