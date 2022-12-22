const mongoose= require("mongoose")
const app = require("../app")
const supertest = require ("supertest")

const api = supertest(app)
const Blog = require("../models/blog")


const initialBlogs = [
    {
      _id: "5a422a851b54a676234d17f7",
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
      __v: 0
    },
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0
    },
    {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0
    },
    {
      _id: "5a422b891b54a676234d17fa",
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      likes: 10,
      __v: 0
    },
    {
      _id: "5a422ba71b54a676234d17fb",
      title: "TDD harms architecture",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
      likes: 0,
      __v: 0
    },
    {
      _id: "5a422bc61b54a676234d17fc",
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2,
      __v: 0
    }
  ]


beforeEach(async()=>{
    await Blog.deleteMany({})
    await Blog.insertMany(initialBlogs)
}
)

describe("getting data properly", () => {
  test( "Blogs are returned as Json format", async() => {
    await api.get("/api/blogs").expect(200).expect('Content-Type', /application\/json/)
})

test("Return the right amount of blogs", async() => {
    const response = await api.get("/api/blogs")
    expect(response.body).toHaveLength(initialBlogs.length)
})

test("Id exist", async()=>{
  const blogs = await api.get("/api/blogs")
  expect(blogs.body[0].id).toBeDefined()
})
})

describe("Adding Blogs", () => {
  test("Creating a new blog", async()=>{
    const newBlog = {
      title: "Hhhhhhhhhhhhhhhhhhhh",
      author: "Sasdasdas",
      url: "errrrrrrrrrrrrrrrrrr.com/"
    }
    await api.post("/api/blogs").send(newBlog)
    const response = await api.get("/api/blogs")
    expect(response.body).toHaveLength(initialBlogs.length + 1)
  
  })
  
  
  test("The content of a new blog is saved rightly", async()=>{
    const newBlog = {
      title: "This is the content of a new note",
      author: "Sasdasdas",
      url: "errrrrrrrrrrrrrrrrrr.com/"
    }
    await api.post("/api/blogs").send(newBlog)
  
    const response = await api.get("/api/blogs")
    const titles = (response.body.map(r=>r.title))
    expect(titles).toContain(newBlog.title)
  })
}
)

describe("Missing information in the request", ()=>{

  test("Missing likes must be zero value in property", async()=>{
    const newBlog = {
      title: "Titte",
      author: "errascq",
      url: "tw.com/"
    }
  
    const addedBlog = await api.post("/api/blogs").send(newBlog).expect(201).expect('Content-Type', /application\/json/)
    const processedBlogToView = JSON.parse(JSON.stringify(addedBlog.body))
    expect(processedBlogToView).toHaveProperty('likes', 0)
  
  })

  test("Missing title or url the blog is not saved and return 400",async()=>{  
    const newBlog = {
      author: "errascq"
    }

      const blogSend = await api.post("/api/blogs").send(newBlog)  

      expect(blogSend.statusCode ).toBe(400)

      const response = await api.get("/api/blogs")
      expect(response.body).toHaveLength(initialBlogs.length)
   
    })

})



describe("Deleting data test", ()=>{

 test("Return 204 after Delete", async () =>{
 const deleteBlog = await api.delete(`/api/blogs/${initialBlogs[0]._id}`)
 expect(deleteBlog.statusCode).toBe(204)
 })

 test(" lenght after delete most be lenght minus one", async () =>{
  await api.delete(`/api/blogs/${initialBlogs[0]._id}`)
  const dataAfterDelet = await api.get("/api/blogs")
  expect(dataAfterDelet.body).toHaveLength(initialBlogs.length-1)
 })

})



describe("Updating data", ()=>{

  test("Updating likes from initial to 999 in the first element of the initialBlogs array", async () =>{

    const updateinfo = {likes:999}

  const updatedblog = await api.put(`/api/blogs/${initialBlogs[0]._id}`).send(updateinfo)
  const blogsUpdate = await api.get("/api/blogs")
  expect(blogsUpdate.body[0]["likes"]).toBe(updatedblog.body.likes)
  })
 
 
 })



afterAll(()=> mongoose.connection.close())