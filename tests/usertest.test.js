const mongoose= require("mongoose")
const app = require("../app")
const supertest = require ("supertest")

const api = supertest(app)
const User = require("../models/user")
const Blog = require("../models/blog")
const user = require("../models/user")



beforeEach(async()=>{
    await Blog.deleteMany({})
    await User.deleteMany({})
}
)



describe("Creating users", () => {

    test( "a valid user can is created", async() => {
         await api.post("/api/users").send({"username":"ozk123","name":"oscar","password":"1321456"}).expect(201)
        const userinDb = await api.get("/api/users")
        expect(userinDb.body).toHaveLength(1)
  })

    test( "An user with password length < 3 not be save", async() => {
   const userInvalid = await api.post("/api/users").send({username:"ozk123",name:"kajsnye", password:"16"}).expect(400)
   expect(userInvalid.body.error).toBe("Password must be at least 3 lenght")
})

    test( "Username must be unique", async() => {
    await api.post("/api/users").send({username:"ozk123",name:"oscar", password:"1321456"}).expect(201)

    const userRepeat = await api.post("/api/users").send({username:"ozk123",name:"oscar", password:"51436"}).expect(400)
    expect(userRepeat.body.error).toBe("username must be unique")
})


test( "An user that not contain name throw error and not be save", async() => { 
    await api.post("/api/users").send({username:"ozk123", password:"1321456"}).expect(400)

    const userinDb = await api.get("/api/users")
        expect(userinDb.body).toHaveLength(0)
})

test( "An user with name length < 3 not be save", async() => {  
    await api.post("/api/users").send({username:"oz", password:"1321456"}).expect(400)

    const userinDb = await api.get("/api/users")
        expect(userinDb.body).toHaveLength(0)
})


})
