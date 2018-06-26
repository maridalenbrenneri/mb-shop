const express = require('express')
const app = express()
const PORT = process.env.PORT || 5001

app.get('/', (req, res) => res.send('Hello Node and Heroku, Maridalen Brenneri is coming up!'))

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))