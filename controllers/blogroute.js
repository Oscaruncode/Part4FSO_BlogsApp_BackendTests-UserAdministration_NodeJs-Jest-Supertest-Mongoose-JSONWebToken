const blogRouter = require("express").Router()
const Blog = require("../models/blog")
const User = require("../models/user")


blogRouter.get('/',async (request, response) => {
  const blogs = await Blog.find({}).populate("user", {username: 1, name: 1, id: 1})
  response.json(blogs)
  })
  
blogRouter.post('/',async (request, response) => {

    if (!request.body.title || !request.body.url) {  
      return response.status(400).json({error:"Invalid request, No title or Url"})
    }

    if(!request.token || !request.decodedToken){
      return response.status(401).json({error:"token missing or invalid"}) 
    }

    // let user = request.user     FOR GIVE A RANDOM USER FOR BLOGS WITHOUT AUTHOR
    // if(request.user == null || request.user== undefined){
    //   user = await User.find({}).limit(1)
    //   user = user[0]
    // }
 
    let user = await User.findById(request.decodedToken.id)

    const blog = new Blog({
    title:request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes,
    user: user._id
  })

    await blog.save()
    user.blogs = user.blogs.concat(blog._id)
    await user.save()

    const blogSaved = await Blog.findById(blog._id).populate("user", {username: 1, name: 1, id: 1})

    response.status(201).json(blogSaved)

  })



blogRouter.delete("/:id", async(request,response) =>{
  
  if(!request.token || !request.decodedToken){
    return response.status(401).json({error:"token missing or invalid"}) 
  }
  try{
    const blog = Blog.findById(request.params.id)
    if(blog.user.toString() === request.decodedToken.id.toString()){
      await Blog.findByIdAndRemove(request.params.id)
      response.status(204).end()
    }else{
      response.status(400).end
    }
  }catch(error){response.status(400).end}

}
)

blogRouter.put('/:id',async (request, response) => {
  
  const blog = {
    title:request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes,
  }

  const blogUpdated = await Blog.findByIdAndUpdate(request.params.id, blog, {new:true})
  response.json(blogUpdated)

})

module.exports = blogRouter