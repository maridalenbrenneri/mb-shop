const express = require('express')
const app = express()

app.get('/', (req, res) => res.send('Hello Node and Heroku, Maridalen Brenneri is coming up!'))

app.listen(5000, () => console.log('Example app listening on port 5000!'))