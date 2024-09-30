const express = require('express')
const app = express()
const control = require('../controllers/mejaController')
const auth  = require('../auth/auth')
const {checkRole} = require('../middleware/checkRole') 
app.use(express.json())

app.get("/getAll", auth.authVerify, checkRole(["admin","kasir"]), control.getAllMeja)
app.get("/getID/:id", auth.authVerify, checkRole(["admin"]), control.getByID)
app.get("/getStatus/:status", auth.authVerify, checkRole(["admin"]), control.getByStatus)
app.get("/search/:nomor_meja", auth.authVerify, checkRole(["admin"]), control.searchMeja)
app.post("/add", auth.authVerify, checkRole(["admin"]), control.addMeja)
app.put("/update/:id", auth.authVerify, checkRole(["admin"]), control.updateMeja)
app.delete("/delete/:id", auth.authVerify, checkRole(["admin"]), control.deleteMeja)

module.exports = app