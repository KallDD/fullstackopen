const jwt = require('jsonwebtoken')
const router = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const { userExtractor } = require('../utils/middleware')

router.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {
    username: 1,
  })
  response.json(blogs)
})

router.post('/', userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  if (!blog.title || !blog.url) {
    return response.status(400).json({ error: 'Title and URL are required' })
  }

  const result = await blog.save()
  user.blogs = user.blogs.concat(result._id)
  await user.save()

  response.status(201).json(result)

})

router.delete('/:id', userExtractor, async (request, response) => {
  const id = request.params.id
  const user = request.user

  const toDelete = await Blog.findById(id)

  if (!toDelete) {
    return response.status(404).json({ error: 'Blog not found' })
  }

  if (toDelete.user._id.equals(user._id)) {
    try{
      await Blog.findByIdAndDelete(id)
      return response.status(204).end()
    }catch (error) {
      return response.status(400).end()
    }
  } else {
    return response.status(403).json({ error: 'User not authorized to delete this blog' })
  }
  
})

router.put('/:id', async (request, response) => {
  const id = request.params.id
  const updatedBlog = request.body

 try{
    let blogToUpdate = await Blog.findById(id)
    if (!blogToUpdate) {
      return response.status(404).end()
    }

    blogToUpdate.title = updatedBlog.title
    blogToUpdate.author = updatedBlog.author
    blogToUpdate.url = updatedBlog.url
    blogToUpdate.likes = updatedBlog.likes

    const result = await blogToUpdate.save()
    response.status(200).json(result)

  } catch (error) {
    response.status(400).end()
  }
}) 

module.exports = router