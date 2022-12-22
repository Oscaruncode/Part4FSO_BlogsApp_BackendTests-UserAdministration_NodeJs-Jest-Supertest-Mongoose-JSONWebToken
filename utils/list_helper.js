

// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return  blogs.length===0 ? 0 : blogs.reduce( (prev,act ) => prev + act.likes , 0)
}

const favoriteBlog = (blogs) => {
  return blogs.length===0 ? "there are no blogs" : blogs.reduce((prev,act) => {if(act.likes>prev.likes){return act}else{return prev } },blogs[0])
}



const mostBlogs = (blogs) => {

  if(blogs.length===0){return "there are no blogs"}

  const blogsAutors = Array.from(new Set(blogs.map(blog => blog.author)))

  const authorWithAmount = blogsAutors.map(author => {
    const amounth = blogs.filter(blog => blog.author===author).length
    return { author:author, blogs:amounth }
  })

  const mostBlog = authorWithAmount.reduce((prev,act) => act.blogs>prev.blogs? act :prev, authorWithAmount[0] )

  return mostBlog

}



const mostAuthorLikes = (blogs) => {

  if(blogs.length===0){return "there are no blogs"}

  const blogsAutors = Array.from(new Set(blogs.map(blog => blog.author)))

  const mostLikesAuthor = blogsAutors.map(el => {
    return blogs.filter(blog => blog.author===el).reduce( (prev,act) => { return { "author":act.author,"likes":prev.likes+act.likes } } ,{ likes:0 }    )
  })
  return mostLikesAuthor.reduce( (prev,act) => act.likes>prev.likes?act:prev ,mostLikesAuthor[0])
}







module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostAuthorLikes
}

