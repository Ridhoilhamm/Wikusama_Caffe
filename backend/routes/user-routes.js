const express = require('express')
const app = express()
const control = require('../controllers/userController')
const auth  = require('../auth/auth')
const {checkRole} = require('../middleware/checkRole') 
app.use(express.json())

app.post("/login", control.Login) 
app.delete("/logout", control.Logout)
app.put("/resetpassword/:id", control.resetpassword) 
app.post("/add", control.addUser) 
app.get("/allUser", auth.authVerify, checkRole(["admin"]), control.getAllUser)
app.get("/getID/:id", auth.authVerify, checkRole(["admin"]), control.getById) 
app.get("/search", auth.authVerify, checkRole(["admin"]), control.searchUser) 
app.put("/update/:id", auth.authVerify, checkRole(["admin"]), control.updateUser) 
app.delete("/delete/:id", auth.authVerify, checkRole(["admin"]), control.deleteUser) 

module.exports = app