const router = require('express').Router();
const Blog = require('../models/blog');

router.get('/', (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs)
  })
})

router.post('/', (request, response) => {
  const blog = new Blog(request.body)

  if (!blog.title || !blog.url) {
    return response.status(400).json({ error: 'Title and URL are required' })
  }

  blog.save().then((result) => {
    response.status(201).json(result)
  })
})

router.delete('/:id', async (request, response) => {
  const id = request.params.id
  try{
    await Blog.findByIdAndDelete(id)
    response.status(204).end()
  }catch (error) {
    response.status(400).end()
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

module.exports = router;