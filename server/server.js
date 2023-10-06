const express = require('express')
const cors = require('cors')
const User = require('./router/Users')


const app = express()

// middleware

app.use(cors())

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

// Port number 

const PORT = process.env.PORT || 8080

// Routers

app.use('/users', User)

//static Images Folder

app.use('/Images', express.static('./Images'))



app.listen(PORT, () => {
    console.log(`server is running on port 8080`)
})