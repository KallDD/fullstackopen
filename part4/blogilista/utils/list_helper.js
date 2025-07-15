const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + (blog.likes || 0), 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null
  return blogs.reduce((max, blog) => (blog.likes > max.likes ? blog : max), blogs[0])
}

const  mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const knownAuthors = []
  let mostBlogs = {
    author: '',
    blogs: 0
  }

  blogs.forEach(blog => {
    let author = blog.author
    let count = 0

    if (knownAuthors.includes(author)) {
      return
    } else {
      knownAuthors.concat(author)
    }
 
    blogs.forEach(blog => {
      if (author === blog.author){
        count += 1
      }
    })

    if (count > mostBlogs.blogs) {
      mostBlogs.author = author
      mostBlogs.blogs = count
    }
  });

  return mostBlogs
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null
  
  let mostLikes = {
    author: '',
    likes: 0
  }

  blogs.forEach(blog => {
    if (mostLikes.likes < blog.likes) {
      mostLikes.author = blog.author
      mostLikes.likes = blog.likes
    }
  })

  return mostLikes
} 


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}