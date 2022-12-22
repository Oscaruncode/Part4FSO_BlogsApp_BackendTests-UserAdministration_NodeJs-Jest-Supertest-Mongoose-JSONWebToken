const User = require("../models/user")
const userRoute = require("express").Router()
const bycript = require("bcrypt")


userRoute.get("/", async (request,response) => {
    const users = await User.find({}).populate("blogs")
    response.json(users)
})

userRoute.post("/", async (request,response) => {
    
    const {username,name,password} = request.body

    const existingUser = await User.findOne({ username })

    if(existingUser){
        return response.status(400).json({error:"username must be unique"})
    }

    if(name===undefined || password===undefined){
        return response.status(400).json({error:"Name and Password must de send"})
    }
    if(password.length < 3 ){  return response.status(400).json({error:"Password must be at least 3 lenght"}) }
    if(name.length < 3 ){  return response.status(400).json({error:"Name must be at least 3 lenght"}) }

    const saltround = 10
    const passwordHash = await bycript.hash(password, saltround)


   const user = new User({
        name:name,
        username:username,
        passwordHash:passwordHash})

    const userSaved = await user.save()
    response.status(201).json(userSaved)

})


module.exports = userRoute