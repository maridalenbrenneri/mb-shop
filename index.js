const express = require('express')
const app = express()
const PORT = process.env.PORT || 5001

app.use(express.static(__dirname + '/client/dist/mb-shop'));

app.get('/hello', (req, res) => res.send('Hello Node and Heroku, Maridalen Brenneri is coming up!'))

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))