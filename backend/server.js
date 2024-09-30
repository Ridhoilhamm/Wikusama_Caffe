const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser =require('cookie-parser')

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true
}))
app.use(cookieParser())
app.use(express.static(__dirname))

const userRoute = require('./routes/user-routes')
app.use(`/user`, userRoute)
const menuRoute = require('./routes/menu-routes')
app.use(`/menu`, menuRoute)
const mejaRoute = require('./routes/meja-routes')
app.use(`/meja`, mejaRoute)
const transaksiRoute = require('./routes/transaksi-routes')
app.use(`/transaksi`, transaksiRoute)

app.listen(8000, () => {
    console.log("running")
})