const express = require('express')
const app = express()
app.use(express.json())
const control = require('../controllers/menuController')
const auth = require('../auth/auth')
const {checkRole} = require('../middleware/checkRole')

app.post("/add", auth.authVerify, checkRole(["admin"]), control.addMenu) 
app.put("/update/:id", auth.authVerify, checkRole(["admin"]), control.editMenu) 
app.delete("/delete/:id", auth.authVerify, checkRole(["admin"]), control.deleteMenu)
app.get("/getAll", auth.authVerify, checkRole(["admin", "kasir", "manajer"]), control.getAllMenu) 
app.get("/getAlll", control.getAllMenu) 
app.get("/search", auth.authVerify, checkRole(["admin", "kasir", "manajer"]), control.searchMenu) 
app.get("/getID/:id", auth.authVerify, checkRole(["admin"]), control.getById)

module.exports = app