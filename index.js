// config inicial
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const app = express()

//forma de ler JSON - middleware

app.use(
    express.urlencoded({
        extended:true
    })
)

app.use(express.json())

// rotas da API

const houseRoutes = require('./routes/houseRoutes')
app.use('/api/house', houseRoutes)

const personRoutes = require('./routes/personRoutes')
app.use('/api/person', personRoutes)

// rota inicial / endpoint

const DB_USER = process.env.DB_USER
const DB_PASSWORD = encodeURIComponent(process.env.DB_PASSWORD)

// entregar uma porta
mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.v1csapm.mongodb.net/?retryWrites=true&w=majority`)
.then(()=>{
    console.log("Conectado com o banco!")
    app.listen(3000)
})
.catch((err)=>{
    console.log(err)
})

